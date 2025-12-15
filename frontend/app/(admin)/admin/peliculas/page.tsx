'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Movie } from '@/lib/types/movie'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { MovieForm } from '@/components/admin/MovieForm'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { LoadingState, EmptyState, ErrorState } from '@/components/ui/states'
import { useToast } from '@/components/ui/Toast'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'

export default function AdminPeliculasPage() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()
  const [editingMovie, setEditingMovie] = useState<Partial<Movie> | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: movies, isLoading, isError, refetch } = useQuery<Movie[]>({
    queryKey: ['movies', 'admin'],
    queryFn: async () => {
      const res = await api.get('/movies')
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Movie>) => {
      await api.post('/movies', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] })
      addToast({ title: 'Película creada', variant: 'success' })
      setIsModalOpen(false)
      setEditingMovie(null)
    },
    onError: () => {
      addToast({ title: 'Error al crear', variant: 'error' })
    }
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Movie> }) => {
      await api.patch(`/movies/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] })
      addToast({ title: 'Película actualizada', variant: 'success' })
      setIsModalOpen(false)
      setEditingMovie(null)
    },
    onError: () => {
      addToast({ title: 'Error al actualizar', variant: 'error' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/movies/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] })
      addToast({ title: 'Película eliminada', variant: 'success' })
    },
  })

  const handleSubmit = (data: Partial<Movie>) => {
    if (editingMovie?.id) {
      updateMutation.mutate({ id: editingMovie.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie)
    setIsModalOpen(true)
  }

  const handleNew = () => {
    setEditingMovie({})
    setIsModalOpen(true)
  }

  if (isLoading) return <LoadingState title="Cargando catálogo..." />
  if (isError) return <ErrorState onRetry={refetch} />

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-black text-white tracking-tight mb-1"
          >
            Películas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-400"
          >
            Gestiona el catálogo y estrenos.
          </motion.p>
        </div>
        <Button onClick={handleNew} leftIcon={<Plus className="w-5 h-5" />}>
          Nueva Película
        </Button>
      </header>

      {(!movies || movies.length === 0) ? (
        <EmptyState
          title="No hay películas"
          subtitle="Comienza agregando una al catálogo."
          action={<Button onClick={handleNew}>Agregar Película</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie, idx) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="group h-full bg-white/5 border-white/5 hover:border-white/10 transition-colors overflow-hidden flex flex-col">
                <div className="aspect-[2/3] relative bg-black/50">
                  {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      Sin Poster
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-bold shadow-lg backdrop-blur-md ${movie.status === 'ESTRENO'
                          ? 'bg-primary-500/80 text-white'
                          : movie.status === 'CARTELERA'
                            ? 'bg-emerald-500/80 text-white'
                            : 'bg-neutral-800/80 text-neutral-300'
                        }`}
                    >
                      {movie.status}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{movie.title}</h3>
                  <p className="text-sm text-white/40 mb-3">{movie.duration} min • {movie.genres.slice(0, 2).join(', ')}</p>

                  <div className="flex gap-2 mt-auto">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => handleEdit(movie)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 px-3"
                      onClick={() => {
                        if (confirm('¿Estás seguro de eliminar esta película?')) {
                          deleteMutation.mutate(movie.id)
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
      <Modal
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsModalOpen(false)
            setEditingMovie(null)
          }
        }}
        title={editingMovie?.id ? 'Editar Película' : 'Nueva Película'}
        description="Completa la información de la película."
      >
        <div className="py-4">
          <MovieForm
            initialData={editingMovie || {}}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </div>
      </Modal>
    </div>
  )
}

