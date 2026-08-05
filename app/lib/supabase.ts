import { createClient } from "@supabase/supabase-js";

// Vite handles import.meta.env
// The environment variables in .env should ideally be prefixed with VITE_ 
// However, since we are replacing puter we will fallback to standard process.env just in case it runs in Node environment for SSR
// But this is SSR: false
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL || "https://piunzjrbhevsoupyvnlm.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY || "placeholder";

if (!import.meta.env.VITE_SUPABASE_URL && !import.meta.env.SUPABASE_URL) {
  console.warn("Missing Supabase URL. Using placeholder for build safety.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSignedStorageUrl(path: string, expirySeconds = 3600): Promise<string> {
  const { data, error } = await supabase.storage.from('resumes').createSignedUrl(path, expirySeconds);
  if (error) {
    console.error("Error creating signed URL:", error);
    throw error;
  }
  return data.signedUrl;
}
