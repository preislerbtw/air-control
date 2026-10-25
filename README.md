# ac-control

Painel para controlar um split Springer Midea pela rede local.

```
client (React)  ->  server (Node + Express)  ->  device-service (Python)  ->  Split
                          |
                       MongoDB
```

## Como rodar

### 1. MongoDB
```
docker compose up -d
```

### 2. Serviço do aparelho (Python)
```
cd device-service
python -m venv .venv
.venv\Scripts\activate          # Windows (Linux/Mac: source .venv/bin/activate)
pip install -r requirements.txt
msmart-ng discover              # descobre IP, ID e versão do protocolo
copy .env.example .env          # preencha com os dados do aparelho
uvicorn main:app --port 8001
```

### 3. Servidor (Node)
```
cd server
npm install
copy .env.example .env
npm run dev
```

### 4. Front-end (React)
```
cd client
npm install
npm run dev
```

Abra http://localhost:5173
