"""Serviço local que fala com o ar Midea. Sem token/key, roda em modo simulado."""
import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
HOST = os.getenv("AC_HOST", "192.168.15.4")
PORT = int(os.getenv("AC_PORT", "6444"))
DEVICE_ID, TOKEN, KEY = os.getenv("AC_DEVICE_ID", ""), os.getenv("AC_TOKEN", ""), os.getenv("AC_KEY", "")
MOCK = not (DEVICE_ID and TOKEN and KEY)

state = dict(online=True, mock=MOCK, host=HOST, power=True, mode="cool", target=22, indoor=27, fan=0,
             turbo=False, silent=False, sleep=False, swing=False, light=True, xfan=False)


class Patch(BaseModel):
    power: Optional[bool] = None
    mode: Optional[str] = None
    target: Optional[int] = None
    fan: Optional[int] = None
    turbo: Optional[bool] = None
    silent: Optional[bool] = None
    sleep: Optional[bool] = None
    swing: Optional[bool] = None
    light: Optional[bool] = None
    xfan: Optional[bool] = None


app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ---- Modo real (msmart-ng). Ajuste os nomes conforme a versão instalada. ----
_ac = None


async def _device():
    global _ac
    if _ac is None:
        from msmart.device import AirConditioner as AC
        _ac = AC(ip=HOST, port=PORT, device_id=int(DEVICE_ID))
        await _ac.authenticate(TOKEN, KEY)
    return _ac


async def real_read():
    from msmart.device import AirConditioner as AC
    ac = await _device()
    await ac.refresh()
    modes = {AC.OperationalMode.AUTO: "auto", AC.OperationalMode.COOL: "cool", AC.OperationalMode.DRY: "dry",
             AC.OperationalMode.FAN_ONLY: "fan", AC.OperationalMode.HEAT: "heat"}
    state.update(online=ac.online, power=ac.power_state, mode=modes.get(ac.operational_mode, "auto"),
                 target=int(ac.target_temperature), indoor=int(ac.indoor_temperature or 0),
                 turbo=ac.turbo, swing=bool(ac.swing_mode), light=getattr(ac, "display_on", True))


async def real_write(p: dict):
    from msmart.device import AirConditioner as AC
    ac = await _device()
    modes = {"auto": AC.OperationalMode.AUTO, "cool": AC.OperationalMode.COOL, "dry": AC.OperationalMode.DRY,
             "fan": AC.OperationalMode.FAN_ONLY, "heat": AC.OperationalMode.HEAT}
    if "power" in p: ac.power_state = p["power"]
    if "mode" in p: ac.operational_mode = modes[p["mode"]]
    if "target" in p: ac.target_temperature = p["target"]
    if "turbo" in p: ac.turbo = p["turbo"]
    if "fan" in p: ac.fan_speed = 102 if p["fan"] == 0 else p["fan"] * 20
    await ac.apply()


@app.get("/state")
async def get_state():
    if not MOCK:
        try: await real_read()
        except Exception: state["online"] = False
    return state


@app.post("/state")
async def post_state(patch: Patch):
    p = patch.model_dump(exclude_none=True)
    state.update(p)
    if not MOCK:
        try: await real_write(p)
        except Exception: state["online"] = False
    return state
