import { loadPrefs } from "@/lib/providerPrefs";
import { fetchTicketmaster } from "@/providers/ticketmaster";

export type SearchParams = {
  q?: string;
  city?: string;
  startDateTime?: string;
  endDateTime?: string;
};

export async function searchAll(params: SearchParams) {
  const prefs = loadPrefs();
  const results:any[] = [];
  const warnings:string[] = [];

  if (prefs.ticketmaster) {
    try {
      const tm = await fetchTicketmaster(params);
      results.push(...tm);
    } catch (e:any) {
      warnings.push(String(e?.message || e));
    }
  }

  results.sort((a:any,b:any)=>{
    const ap=a?.price?.total ?? Number.POSITIVE_INFINITY;
    const bp=b?.price?.total ?? Number.POSITIVE_INFINITY;
    if(ap!==bp) return ap-bp;
    const ad=a?.dateTime?Date.parse(a.dateTime):Number.POSITIVE_INFINITY;
    const bd=b?.dateTime?Date.parse(b.dateTime):Number.POSITIVE_INFINITY;
    return ad-bd;
  });

  return { results, warnings };
}