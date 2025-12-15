'use client';

import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card } from '@/components/ui/Card';
import { RoomEditor } from '@/components/admin/RoomEditor';
import { useToast } from '@/components/ui/Toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Room } from '@/lib/types/room';

export default function RoomDesignPage() {
    const params = useParams();
    const roomId = params.id as string;
    const { addToast } = useToast();

    // Fetch Room Data
    const { data: room, isLoading } = useQuery<Room>({
        queryKey: ['rooms', roomId],
        queryFn: async () => {
            const { data } = await api.get(`/rooms/${roomId}`);
            return data;
        },
    });

    // Save Mutation
    const updateRoomMutation = useMutation({
        mutationFn: async (updatedRoom: Partial<Room>) => {
            await api.put(`/rooms/${roomId}`, updatedRoom);
        },
        onSuccess: () => {
            addToast({ message: 'Diseño de sala guardado correctamente', variant: 'success' });
        },
        onError: () => {
            addToast({ message: 'Error al guardar el diseño', variant: 'error' });
        },
    });

    if (isLoading) return <div className="p-8 text-white">Cargando diseño de sala...</div>;
    if (!room) return <div className="p-8 text-white">Sala no encontrada</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/salas"
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Diseño de Sala: {room.name}</h1>
                    <p className="text-gray-400">Configura la disposición de butacas y pasillos</p>
                </div>
            </div>

            <Card className="p-6 bg-black/40 border-white/10">
                <RoomEditor
                    initialRows={room.rows || []}
                    onSave={(newRows: any[], seatingType: 'assigned' | 'general') => updateRoomMutation.mutate({ ...room, rows: newRows, seatingType })}
                />
            </Card>
        </div>
    );
}
