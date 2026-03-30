CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'developer',
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE developer_profiles (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    name             VARCHAR(255) DEFAULT '',
    bio              TEXT DEFAULT '',
    skills           TEXT[] DEFAULT '{}',
    experience_years INT DEFAULT 0,
    salary_min       INT DEFAULT 0,
    salary_max       INT DEFAULT 0,
    remote_only      BOOLEAN DEFAULT FALSE,
    github_url       VARCHAR(500) DEFAULT '',
    updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE jobs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(500) NOT NULL,
    company     VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    skills      TEXT[] DEFAULT '{}',
    salary_min  INT DEFAULT 0,
    salary_max  INT DEFAULT 0,
    is_remote   BOOLEAN DEFAULT FALSE,
    location    VARCHAR(255) DEFAULT '',
    source      VARCHAR(50) DEFAULT 'manual',
    source_id   VARCHAR(255),
    url         VARCHAR(1000) DEFAULT '',
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE applications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id      UUID REFERENCES jobs(id) ON DELETE CASCADE,
    status      VARCHAR(50) DEFAULT 'saved',
    note        TEXT DEFAULT '',
    applied_at  TIMESTAMPTZ,
    updated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

CREATE INDEX idx_jobs_skills     ON jobs USING GIN(skills);
CREATE INDEX idx_jobs_is_remote  ON jobs(is_remote);
CREATE INDEX idx_jobs_is_active  ON jobs(is_active);
CREATE INDEX idx_jobs_salary     ON jobs(salary_min, salary_max);
CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_developer_skills ON developer_profiles USING GIN(skills);
