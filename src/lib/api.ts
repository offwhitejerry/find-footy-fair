import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Event {
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
}

export interface Ticket {
  id: string
  event_id: string
  provider_id: string
  external_ticket_id?: string
  section?: string
  row_info?: string
  seat_info?: string
  price: number
  currency: string
  fees: number
  total_price: number
  delivery_type?: 'instant' | 'mobile' | 'paper'
  delivery_info?: string
  ticket_url?: string
  is_available: boolean
  last_updated: string
  created_at: string
  providers?: {
    id: string
    name: string
    website_url?: string
  }
}

export interface SearchParams {
  query?: string
  location?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
}

export interface TicketFilters {
  eventId: string
  sortBy?: 'price' | 'section' | 'provider'
  sortOrder?: 'asc' | 'desc'
  minPrice?: number
  maxPrice?: number
  providers?: string[]
  sections?: string[]
  limit?: number
}

export const api = {
  async searchEvents(params: SearchParams) {
    const { data, error } = await supabase.functions.invoke('search-events', {
      body: params
    })
    
    if (error) throw error
    return data
  },

  async getEventTickets(filters: TicketFilters) {
    const { data, error } = await supabase.functions.invoke('get-event-tickets', {
      body: filters
    })
    
    if (error) throw error
    return data
  },

  async seedSampleData() {
    const { data, error } = await supabase.functions.invoke('seed-sample-data', {
      body: {}
    })
    
    if (error) throw error
    return data
  }
}