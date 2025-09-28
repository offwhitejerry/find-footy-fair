import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TicketmasterEvent {
  id: string
  name: string
  url: string
  dates?: {
    start?: {
      dateTime?: string
      localDate?: string
    }
  }
  priceRanges?: Array<{
    min: number
    max: number
    currency: string
  }>
  classifications?: Array<{
    league?: {
      name: string
    }
  }>
  _embedded?: {
    venues?: Array<{
      name: string
      city?: {
        name: string
      }
    }>
  }
}

interface SearchParams {
  query?: string
  location?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
}

interface EventWithTickets {
  provider: string
  title: string
  league: string
  venue: string
  city: string
  dateTime: string
  price: {
    total: number | null
    currency: string
  }
  fees_known: boolean
  chips: string[]
  deepLink: string
  id: string
}

const US_SOCCER_LEAGUES = ['MLS', 'NWSL', 'USL Championship', 'USL League One']

function detectLeague(event: TicketmasterEvent): string {
  const leagueName = event.classifications?.[0]?.league?.name || ''
  const eventName = event.name.toLowerCase()
  
  if (leagueName.includes('MLS') || eventName.includes('mls')) return 'MLS'
  if (leagueName.includes('NWSL') || eventName.includes('nwsl')) return 'NWSL'
  if (leagueName.includes('USL Championship') || eventName.includes('usl championship')) return 'USL Championship'
  if (leagueName.includes('USL League One') || eventName.includes('usl league one')) return 'USL League One'
  
  return leagueName || 'Soccer'
}

function extractTeamNames(eventName: string): { homeTeam: string, awayTeam: string } | null {
  // Try to match "Team A vs Team B" or "Team A at Team B" patterns
  const vsMatch = eventName.match(/^(.+?)\s+(?:vs|v\.?\s|at)\s+(.+?)(?:\s|$)/i)
  if (vsMatch) {
    return {
      homeTeam: vsMatch[1].trim(),
      awayTeam: vsMatch[2].trim()
    }
  }
  return null
}

function normalizeEvent(event: TicketmasterEvent): EventWithTickets {
  const teams = extractTeamNames(event.name)
  const title = teams ? `${teams.homeTeam} vs ${teams.awayTeam}` : event.name
  
  const league = detectLeague(event)
  const venue = event._embedded?.venues?.[0]?.name || ''
  const city = event._embedded?.venues?.[0]?.city?.name || ''
  const dateTime = event.dates?.start?.dateTime || event.dates?.start?.localDate || ''
  
  const priceRanges = event.priceRanges
  const minPrice = priceRanges?.length ? Math.min(...priceRanges.map(p => p.min)) : null
  
  return {
    provider: 'Ticketmaster',
    title,
    league,
    venue,
    city,
    dateTime,
    price: {
      total: minPrice,
      currency: 'USD'
    },
    fees_known: Boolean(priceRanges?.length),
    chips: priceRanges?.length ? [] : ['Price on site'],
    deepLink: event.url,
    id: event.id
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('TICKETMASTER_API_KEY')
    if (!apiKey) {
      console.warn('tm_adapter_error: TICKETMASTER_API_KEY not configured')
      return new Response(
        JSON.stringify({ events: [], source: 'ticketmaster', count: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const params: SearchParams = await req.json()
    
    // Build query parameters
    const queryParams = new URLSearchParams({
      apikey: apiKey,
      classificationName: 'Soccer',
      countryCode: 'US',
      size: '50'
    })

    if (params.query) {
      queryParams.set('keyword', params.query)
    }
    if (params.location) {
      queryParams.set('city', params.location)
    }
    if (params.dateFrom) {
      queryParams.set('startDateTime', params.dateFrom)
    }
    if (params.dateTo) {
      queryParams.set('endDateTime', params.dateTo)
    }

    const url = `https://app.ticketmaster.com/discovery/v2/events.json?${queryParams}`
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1500)

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SoccerFare/1.0'
      }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`Ticketmaster API error: ${response.status}`)
    }

    const data = await response.json()
    const events = data._embedded?.events || []

    // Normalize and filter events
    const normalizedEvents: EventWithTickets[] = events
      .map(normalizeEvent)
      .filter((event: EventWithTickets) => {
        // Keep events from known US soccer leagues or those that mention soccer
        const league = event.league.toLowerCase()
        return US_SOCCER_LEAGUES.some(l => league.includes(l.toLowerCase())) ||
               league.includes('soccer') ||
               event.title.toLowerCase().includes('soccer')
      })

    return new Response(
      JSON.stringify({ 
        events: normalizedEvents, 
        source: 'ticketmaster',
        count: normalizedEvents.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.warn('tm_adapter_error:', error instanceof Error ? error.message : 'Unknown error')
    
    return new Response(
      JSON.stringify({ events: [], source: 'ticketmaster', count: 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
