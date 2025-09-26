import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TicketParams {
  eventId: string;
  sortBy?: 'price' | 'section' | 'provider';
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  providers?: string[];
  sections?: string[];
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

    const { 
      eventId, 
      sortBy = 'price', 
      sortOrder = 'asc',
      minPrice,
      maxPrice,
      providers,
      sections,
      limit = 100 
    }: TicketParams = await req.json()

    if (!eventId) {
      throw new Error('Event ID is required')
    }

    // First get the event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single()

    if (eventError || !event) {
      throw new Error('Event not found')
    }

    // Build tickets query
    let ticketsQuery = supabase
      .from('tickets')
      .select(`
        *,
        providers(
          id,
          name,
          website_url
        )
      `)
      .eq('event_id', eventId)
      .eq('is_available', true)

    // Apply filters
    if (minPrice !== undefined) {
      ticketsQuery = ticketsQuery.gte('total_price', minPrice)
    }

    if (maxPrice !== undefined) {
      ticketsQuery = ticketsQuery.lte('total_price', maxPrice)
    }

    if (providers && providers.length > 0) {
      ticketsQuery = ticketsQuery.in('provider_id', providers)
    }

    if (sections && sections.length > 0) {
      ticketsQuery = ticketsQuery.in('section', sections)
    }

    // Apply sorting
    const orderColumn = sortBy === 'provider' ? 'providers(name)' : 
                       sortBy === 'section' ? 'section' : 'total_price'
    
    ticketsQuery = ticketsQuery.order(orderColumn, { ascending: sortOrder === 'asc' })
    ticketsQuery = ticketsQuery.limit(limit)

    const { data: tickets, error: ticketsError } = await ticketsQuery

    if (ticketsError) {
      throw ticketsError
    }

    // Get summary statistics
    const totalTickets = tickets?.length || 0
    const minTicketPrice = totalTickets > 0 ? Math.min(...tickets!.map(t => t.total_price)) : null
    const maxTicketPrice = totalTickets > 0 ? Math.max(...tickets!.map(t => t.total_price)) : null
    const avgTicketPrice = totalTickets > 0 ? 
      tickets!.reduce((sum, t) => sum + t.total_price, 0) / totalTickets : null

    // Group by section for better organization
    const ticketsBySection = tickets?.reduce((acc, ticket) => {
      const section = ticket.section || 'General Admission'
      if (!acc[section]) {
        acc[section] = []
      }
      acc[section].push(ticket)
      return acc
    }, {} as Record<string, any[]>) || {}

    // Get unique providers and sections for filtering
    const availableProviders = tickets ? [...new Set(tickets.map(t => t.providers?.name).filter(Boolean))] : []
    const availableSections = tickets ? [...new Set(tickets.map(t => t.section).filter(Boolean))] : []

    return new Response(
      JSON.stringify({
        event,
        tickets: tickets || [],
        ticketsBySection,
        summary: {
          totalTickets,
          minPrice: minTicketPrice,
          maxPrice: maxTicketPrice,
          avgPrice: avgTicketPrice ? Math.round(avgTicketPrice * 100) / 100 : null
        },
        filters: {
          availableProviders,
          availableSections
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )

  } catch (error) {
    console.error('Get tickets error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      },
    )
  }
})