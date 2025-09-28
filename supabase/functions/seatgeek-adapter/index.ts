import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SeatGeekEvent {
  id: string
  title: string
  venue: {
    name: string
    address?: string
  }
  datetime_local: string
  performers: Array<{
    name: string
    type: string
  }>
  listings?: Array<{
    id: string
    section: string
    row?: string
    quantity: number
    price: {
      total: number
      currency: string
    }
    delivery_method?: string
  }>
}

interface TicketWithScores {
  id: string
  provider_name: string
  section: string
  row_info?: string
  seat_info: string
  price: number
  currency: string
  fees: number
  total_price: number
  delivery_type: string
  delivery_info: string
  is_available: boolean
  fees_estimated: boolean
  last_updated: string
  reliability_score: number
  delivery_score: number
}

interface SearchParams {
  query?: string
  location?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
  league?: string
}

interface EventWithTickets {
  id: string
  external_id: string
  home_team: string
  away_team: string
  venue: string
  venue_address?: string
  event_date: string
  competition?: string
  league?: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  min_price?: number
  max_price?: number
  total_tickets?: number
  image_url?: string
  created_at: string
  updated_at: string
  tickets?: TicketWithScores[]
  provider_source?: string
}

const PROVIDER_RELIABILITY = {
  'SeatGeek': 0.95,
  'StubHub': 0.90,
  'Ticketmaster': 0.85,
  'Mock Provider': 0.50
}

const DELIVERY_SPEED = {
  'instant': 3,
  'mobile': 2,
  'paper': 1
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const SEATGEEK_API_KEY = Deno.env.get('SEATGEEK_API_KEY')
    
    if (!SEATGEEK_API_KEY) {
      // Return empty results, let main search function handle fallback
      return new Response(
        JSON.stringify({ 
          events: [], 
          error: 'SeatGeek API key not configured',
          provider_status: 'disabled'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    const { query, location, dateFrom, dateTo, limit = 20, league }: SearchParams = await req.json()

    // Define US leagues for filtering
    const US_LEAGUES = ['MLS', 'USL Championship', 'USL League One', 'NWSL']
    const enableInternational = Deno.env.get('VITE_ENABLE_INTERNATIONAL') === 'true'

    // Build SeatGeek API request
    const baseUrl = 'https://api.seatgeek.com/2/events'
    const params = new URLSearchParams({
      client_id: SEATGEEK_API_KEY,
      per_page: limit.toString(),
      'datetime_local.gte': dateFrom || new Date().toISOString().split('T')[0],
    })

    if (query) {
      params.set('q', query)
    }
    if (location) {
      params.set('venue.city', location)
    }
    if (dateTo) {
      params.set('datetime_local.lte', dateTo)
    }

    // Add sports filter for football/soccer
    params.set('taxonomies.name', 'soccer')

    const response = await fetch(`${baseUrl}?${params.toString()}`)
    
    if (!response.ok) {
      throw new Error(`SeatGeek API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Map SeatGeek events to our format
    const mappedEvents = data.events?.map((event: SeatGeekEvent) => {
      const performers = event.performers || []
      const homeTeam = performers.find(p => p.type === 'home')?.name || performers[0]?.name || 'TBD'
      const awayTeam = performers.find(p => p.type === 'away')?.name || performers[1]?.name || 'TBD'
      
      // Create mock tickets with realistic pricing
      const mockTickets = [
        {
          id: `${event.id}-1`,
          provider_name: 'SeatGeek',
          section: 'Section 101',
          row_info: 'Row A',
          seat_info: '2 seats',
          price: 89,
          currency: 'USD',
          fees: 12.50,
          total_price: 101.50,
          delivery_type: 'mobile',
          delivery_info: 'Mobile transfer',
          is_available: true,
          fees_estimated: false,
          last_updated: new Date().toISOString(),
          reliability_score: PROVIDER_RELIABILITY['SeatGeek'],
          delivery_score: DELIVERY_SPEED['mobile']
        },
        {
          id: `${event.id}-2`,
          provider_name: 'SeatGeek',
          section: 'Section 205',
          row_info: 'Row F',
          seat_info: '4 seats',
          price: 65,
          currency: 'USD',
          fees: 9.75,
          total_price: 74.75,
          delivery_type: 'mobile',
          delivery_info: 'Mobile transfer',
          is_available: true,
          fees_estimated: false,
          last_updated: new Date().toISOString(),
          reliability_score: PROVIDER_RELIABILITY['SeatGeek'],
          delivery_score: DELIVERY_SPEED['mobile']
        }
      ]

      // Determine league based on team names and other factors
      let eventLeague = 'MLS' // Default to MLS for now, could be enhanced with better logic
      
      // Simple league detection logic (in real app, this would be more sophisticated)
      if (homeTeam.includes('FC') || awayTeam.includes('FC') || 
          homeTeam.includes('United') || awayTeam.includes('United') ||
          homeTeam.includes('City') || awayTeam.includes('City')) {
        eventLeague = 'MLS'
      }

      return {
        id: event.id,
        external_id: event.id,
        home_team: homeTeam,
        away_team: awayTeam,
        venue: event.venue?.name || 'TBD',
        venue_address: event.venue?.address,
        event_date: event.datetime_local,
        competition: 'Football',
        league: eventLeague,
        status: 'upcoming' as const,
        min_price: Math.min(...mockTickets.map(t => t.total_price)),
        max_price: Math.max(...mockTickets.map(t => t.total_price)),
        total_tickets: mockTickets.length,
        image_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tickets: mockTickets,
        provider_source: 'seatgeek'
      }
    }) || []

    // Apply league filtering
    let filteredEvents = mappedEvents
    
    // If a specific league is requested, filter by it
    if (league && US_LEAGUES.includes(league)) {
      filteredEvents = mappedEvents.filter((event: EventWithTickets) => event.league === league)
    } 
    // If no league specified but international is disabled, filter to US leagues only
    else if (!enableInternational) {
      filteredEvents = mappedEvents.filter((event: EventWithTickets) => 
        US_LEAGUES.includes(event.league || 'MLS')
      )
    }

    // Sort by total price ascending, then by provider reliability and delivery speed
    const sortedEvents = filteredEvents.map((event: EventWithTickets) => ({
      ...event,
      tickets: event.tickets?.sort((a: TicketWithScores, b: TicketWithScores) => {
        // Primary: total price ascending
        if (a.total_price !== b.total_price) {
          return a.total_price - b.total_price
        }
        
        // Secondary: provider reliability descending
        if (a.reliability_score !== b.reliability_score) {
          return b.reliability_score - a.reliability_score
        }
        
        // Tertiary: delivery speed descending
        return b.delivery_score - a.delivery_score
      })
    }))

    return new Response(
      JSON.stringify({ 
        events: sortedEvents,
        total: sortedEvents.length,
        provider_status: 'active'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('SeatGeek adapter error:', error)
    return new Response(
      JSON.stringify({ 
        events: [], 
        error: error instanceof Error ? error.message : 'Unknown error',
        provider_status: 'error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 // Return 200 to allow graceful fallback
      }
    )
  }
})