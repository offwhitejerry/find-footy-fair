import { fetchTicketmaster } from './ticketmaster'

export interface Provider {
  name: string
  enabled: boolean
  reliability: number
  search: (params: any) => Promise<any[]>
  handleClick: (event: any) => Promise<void>
}

export const PROVIDERS: Record<string, Provider> = {}

export type EventType = any

// Provider settings that can be controlled by admin
export interface ProviderSettings {
  ticketmaster_enabled: boolean
  auto_enable_new_providers: boolean
  fallback_to_mock: boolean
}

export const DEFAULT_PROVIDER_SETTINGS: ProviderSettings = {
  ticketmaster_enabled: false,
  auto_enable_new_providers: true,
  fallback_to_mock: true
}

export function getEnabledProviders(settings: ProviderSettings): Provider[] {
  const enabled: Provider[] = []
  
  if (settings.ticketmaster_enabled && PROVIDERS.ticketmaster) {
    enabled.push({ ...PROVIDERS.ticketmaster, enabled: true })
  }
  
  return enabled
}

export async function searchAll(params: any) {
  try {
    const tm = await fetchTicketmaster(params);
    // sort: priced first, then earliest date
    tm.sort((a:any,b:any)=>{
      const ap=a?.price?.total ?? Number.POSITIVE_INFINITY;
      const bp=b?.price?.total ?? Number.POSITIVE_INFINITY;
      if(ap!==bp) return ap-bp;
      const ad=a?.dateTime?Date.parse(a.dateTime):Number.POSITIVE_INFINITY;
      const bd=b?.dateTime?Date.parse(b.dateTime):Number.POSITIVE_INFINITY;
      return ad-bd;
    });
    return { results: tm, error: null };
  } catch (e:any) {
    return { results: [], error: String(e?.message || e) };
  }
}

export function sortEventsByRelevance(events: EventType[]): EventType[] {
  return events.sort((a, b) => {
    // 1. Sort by price (nulls last)
    if (a.price.total !== null && b.price.total !== null) {
      const priceDiff = a.price.total - b.price.total
      if (priceDiff !== 0) return priceDiff
    } else if (a.price.total !== null && b.price.total === null) {
      return -1 // a has price, prioritize it
    } else if (a.price.total === null && b.price.total !== null) {
      return 1 // b has price, prioritize it
    }
    
    // 2. Sort by date (sooner first)
    const aDate = new Date(a.dateTime)
    const bDate = new Date(b.dateTime)
    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      const dateDiff = aDate.getTime() - bDate.getTime()
      if (dateDiff !== 0) return dateDiff
    }
    
    // 3. Sort by provider reliability
    const aReliability = PROVIDERS[a.provider.toLowerCase()]?.reliability || 0
    const bReliability = PROVIDERS[b.provider.toLowerCase()]?.reliability || 0
    if (aReliability !== bReliability) {
      return bReliability - aReliability // Higher reliability first
    }
    
    // 4. Penalize items with unknown fees
    if (a.fees_known && !b.fees_known) return -1
    if (!a.fees_known && b.fees_known) return 1
    
    return 0
  })
}