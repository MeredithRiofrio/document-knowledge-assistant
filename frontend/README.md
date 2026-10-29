# Frontend

React administration panel for managing document categories, subcategories, and PDF records.

When uploading a document, select existing category/subcategory values or type new labels; the backend creates new labels as part of the accepted upload. The dedicated category and subcategory screens also provide create dialogs.

## Install and run (PowerShell)

```powershell
Copy-Item .env.example .env
npm ci
npm start
```

By default, the panel uses `http://localhost:8000/api`. Set `REACT_APP_API_URL` in `.env` to change the API address. Registration and login require the backend API and MongoDB.

## Use fictional demo data

Set `REACT_APP_USE_MSW=true` in `.env` and restart the development server. Seed records live in `src/mocks/data/index.js`; edits made through mock handlers exist only in memory and reset after a reload. In mock mode, use any valid email and a non-empty password to preview the panel; this is a local simulation, not real authentication. Set `REACT_APP_USE_MSW=false` to send requests to the real backend. The mock worker starts only with `npm start` in development; production builds do not enable it.

MSW does not mock authentication, actual PDF files, Gemini, Telegram, or persistent storage. See the [root README](../README.md) for complete setup and service requirements.
