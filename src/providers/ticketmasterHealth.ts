import { supabase } from "@/lib/supabase";

export async function ticketmasterHealth() {
  const { data, error } = await supabase.functions.invoke("ticketmaster-health");
  if (error) {
    console.warn('Ticketmaster health check error:', error);
    return { hasKey: false, ok: false };
  }
  return data as { hasKey: boolean; ok: boolean };
}