import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

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

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { query, location, dateFrom, dateTo, limit = 20, league }: SearchParams = await req.json()

    // US leagues for filtering
    const US_LEAGUES = ['MLS', 'USL Championship', 'USL League One', 'NWSL']
    const enableInternational = Deno.env.get('VITE_ENABLE_INTERNATIONAL') === 'true'

    // Try SeatGeek first if API key is available
    let seatgeekEvents = []
    let seatgeekError = null
    
    try {
      const seatgeekResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/seatgeek-adapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify({ query, location, dateFrom, dateTo, limit: Math.floor(limit / 2), league })
      })
      
      if (seatgeekResponse.ok) {
        const seatgeekData = await seatgeekResponse.json()
        if (seatgeekData.events && seatgeekData.provider_status === 'active') {
          seatgeekEvents = seatgeekData.events
        }
      }
    } catch (error) {
      console.log('SeatGeek unavailable, using fallback')
      seatgeekError = error
    }

    // Build the search query
    let searchQuery = supabase
      .from('events')
      .select(`
        *,
        tickets!inner(
          id,
          provider_id,
          section,
          price,
          currency,
          total_price,
          delivery_type,
          is_available,
          providers(name, website_url)
        )
      `)
      .eq('status', 'upcoming')
      .eq('tickets.is_available', true)
      .order('event_date', { ascending: true })
      .limit(limit)

    // Apply filters
    if (query) {
      searchQuery = searchQuery.or(`home_team.ilike.%${query}%,away_team.ilike.%${query}%,venue.ilike.%${query}%,competition.ilike.%${query}%`)
    }

    if (location) {
      searchQuery = searchQuery.or(`venue.ilike.%${location}%,venue_address.ilike.%${location}%`)
    }

    if (dateFrom) {
      searchQuery = searchQuery.gte('event_date', dateFrom)
    }

    if (dateTo) {
      searchQuery = searchQuery.lte('event_date', dateTo)
    }

    // Add league filtering
    if (league && US_LEAGUES.includes(league)) {
      searchQuery = searchQuery.eq('league', league)
    } else if (!enableInternational) {
      // Default to US leagues only if international is disabled
      searchQuery = searchQuery.in('league', US_LEAGUES)
    }

    const { data: events, error } = await searchQuery

    if (error) {
      throw error
    }

    // Process results to include ticket aggregation
    const processedEvents = events?.map(event => {
      const tickets = event.tickets || []
      const availableTickets = tickets.filter((t: any) => t.is_available)
      
      const minPrice = availableTickets.length > 0 
        ? Math.min(...availableTickets.map((t: any) => t.total_price))
        : null

      const ticketCount = availableTickets.length
      
      const providerCounts = availableTickets.reduce((acc: Record<string, number>, ticket: any) => {
        const providerName = ticket.providers?.name || 'Unknown'
        acc[providerName] = (acc[providerName] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      return {
        ...event,
        min_price: minPrice,
        ticket_count: ticketCount,
        provider_summary: providerCounts,
        tickets: undefined // Remove detailed tickets from main response
      }
    }) || []

    // Add mock events as fallback if no results
    const mockEvents = processedEvents.length === 0 && seatgeekEvents.length === 0 ? [
      {
        id: 'mock-1',
        external_id: 'mock-1',
        home_team: 'Arsenal',
        away_team: 'Chelsea',
        venue: 'Emirates Stadium',
        venue_address: 'London, UK',
        event_date: new Date(Date.now() + 86400000 * 7).toISOString(), // Next week
        competition: 'Premier League',
        league: 'Premier League',
        status: 'upcoming',
        min_price: 45,
        ticket_count: 8,
        provider_summary: { 'Mock Provider': 8 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mock-2',
        external_id: 'mock-2',
        home_team: 'Manchester United',
        away_team: 'Liverpool',
        venue: 'Old Trafford',
        venue_address: 'Manchester, UK',
        event_date: new Date(Date.now() + 86400000 * 14).toISOString(), // In 2 weeks
        competition: 'Premier League',
        league: 'Premier League',
        status: 'upcoming',
        min_price: 85,
        ticket_count: 12,
        provider_summary: { 'Mock Provider': 12 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ] : []

    // Combine SeatGeek and database results, add mocks if needed
    const allEvents = [...seatgeekEvents, ...processedEvents, ...mockEvents]

    // Log search for analytics
    if (query || location) {
      await supabase.from('search_history').insert({
        search_query: query || '',
        location: location || null,
        date_from: dateFrom || null,
        date_to: dateTo || null,
        results_count: processedEvents.length,
        user_ip: req.headers.get('x-forwarded-for') || 'unknown'
      })
    }

    return new Response(
      JSON.stringify({ 
        events: allEvents,
        total: allEvents.length,
        sources: {
          seatgeek: seatgeekEvents.length,
          database: processedEvents.length,
          mock: mockEvents.length
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )

  } catch (error) {
    console.error('Search error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      },
    )
  }
})