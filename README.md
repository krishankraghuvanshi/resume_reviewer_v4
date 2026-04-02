# Resume Reviewer

A full-stack application for reviewing resumes. It consists of a React frontend and a Node.js/Express backend using PostgreSQL, OpenAI API, and Apache Tika for document parsing.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16.x or higher)
- **PostgreSQL** (Ensure the service is running locally on port 5432)
- **Docker** (Optional, for running Apache Tika easily)
- An **OpenAI API Key**

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/resume_reviewer_v3.git
cd resume_reviewer_v3
```

### 2. Install Dependencies
This project uses npm workspaces. You can install all dependencies for both the frontend and backend with a single command from the root directory:
```bash
npm install
```

### 3. Environment Variables (Backend)
Navigate to the `backend` directory and create a `.env` file (you can view `.env.example` if available, or use the format below):
```bash
# In backend/.env
PORT=3000
DATABASE_URL=postgresql://localhost:5432/resumereviewer
TIKA_URL=http://localhost:9998
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Database Setup
Ensure your local PostgreSQL instance is running. The project provides an initialization script to automatically create the database and required tables.
Run the setup command from the backend workspace:
```bash
npm run setup-db --workspace=backend
```
*Note: This connects to your default `postgres` database to create the `resumereviewer` schema. Ensure your `DATABASE_URL` is correct.*

### 5. Setup Apache Tika
The backend relies on Apache Tika for parsing resumes. You can run Tika locally using Docker:
```bash
docker run -d -p 9998:9998 apache/tika:latest
```

## Running the Application

Once everything is set up, you can start both the frontend and backend servers concurrently from the root directory:

```bash
# From the root directory
npm run dev
```

This will run:
- The backend server on [http://localhost:3000](http://localhost:3000)
- The React frontend development server on [http://localhost:3001](http://localhost:3001) (Proxy is configured)

## Additional Scripts
- `npm run start:backend`: Start only the backend server
- `npm run start:frontend`: Start only the frontend React application
