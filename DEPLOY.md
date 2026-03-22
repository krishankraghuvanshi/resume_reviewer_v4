# Deployment Guide

This project can be deployed as a single Node.js service:

1. Build React frontend into `build/`
2. Start Express backend (`server.js`)
3. Express serves both API and static frontend

## Option A: Render (Recommended)

### 1. Push code to GitHub

```bash
git add .
git commit -m "prepare production deployment"
git push
```

### 2. Create a Web Service on Render

Use these settings:

- Environment: `Node`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### 3. Add Environment Variables on Render

Set at least:

- `NODE_ENV=production`
- `PORT=10000` (Render sets this automatically; optional to define)
- `HOST=0.0.0.0`
- `DATABASE_URL=...` (your hosted Postgres URL)
- `OPENAI_API_KEY=...`
- `OPENAI_MODEL=gpt-4o-mini`
- `TIKA_URL=...` (if using Apache Tika in production)

If you are not running Tika in production, you need to modify parsing logic or run in mock mode.

### 4. Optional: Persistent Disk

If you need uploaded resume files to persist, mount a disk and point your storage path to it.

Current local path used by the app:

- `storage/resumes`

## Option B: Railway

Use equivalent commands:

- Build: `npm install && npm run build`
- Start: `npm start`

Set the same environment variables as above.

## Health Check

After deployment, verify:

- `GET /health` returns `{ "ok": true, ... }`

## Local Production Test

Run this before deploying:

```bash
npm run build
npm start
```

Then open:

- `http://localhost:3000/`
- `http://localhost:3000/health`
