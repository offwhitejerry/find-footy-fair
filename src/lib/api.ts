// In Lovable, we don't use direct Supabase client in frontend
// Instead, we use edge functions for all database operations

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

export interface Click {
  id: string
  click_id: string
  event_id?: string
  provider_name: string
  price_shown?: number
  currency: string
  provider_url?: string
  clicked_at: string
  user_agent?: string
  referrer?: string
}

export interface LogClickParams {
  click_id: string
  event_id?: string
  provider_name: string
  price_shown?: number
  currency?: string
  provider_url: string
}

// Base URL for edge functions - Lovable handles this automatically
const FUNCTIONS_URL = '/api/functions/v1'

export const api = {
  async searchEvents(params: SearchParams) {
    const response = await fetch(`${FUNCTIONS_URL}/search-events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async getEventTickets(filters: TicketFilters) {
    const response = await fetch(`${FUNCTIONS_URL}/get-event-tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async seedSampleData() {
    const response = await fetch(`${FUNCTIONS_URL}/seed-sample-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async logClick(params: LogClickParams) {
    const response = await fetch(`${FUNCTIONS_URL}/log-click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  },

  async getClicks(limit = 100, offset = 0) {
    const response = await fetch(`${FUNCTIONS_URL}/get-clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit, offset }),
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }
}