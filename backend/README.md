# Backend

FastAPI API for authentication, document metadata, PDF ingestion, and semantic retrieval. The optional Telegram bot runs as a second ASGI app.

## Local setup (PowerShell)

```powershell
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

Set a private `JWT_SECRET_KEY` and a working `MONGO_URI` in `.env` before using registration or login. The default `DATABASE_URL` uses a local SQLite file. Start the API from this directory:

```powershell
uvicorn main:app --reload
```

API docs: `http://localhost:8000/docs`.

For the separate Telegram service, also configure Redis, `TELEGRAM_API_KEY`, `WEBHOOK_SECRET`, `WEBHOOK_URL`, and (for live answers) `GOOGLE_API_KEY`. Start it with `uvicorn telegrambot:app --host 0.0.0.0 --port 8001` and configure a public HTTPS webhook. The bot does not set that webhook automatically. See the [root README](../README.md) for detailed environment-variable and service requirements.
