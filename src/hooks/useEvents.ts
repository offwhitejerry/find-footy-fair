import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type SearchParams, type TicketFilters, type LogClickParams } from '@/lib/api'

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

export const useLogClick = () => {
  return useMutation({
    mutationFn: (params: LogClickParams) => api.logClick(params),
  })
}

export const useGetClicks = (limit = 100, offset = 0) => {
  return useQuery({
    queryKey: ['clicks', limit, offset],
    queryFn: () => api.getClicks(limit, offset),
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}