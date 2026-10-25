"""Servico que traduz HTTP -> protocolo Midea (msmart-ng).

Escute apenas em localhost: ele nao tem autenticacao.
"""
import os
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from msmart.device import AirConditioner as AC
from pydantic import BaseModel

load_dotenv()

HOST = os.environ["AC_HOST"]
PORT = int(os.getenv("AC_PORT", "6444"))
DEVICE_ID = int(os.getenv("AC_ID", "0"))
TOKEN = os.getenv("AC_TOKEN") or None
KEY = os.getenv("AC_KEY") or None

app = FastAPI(title="device-service")
device = AC(ip=HOST, device_id=DEVICE_ID, port=PORT)
_ready = False


async def ensure_ready() -> None:
    """Autentica (se V3) e le as capacidades uma unica vez."""
    global _ready
    if _ready:
        return
    if TOKEN and KEY:
        await device.authenticate(TOKEN, KEY)
    await device.get_capabilities()
    _ready = True


def snapshot() -> dict:
    return {
        "online": device.online,
        "power": device.power_state,
        "mode": device.operational_mode.name.lower(),
        "targetTemp": device.target_temperature,
        "indoorTemp": device.indoor_temperature,
        "outdoorTemp": device.outdoor_temperature,
        "fan": int(device.fan_speed),
        "swing": device.swing_mode.name.lower(),
        "turbo": device.turbo,
        "silent": device.out_silent,
        "eco": device.eco,
        "sleep": device.sleep,
        "display": device.display_on,
    }


class Control(BaseModel):
    power: Optional[bool] = None
    mode: Optional[str] = None      # auto | cool | dry | heat | fan_only
    targetTemp: Optional[float] = None
    fan: Optional[int] = None       # 1-100 (%), 102 = auto
    swing: Optional[str] = None     # off | vertical | horizontal | both
    turbo: Optional[bool] = None
    silent: Optional[bool] = None
    eco: Optional[bool] = None
    sleep: Optional[bool] = None
    display: Optional[bool] = None


@app.get("/capabilities")
async def capabilities():
    await ensure_ready()
    return {
        "modes": [m.name.lower() for m in device.supported_operation_modes],
        "fanSpeeds": [f.name.lower() for f in device.supported_fan_speeds],
        "swingModes": [s.name.lower() for s in device.supported_swing_modes],
        "turbo": device.supports_turbo,
        "silent": device.supports_out_silent,
        "eco": device.supports_eco,
        "customFan": device.supports_custom_fan_speed,
        "display": device.supports_display_control,
        "minTemp": device.min_target_temperature,
        "maxTemp": device.max_target_temperature,
    }


@app.get("/state")
async def state():
    await ensure_ready()
    await device.refresh()
    if not device.online:
        raise HTTPException(status_code=503, detail="Aparelho offline")
    return snapshot()


@app.post("/control")
async def control(body: Control):
    await ensure_ready()
    await device.refresh()
    try:
        if body.power is not None:
            device.power_state = body.power
        if body.mode is not None:
            device.operational_mode = AC.OperationalMode[body.mode.upper()]
        if body.targetTemp is not None:
            device.target_temperature = body.targetTemp
        if body.fan is not None:
            device.fan_speed = body.fan
        if body.swing is not None:
            device.swing_mode = AC.SwingMode[body.swing.upper()]
        if body.turbo is not None:
            device.turbo = body.turbo
        if body.silent is not None:
            device.out_silent = body.silent
        if body.eco is not None:
            device.eco = body.eco
        if body.sleep is not None:
            device.sleep = body.sleep
        if body.display is not None:
            device.display_on = body.display
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Valor invalido: {e}")
    await device.apply()
    return snapshot()
