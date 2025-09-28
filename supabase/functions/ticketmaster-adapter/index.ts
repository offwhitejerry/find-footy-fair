// supabase/functions/ticketmaster-adapter/index.ts
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "content-type, authorization",
  "Content-Type": "application/json"
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), { status: 405, headers: CORS });
  }

  const key = Deno.env.get("TICKETMASTER_API_KEY");
  if (!key) {
    return new Response(JSON.stringify({ error: "missing_api_key" }), { status: 500, headers: CORS });
  }

  const body = await req.json().catch(() => ({}));
  const q = (body.q ?? body.keyword ?? "").toString();
  const city = (body.city ?? "").toString();
  const start = (body.startDateTime ?? "").toString();
  const end = (body.endDateTime ?? "").toString();

  const tm = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  tm.searchParams.set("apikey", key);
  tm.searchParams.set("classificationName", "Soccer");
  tm.searchParams.set("countryCode", "US");
  tm.searchParams.set("size", "50");
  if (q) tm.searchParams.set("keyword", q);
  if (city) tm.searchParams.set("city", city);
  if (start) tm.searchParams.set("startDateTime", start);
  if (end) tm.searchParams.set("endDateTime", end);

  try {
    const r = await fetch(tm.toString(), { headers: { Accept: "application/json" } });
    if (!r.ok) {
      return new Response(JSON.stringify({ error: "upstream_error", status: r.status }), { status: 502, headers: CORS });
    }
    const data = await r.json();
    const events: any[] = data?._embedded?.events ?? [];

    const normalized = events.map((ev) => {
      const venue = ev?._embedded?.venues?.[0];
      const priceRange = Array.isArray(ev?.priceRanges) && ev.priceRanges.length ? ev.priceRanges[0] : null;
      const minPrice = priceRange?.min ?? null;
      const leagueGuess = (() => {
        const name = (ev?.name ?? "").toLowerCase();
        if (name.includes("mls")) return "MLS";
        if (name.includes("nws")) return "NWSL";
        if (name.includes("usl championship")) return "USL Championship";
        if (name.includes("usl league one")) return "USL League One";
        return ev?.classifications?.[0]?.segment?.name === "Soccer" ? "Soccer" : "";
      })();
      return {
        provider: "Ticketmaster",
        title: ev?.name ?? "Soccer match",
        league: leagueGuess,
        venue: venue?.name ?? "",
        city: venue?.city?.name ?? "",
        dateTime: ev?.dates?.start?.dateTime ?? ev?.dates?.start?.localDate ?? "",
        price: { total: typeof minPrice === "number" ? Number(minPrice) : null, currency: "USD" },
        fees_known: !!priceRange,
        chips: priceRange ? [] : ["Price on site"],
        deepLink: ev?.url ?? "",
        id: ev?.id ?? ""
      };
    })
    // Filter to US leagues by default; keep unknown but send to the bottom
    .sort((a, b) => {
      const aPrice = a.price.total ?? Number.POSITIVE_INFINITY;
      const bPrice = b.price.total ?? Number.POSITIVE_INFINITY;
      if (aPrice !== bPrice) return aPrice - bPrice;
      const aDate = a.dateTime ? Date.parse(a.dateTime) : Number.POSITIVE_INFINITY;
      const bDate = b.dateTime ? Date.parse(b.dateTime) : Number.POSITIVE_INFINITY;
      return aDate - bDate;
    });

    return new Response(JSON.stringify({ results: normalized }), { status: 200, headers: CORS });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: "network_error", message }), { status: 500, headers: CORS });
  }
});
