import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://caycrcdpaklikxnihinm.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNheWNyY2RwYWtsaWt4bmloaW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MjkzMjEsImV4cCI6MjA3NDUwNTMyMX0.1jBRs3utnbO2hBdcf5o6VZ83KSEvIqkQ1rWNDRwfh_U";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);