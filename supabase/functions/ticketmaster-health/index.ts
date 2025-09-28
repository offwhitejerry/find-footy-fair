// supabase/functions/ticketmaster-health/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  
  // Accept both GET and POST requests
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405, 
      headers: CORS 
    });
  }
  
  const hasKey = !!Deno.env.get("TICKETMASTER_API_KEY");
  return new Response(JSON.stringify({ hasKey, ok: hasKey }), { status: 200, headers: CORS });
});