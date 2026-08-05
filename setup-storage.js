import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupStorage() {
  console.log("Setting up storage bucket...");
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
      console.error("Failed to list buckets:", listError);
      return;
  }
  
  const resumesBucketExists = buckets.some(b => b.name === 'resumes');
  
  if (!resumesBucketExists) {
      console.log("Creating 'resumes' bucket...");
      const { data, error } = await supabase.storage.createBucket('resumes', {
          public: true,
          allowedMimeTypes: ['image/png', 'application/pdf'],
          fileSizeLimit: 10485760 // 10MB
      });
      if (error) {
          console.error("Error creating bucket:", error);
      } else {
          console.log("Bucket created successfully:", data);
      }
  } else {
      console.log("'resumes' bucket already exists. Updating to public...");
      await supabase.storage.updateBucket('resumes', { public: true });
  }
}

setupStorage();
