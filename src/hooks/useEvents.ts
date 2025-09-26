import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type SearchParams, type TicketFilters } from '@/lib/api'

export const useSearchEvents = (params: SearchParams) => {
  return useQuery({
    queryKey: ['events', 'search', params],
    queryFn: () => api.searchEvents(params),
    enabled: !!(params.query || params.location || params.dateFrom),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useEventTickets = (filters: TicketFilters) => {
  return useQuery({
    queryKey: ['tickets', filters.eventId, filters],
    queryFn: () => api.getEventTickets(filters),
    enabled: !!filters.eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export const useSeedSampleData = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: api.seedSampleData,
    onSuccess: () => {
      // Invalidate all event queries after seeding
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['tickets'] })
    }
  })
}