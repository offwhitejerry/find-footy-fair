import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { 
      click_id, 
      event_id, 
      provider_name, 
      price_shown, 
      currency = 'USD',
      provider_url 
    } = await req.json()

    // Get user agent and referrer from headers
    const user_agent = req.headers.get('user-agent')
    const referrer = req.headers.get('referer')

    const { data, error } = await supabaseClient
      .from('clicks')
      .insert({
        click_id,
        event_id,
        provider_name,
        price_shown,
        currency,
        provider_url,
        user_agent,
        referrer
      })
      .select()

    if (error) {
      console.error('Error logging click:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      },
    )
  }
})