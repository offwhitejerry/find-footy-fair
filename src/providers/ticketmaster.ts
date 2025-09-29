import { supabase } from "@/lib/supabase";
export type TMParams = { q?: string; city?: string; startDateTime?: string; endDateTime?: string };
export async function fetchTicketmaster(params: TMParams) {
  const { data, error } = await supabase.functions.invoke("ticketmaster-adapter", { body: params });
  if (error) throw new Error(`tm_invoke_error: ${error.message || error.name || "unknown"}`);
  if (!data || !Array.isArray(data.results)) throw new Error("tm_bad_payload");
  return data.results as any[];
}