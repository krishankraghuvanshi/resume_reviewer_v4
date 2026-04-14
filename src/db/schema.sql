-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    resume_hash TEXT NOT NULL,
    original_filename TEXT,
    local_file_path TEXT,
    ats_score INTEGER,
    parsed_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint: A single email cannot upload the SAME file twice
    -- (Based on file content hash)
    UNIQUE(email, resume_hash)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_email ON resumes(email);
CREATE INDEX IF NOT EXISTS idx_resumes_ats_score ON resumes(ats_score);

-- Output success message
SELECT 'Schema initialized successfully' as message;
