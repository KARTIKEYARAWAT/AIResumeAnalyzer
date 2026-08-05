import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkTables() {
  const { data, error } = await supabase.from('resumes').select('id').limit(1);
  if (error) {
    console.error("Error accessing 'resumes' table:", error.message);
  } else {
    console.log("'resumes' table exists.");
  }

  const { data: data2, error: error2 } = await supabase.from('daily_requests').select('count').limit(1);
  if (error2) {
    console.error("Error accessing 'daily_requests' table:", error2.message);
  } else {
    console.log("'daily_requests' table exists.");
  }
}

checkTables();
