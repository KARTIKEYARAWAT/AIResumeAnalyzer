-- Schema for Resumes and Rate Limiting

CREATE TABLE IF NOT EXISTS public.resumes (
    id UUID PRIMARY KEY,
    user_id TEXT NOT NULL, -- changed from UUID to TEXT to support local guest IDs
    company_name TEXT,
    job_title TEXT,
    resume_path TEXT,
    image_path TEXT,
    image_paths JSONB,
    feedback_json JSONB,
    job_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Drop the foreign key constraint on user_id if it exists, since we use guest IDs instead of auth.users
ALTER TABLE public.resumes DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;

-- Safely add columns in case the table was created in an older version
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS image_path TEXT;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS image_paths JSONB;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS feedback_json JSONB;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_description TEXT;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.resumes ADD COLUMN IF NOT EXISTS resume_path TEXT;

CREATE TABLE IF NOT EXISTS public.daily_requests (
    user_id TEXT NOT NULL, -- changed from UUID to TEXT to support local guest IDs
    request_date DATE NOT NULL,
    count INT DEFAULT 1,
    PRIMARY KEY (user_id, request_date)
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public operations on resumes" ON public.resumes;
CREATE POLICY "Allow public operations on resumes" 
ON public.resumes FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.daily_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public operations on daily_requests" ON public.daily_requests;
CREATE POLICY "Allow public operations on daily_requests" 
ON public.daily_requests FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket creation (run in Supabase UI or via API if possible):
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies (Required for uploads from the frontend to work)
-- This allows anyone to upload files to the "resumes" bucket (since we use guest auth)
DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads" 
ON storage.objects 
FOR INSERT TO public 
WITH CHECK (bucket_id = 'resumes');

-- This allows anyone to read from the resumes bucket
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
CREATE POLICY "Allow public read" 
ON storage.objects 
FOR SELECT TO public
USING (bucket_id = 'resumes');

-- This allows anyone to update files
DROP POLICY IF EXISTS "Allow public updates" ON storage.objects;
CREATE POLICY "Allow public updates" 
ON storage.objects 
FOR UPDATE TO public
USING (bucket_id = 'resumes');

-- This allows anyone to delete files
DROP POLICY IF EXISTS "Allow public deletes" ON storage.objects;
CREATE POLICY "Allow public deletes" 
ON storage.objects 
FOR DELETE TO public
USING (bucket_id = 'resumes');
