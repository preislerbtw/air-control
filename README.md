# ac-control

Painel do ar-condicionado Midea/Springer na bandeja do Windows (Electron + React + TypeScript + Tailwind) com um serviço local em Python (FastAPI + msmart-ng).

## Rodar
```
npm install
pip install -r device-service/requirements.txt
npm run service     # terminal 1 (porta 8787)
npm run dev         # terminal 2 (ícone aparece na bandeja)
```
Sem token/key o app funciona em **modo simulado**.

## Conectar no ar de verdade
1. `copy .env.example .env`
2. Obtenha Device ID, token e key com `msmart-ng discover` (conta do app Smart Home) e preencha o `.env`.
3. Reinicie `npm run service`.

## Estrutura
- `src/main` – bandeja + janela pop-up (Electron)
- `src/renderer` – interface React/Tailwind
- `device-service` – API local que conversa com o ar
