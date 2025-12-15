'use client'

import { useState } from 'react'
import { useRooms, useUpdateRoom } from '@/lib/queries/rooms'
import { RoomLite } from '@/lib/types/showtime'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { Edit2, LayoutGrid, Users, Settings, Armchair } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
import { motion } from 'framer-motion'
import { StatsCard } from '@/components/admin/StatsCard'

export default function AdminRoomsPage() {
    const { data: rooms, isLoading, isError, refetch } = useRooms()
    const updateRoomMutation = useUpdateRoom()
    const { addToast } = useToast()

    const [editingRoom, setEditingRoom] = useState<RoomLite | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        capacity: 0,
        seatingMode: 'ASSIGNED' as 'ASSIGNED' | 'GENERAL'
    })

    const handleEdit = (room: RoomLite) => {
        setEditingRoom(room)
        setFormData({
            name: room.name ?? '',
            capacity: room.capacity ?? 0,
            seatingMode: room.seatingMode || 'ASSIGNED'
        })
    }

    const handleSave = async () => {
        if (!editingRoom) return

        try {
            await updateRoomMutation.mutateAsync({
                id: editingRoom.id,
                data: {
                    name: formData.name,
                    capacity: Number(formData.capacity),
                    seatingMode: formData.seatingMode
                }
            })
            addToast({ title: 'Sala actualizada', message: 'Los cambios se guardaron correctamente.', variant: 'success' })
            setEditingRoom(null)
        } catch (error) {
            addToast({ title: 'Error', message: 'No se pudo actualizar la sala.', variant: 'error' })
        }
    }

    // Calculations for stats
    const totalCapacity = rooms?.reduce((acc, room) => acc + room.capacity, 0) || 0
    const assignedRooms = rooms?.filter(r => r.seatingMode !== 'GENERAL').length || 0
    const generalRooms = rooms?.filter(r => r.seatingMode === 'GENERAL').length || 0

    if (isLoading) return <LoadingState title="Cargando salas..." subtitle="Obteniendo información del cine." />
    if (isError) return <ErrorState title="Error al cargar salas" subtitle="Intenta nuevamente." onRetry={refetch} />

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-black text-white tracking-tight mb-1"
                >
                    Gestión de Salas
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-neutral-400"
                >
                    Configura las salas y modos de asiento.
                </motion.p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Capacidad Total"
                    value={totalCapacity}
                    icon={Users}
                    color="text-blue-400"
                    delay={0}
                />
                <StatsCard
                    title="Salas Numeradas"
                    value={assignedRooms}
                    icon={Armchair}
                    color="text-emerald-400"
                    delay={0.1}
                />
                <StatsCard
                    title="Salas General"
                    value={generalRooms}
                    icon={LayoutGrid}
                    color="text-purple-400"
                    delay={0.2}
                />
            </div>

            {!rooms || rooms.length === 0 ? (
                <EmptyState title="No hay salas" subtitle="No se encontraron salas registradas." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room, idx) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                        >
                            <Card className="group hover:border-primary-500/30 transition-colors h-full bg-black/40 backdrop-blur-xl border-white/5">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-2 shadow-inner border border-primary-500/10">
                                            {room.seatingMode === 'GENERAL'
                                                ? <LayoutGrid className="w-6 h-6 text-primary-400" />
                                                : <Armchair className="w-6 h-6 text-primary-400" />
                                            }
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleEdit(room)} className="text-white/40 hover:text-white">
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <CardTitle className="text-xl">{room.name}</CardTitle>
                                    <CardDescription>ID: {room.id.substring(0, 8)}...</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                                            <div className="flex items-center gap-2 text-neutral-400">
                                                <Users className="w-4 h-4" />
                                                <span>Capacidad</span>
                                            </div>
                                            <span className="font-medium text-neutral-50">{room.capacity} butacas</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                                            <div className="flex items-center gap-2 text-neutral-400">
                                                <Settings className="w-4 h-4" />
                                                <span>Modo</span>
                                            </div>
                                            <span className={`font-bold px-2 py-0.5 rounded text-xs ring-1 ring-inset ${room.seatingMode === 'GENERAL'
                                                ? 'bg-purple-500/10 text-purple-400 ring-purple-500/20'
                                                : 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
                                                }`}>
                                                {room.seatingMode === 'GENERAL' ? 'General' : 'Numerada'}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <Modal
                open={!!editingRoom}
                onOpenChange={(open) => !open && setEditingRoom(null)}
                title={`Editar ${editingRoom?.name}`}
                description="Modifica la configuración de la sala."
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setEditingRoom(null)}>Cancelar</Button>
                        <Button onClick={handleSave} isLoading={updateRoomMutation.isPending}>Guardar Cambios</Button>
                    </div>
                }
            >
                <div className="space-y-4 py-4">
                    <Input
                        label="Nombre de la sala"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Capacidad Total"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    />

                    <div className="w-full">
                        <label className="block text-sm font-medium text-neutral-200 mb-2">
                            Modo de Asientos
                        </label>
                        <div className="relative">
                            <select
                                className="w-full rounded-2xl px-4 py-3 text-sm text-white bg-bg-tertiary/70 border border-white/10 backdrop-blur-xl shadow-inner-glow focus:outline-none focus:ring-2 focus:ring-primary-500/40 appearance-none cursor-pointer"
                                value={formData.seatingMode}
                                onChange={(e) => setFormData({ ...formData, seatingMode: e.target.value as 'ASSIGNED' | 'GENERAL' })}
                            >
                                <option value="ASSIGNED" className="bg-neutral-900">Numerada (Mapa de Asientos)</option>
                                <option value="GENERAL" className="bg-neutral-900">General (Sin numerar)</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                <Settings className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="mt-2 text-xs text-white/50">
                            {formData.seatingMode === 'GENERAL'
                                ? 'Los usuarios elegirán cantidad de entradas sin seleccionar ubicación específica.'
                                : 'Los usuarios deben seleccionar cada butaca del mapa 3D.'}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
