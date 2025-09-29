import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SearchParams {
  query?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  league?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }

  try {
    const { query, location, dateFrom, dateTo, limit = 50 }: SearchParams = await req.json()

    // Force using ONLY Ticketmaster adapter (debug)
    let tm: any[] = []
    let error: string | null = null

    try {
      const resp = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/ticketmaster-adapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          q: query,
          city: location,
          startDateTime: dateFrom,
          endDateTime: dateTo,
        }),
      })

      if (resp.ok) {
        const data = await resp.json()
        if (data && Array.isArray(data.results)) {
          tm = data.results
        } else {
          error = 'tm_bad_payload'
        }
      } else {
        error = `tm_http_${resp.status}`
      }
    } catch (e) {
      error = `tm_invoke_error:${e instanceof Error ? e.message : 'unknown'}`
    }

    // Sort: priced first, then earliest date
    tm.sort((a: any, b: any) => {
      const ap = a?.price?.total ?? Number.POSITIVE_INFINITY
      const bp = b?.price?.total ?? Number.POSITIVE_INFINITY
      if (ap !== bp) return ap - bp
      const ad = a?.dateTime ? Date.parse(a.dateTime) : Number.POSITIVE_INFINITY
      const bd = b?.dateTime ? Date.parse(b.dateTime) : Number.POSITIVE_INFINITY
      return ad - bd
    })

    return new Response(
      JSON.stringify({ events: tm, total: tm.length, error }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ events: [], total: 0, error: e instanceof Error ? e.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 },
    )
  }
})
