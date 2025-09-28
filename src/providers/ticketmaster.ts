import { supabase } from "@/lib/supabase";
import { appendSubIdToUrl, generateUUID } from '@/lib/utils'
import { api } from '@/lib/api'

export interface TicketmasterEvent {
  provider: 'Ticketmaster'
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

export type TMParams = { q?: string; city?: string; startDateTime?: string; endDateTime?: string };

export interface SearchParams {
  query?: string
  location?: string
  dateFrom?: string
  dateTo?: string
  limit?: number
}

export async function fetchTicketmaster(params: { q?: string; city?: string; startDateTime?: string; endDateTime?: string }) {
  const { data, error } = await supabase.functions.invoke("ticketmaster-adapter", { body: params });
  if (error) throw new Error(`tm_invoke_error:${error.message || "unknown"}`);
  return (data?.results ?? []) as any[];
}

export async function searchTicketmaster(params: SearchParams): Promise<TicketmasterEvent[]> {
  try {
    const tmParams = {
      q: params.query,
      city: params.location,
      startDateTime: params.dateFrom,
      endDateTime: params.dateTo
    };
    
    const results = await fetchTicketmaster(tmParams);
    return results as TicketmasterEvent[];
  } catch (error) {
    console.warn('tm_adapter_error:', error instanceof Error ? error.message : 'Unknown error')
    // Show user-friendly toast for errors
    if (typeof window !== 'undefined') {
      const { toast } = await import('sonner');
      toast.warning("Ticketmaster temporarily unavailable—showing other sources");
    }
    return []
  }
}

export async function handleTicketmasterClick(event: TicketmasterEvent): Promise<void> {
  try {
    const clickId = generateUUID()
    
    // Log the click
    await api.logClick({
      click_id: clickId,
      event_id: event.id,
      provider_name: 'Ticketmaster',
      price_shown: event.price.total,
      currency: event.price.currency,
      provider_url: event.deepLink
    })

    // Redirect with tracking
    const trackedUrl = appendSubIdToUrl(event.deepLink, clickId, 'subid')
    window.open(trackedUrl, '_blank')
  } catch (error) {
    console.error('Error logging Ticketmaster click:', error)
    // Still redirect even if logging fails
    window.open(event.deepLink, '_blank')
  }
}

export const TICKETMASTER_PROVIDER = {
  name: 'Ticketmaster',
  enabled: false, // Will be controlled by admin settings
  reliability: 0.9, // High reliability for sorting
  search: searchTicketmaster,
  handleClick: handleTicketmasterClick
}