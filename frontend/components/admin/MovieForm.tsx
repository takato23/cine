'use client'

import { useState } from 'react'
import { Movie, MovieStatus } from '@/lib/types/movie'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Film, Calendar, Clock, AlignLeft, Image as ImageIcon } from 'lucide-react'

interface MovieFormProps {
    initialData?: Partial<Movie>
    onSubmit: (data: Partial<Movie>) => void
    onCancel: () => void
    isLoading?: boolean
}

export function MovieForm({ initialData = {}, onSubmit, onCancel, isLoading }: MovieFormProps) {
    const [formData, setFormData] = useState<Partial<Movie>>({
        title: '',
        synopsis: '',
        duration: 0,
        genres: [],
        status: 'CARTELERA',
        posterUrl: '',
        isFeatured: false,
        ...initialData
    })

    const [genresInput, setGenresInput] = useState(initialData.genres?.join(', ') || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({
            ...formData,
            genres: genresInput.split(',').map(g => g.trim()).filter(Boolean),
            duration: Number(formData.duration),
            isFeatured: formData.isFeatured ?? false
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Título Original</label>
                        <div className="relative">
                            <Input
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Ej: Gladiador II"
                                className="pl-10"
                                required
                            />
                            <Film className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Duración (min)</label>
                        <div className="relative">
                            <Input
                                type="number"
                                value={formData.duration}
                                onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                                placeholder="120"
                                className="pl-10"
                                required
                            />
                            <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">Sinopsis</label>
                    <div className="relative">
                        <textarea
                            value={formData.synopsis}
                            onChange={e => setFormData({ ...formData, synopsis: e.target.value })}
                            className="w-full min-h-[100px] rounded-xl px-4 py-3 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-white/20 resize-none"
                            placeholder="Descripción de la película..."
                            required
                        />
                        <AlignLeft className="w-4 h-4 absolute left-3 top-4 text-white/40" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Géneros</label>
                        <div className="relative">
                            <Input
                                value={genresInput}
                                onChange={e => setGenresInput(e.target.value)}
                                placeholder="Acción, Aventura, Drama"
                                className="pl-10"
                            />
                            <Film className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        </div>
                        <p className="text-xs text-white/40">Separar por comas</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Estado</label>
                        <div className="relative">
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value as MovieStatus })}
                                className="w-full rounded-xl px-10 py-3 text-sm text-white bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/40 appearance-none cursor-pointer"
                            >
                                <option value="ESTRENO" className="bg-neutral-900">Estreno</option>
                                <option value="CARTELERA" className="bg-neutral-900">En Cartelera</option>
                                <option value="PROXIMAMENTE" className="bg-neutral-900">Próximamente</option>
                            </select>
                            <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-300">URL del Poster</label>
                    <div className="relative">
                        <Input
                            value={formData.posterUrl || ''}
                            onChange={e => setFormData({ ...formData, posterUrl: e.target.value })}
                            placeholder="https://..."
                            className="pl-10"
                        />
                        <ImageIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xl">⭐</span>
                        </div>
                        <div>
                            <p className="text-white font-medium">Película Destacada</p>
                            <p className="text-xs text-white/50">Se mostrará como hero en la cartelera</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${formData.isFeatured
                            ? 'bg-primary shadow-[0_0_20px_rgba(238,75,43,0.5)]'
                            : 'bg-white/10'
                            }`}
                    >
                        <span
                            className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg transition-transform duration-300 ${formData.isFeatured ? 'translate-x-7' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {initialData.id ? 'Guardar Cambios' : 'Crear Película'}
                </Button>
            </div>
        </form>
    )
}
