import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { RoomLite } from '@/lib/types'

export function useRooms() {
    return useQuery<RoomLite[]>({
        queryKey: ['rooms'],
        queryFn: async () => {
            const res = await api.get('/rooms')
            return res.data
        },
    })
}

export function useUpdateRoom() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: Partial<RoomLite> }) => {
            const res = await api.patch(`/rooms/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
        },
    })
}
