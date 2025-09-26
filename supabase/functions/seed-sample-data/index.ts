import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const sampleEvents = [
  {
    external_id: 'MAN_UTD_ARS_2024_001',
    home_team: 'Manchester United',
    away_team: 'Arsenal',
    venue: 'Old Trafford',
    venue_address: 'Sir Matt Busby Way, Old Trafford, Manchester M16 0RA',
    event_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    competition: 'Premier League',
    league: 'English Premier League',
    status: 'upcoming'
  },
  {
    external_id: 'LIV_CHE_2024_001',
    home_team: 'Liverpool',
    away_team: 'Chelsea',
    venue: 'Anfield',
    venue_address: 'Anfield Road, Liverpool L4 0TH',
    event_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    competition: 'Premier League',
    league: 'English Premier League',
    status: 'upcoming'
  },
  {
    external_id: 'MAN_CITY_TOT_2024_001',
    home_team: 'Manchester City',
    away_team: 'Tottenham',
    venue: 'Etihad Stadium',
    venue_address: 'Etihad Campus, Manchester M11 3FF',
    event_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 3 weeks from now
    competition: 'Premier League',
    league: 'English Premier League',
    status: 'upcoming'
  }
]

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Insert sample events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .upsert(sampleEvents, { onConflict: 'external_id' })
      .select()

    if (eventsError) {
      throw eventsError
    }

    // Get provider IDs
    const { data: providers, error: providersError } = await supabase
      .from('providers')
      .select('id, name')

    if (providersError) {
      throw providersError
    }

    // Create sample tickets for each event
    const sampleTickets = []
    
    for (const event of events || []) {
      for (const provider of providers || []) {
        // Generate 3-5 tickets per provider per event
        const ticketCount = Math.floor(Math.random() * 3) + 3
        
        for (let i = 0; i < ticketCount; i++) {
          const basePrice = Math.floor(Math.random() * 200) + 50 // $50-$250
          const fees = Math.floor(basePrice * 0.15) // 15% fees
          const sections = ['Lower Tier', 'Upper Tier', 'Club Level', 'Premium', 'General Admission']
          const deliveryTypes = ['instant', 'mobile', 'paper']
          
          sampleTickets.push({
            event_id: event.id,
            provider_id: provider.id,
            external_ticket_id: `${provider.name}_${event.external_id}_${i}`,
            section: sections[Math.floor(Math.random() * sections.length)],
            row_info: `Row ${Math.floor(Math.random() * 30) + 1}`,
            seat_info: `Seats ${Math.floor(Math.random() * 10) + 1}-${Math.floor(Math.random() * 10) + 2}`,
            price: basePrice,
            currency: 'USD',
            fees: fees,
            total_price: basePrice + fees,
            delivery_type: deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)],
            delivery_info: 'Mobile transfer available',
            ticket_url: `https://${provider.name.toLowerCase().replace(' ', '')}.com/ticket/${event.external_id}`,
            is_available: true
          })
        }
      }
    }

    // Insert sample tickets
    const { error: ticketsError } = await supabase
      .from('tickets')
      .insert(sampleTickets)

    if (ticketsError) {
      throw ticketsError
    }

    // Update event min/max prices
    for (const event of events || []) {
      const eventTickets = sampleTickets.filter(t => t.event_id === event.id)
      const prices = eventTickets.map(t => t.total_price)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      
      await supabase
        .from('events')
        .update({ 
          min_price: minPrice, 
          max_price: maxPrice,
          total_tickets: eventTickets.length 
        })
        .eq('id', event.id)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Sample data seeded successfully',
        events: events?.length || 0,
        tickets: sampleTickets.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )

  } catch (error) {
    console.error('Seeding error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      },
    )
  }
})