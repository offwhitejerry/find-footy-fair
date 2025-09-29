import { supabase } from "@/integrations/supabase/client";

export async function ticketmasterHealth() {
  const { data, error } = await supabase.functions.invoke("ticketmaster-health");
  if (error) return { hasKey: false, ok: false };
  return data as { hasKey: boolean; ok: boolean };
}