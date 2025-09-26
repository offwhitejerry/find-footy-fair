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

    const { query, location, dateFrom, dateTo, limit = 20 }: SearchParams = await req.json()

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
        events: processedEvents,
        total: processedEvents.length 
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