# Resume Reviewer - Integrated Frontend & Backend

This project now includes both frontend (React) and backend (Express) in a single folder structure.

## 📁 Project Structure

```
rr-fe/
├── src/                    # React frontend code
│   ├── components/         # React components
│   ├── services/          # API service (api.js)
│   ├── App.jsx
│   └── index.js
├── backend-src/           # Backend Express server code
│   ├── api/               # Route handlers
│   ├── controllers/       # Business logic
│   ├── services/          # Service layer (PDF parsing, LLM, etc)
│   ├── db/                # Database schema and connection
│   ├── middlewares/       # Express middlewares
│   └── utils/             # Helper utilities
├── public/                # Frontend static files
├── server.js              # Integrated backend server
├── server-mock.js         # Mock backend for testing (no DB needed)
├── init-db.js             # Database initialization script
├── .env                   # Frontend config
├── .env.backend           # Backend config (PostgreSQL, OpenAI, etc)
└── package.json           # Combined dependencies
```

## 🚀 Quick Start

### Option 1: Run with Mock Backend (No Database Required)

```bash
# Install dependencies
npm install

# Start both frontend and backend (mock mode)
npm run dev:mock
```

This will:

- ✅ Start mock backend server on http://localhost:3000
- ✅ Start React frontend on http://localhost:3001
- ✅ No database or external services needed
- ✅ Perfect for testing and development

### Option 2: Run with Real Backend (Database Required)

#### Prerequisites:

1. **PostgreSQL** - installed and running
2. **Apache Tika** - for PDF text extraction
3. **OpenAI API Key** - for AI features

#### Setup:

```bash
# 1. Install dependencies
npm install

# 2. Configure backend
# Edit .env.backend with your:
# - DATABASE_URL=postgresql://user:password@localhost:5432/resumereviewer
# - OPENAI_API_KEY=your_key_here
# - TIKA_URL=http://localhost:9998

# 3. Initialize database
npm run setup-db

# 4. Start frontend and backend together
npm run dev
```

## 📜 Available Scripts

### Development

```bash
npm run dev              # Run backend + frontend (real backend)
npm run dev:mock        # Run backend + frontend (mock backend - no DB)
npm run server:dev      # Run only backend with watch mode
npm run server:mock     # Run only mock backend
npm run client          # Run only React frontend
```

### Production

```bash
npm run build           # Build React app for production
npm start               # Run backend server (serves API + React build)
npm run setup-db        # Initialize PostgreSQL database
```

## 🔌 API Endpoints

All endpoints are available at `http://localhost:3000/api`:

### Resume Operations

```
POST   /api/resume/upload         - Upload PDF resume
POST   /api/resume/generate-latex - Generate LaTeX code
POST   /api/resume/download-latex - Download .tex file
POST   /api/resume/enhance        - AI-enhance resume
```

### Dashboard

```
GET    /api/resumes               - List stored resumes
```

### Health Check

```
GET    /health                    - Server health status
```

## 🔧 Configuration

### Frontend Config (.env)

```env
REACT_APP_API_URL=http://localhost:3000
```

### Backend Config (.env.backend)

```env
# Application
PORT=3000
HOST=0.0.0.0
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/resumereviewer

# Apache Tika
TIKA_URL=http://localhost:9998
TIKA_TIMEOUT_MS=15000

# OpenAI
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# Logging
LOG_LEVEL=info
```

## 📦 Backend Setup Details

### Database Initialization

The database is automatically initialized when you run:

```bash
npm run setup-db
```

This:

1. Creates the `resumereviewer` database if it doesn't exist
2. Runs the schema from `backend-src/db/schema.sql`
3. Sets up all required tables

### Real Backend Features

- ✅ **PDF Parsing** - Uses Apache Tika to extract text from PDFs
- ✅ **Resume Extraction** - Uses OpenAI to parse structured resume data
- ✅ **ATS Scoring** - Calculates resume ATS scores with breakdown
- ✅ **Suggestions** - Generates AI-powered improvement suggestions
- ✅ **Storage** - Stores resumes in PostgreSQL database
- ✅ **LaTeX Export** - Generates LaTeX resume code

### Mock Backend Features

- ✅ **Development Testing** - Full API endpoints without external dependencies
- ✅ **In-Memory Storage** - Simulates database with sample data
- ✅ **Mock Responses** - Realistic response structures for testing
- ✅ **No Installation** - Works immediately, no setup required

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different ports
PORT=3002 npm run server:mock
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
psql -U postgres -d postgres

# Reset database
dropdb resumereviewer
npm run setup-db
```

### Frontend Can't Connect to Backend

- Verify backend is running: `curl http://localhost:3000/health`
- Check `.env` has correct `REACT_APP_API_URL`
- Ensure CORS is enabled (it is by default)

## 📚 Architecture

```
User Browser (Frontend)
    ↓
React App (http://localhost:3001)
    ↓
API Calls (axios)
    ↓
Express Backend (http://localhost:3000)
    ↓
┌─────────┬──────────┬──────────┐
│         │          │          │
OpenAI   Tika    PostgreSQL  File Storage
```

## 🚢 Deployment

To deploy both frontend and backend:

```bash
# Build frontend
npm run build

# Backend runs on same server
npm run server
```

The built React app and backend can run together on the same Node.js server.

## 📝 Notes

- **Frontend and Backend are integrated** - Both run from the same folder
- **Can run independently** - Use `npm run server:dev` or `npm run client` separately
- **Real backend is optional** - Mock backend works perfectly for testing
- **Database is optional** - Use mock mode for development without PostgreSQL

---

For more info, check the original backend at:
`/Users/krishankraghuvanshi/Desktop/ResumeReviewer2 2/`
