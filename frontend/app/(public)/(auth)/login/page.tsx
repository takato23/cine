'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { Film, Mail, Lock, User, ArrowRight, Sparkles, LogIn, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [showDevTools, setShowDevTools] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  })

  // Quick access buttons for development
  const quickUsers = [
    { label: 'Admin', email: 'admin@cinema.test', password: 'admin123', role: 'Administrador' },
    { label: 'Staff', email: 'staff@cinema.test', password: 'staff123', role: 'Vendedor' },
    { label: 'Cliente', email: 'cliente@cinema.test', password: 'cliente123', role: 'Cliente' },
  ]

  const authMutation = useMutation({
    mutationFn: async () => {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const res = await api.post(endpoint, formData)
      return res.data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      router.push('/cartelera')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    authMutation.mutate()
  }

  const handleQuickLogin = (email: string, password: string) => {
    setFormData({ ...formData, email, password });
  }

  return (
    <div className="min-h-screen flex bg-[#0F0F0F] text-neutral-50 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      {/* Left: Form side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4 mb-12 group w-fit">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/30 group-hover:scale-105 transition-transform duration-300">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">Cinema</span>
              <span className="text-sm font-medium text-primary-400 tracking-wider uppercase">Pergamino</span>
            </div>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400">
              {isLogin ? 'Bienvenido de vuelta' : 'Crear cuenta'}
            </h1>
            <p className="text-neutral-400 text-lg">
              {isLogin
                ? 'Ingresá para vivir la experiencia.'
                : 'Unite a nosotros para disfrutar del mejor cine.'}
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
            {/* Simple accent light inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Input
                      label="Nombre"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre completo"
                      icon={<User className="w-4 h-4" />}
                      className="bg-neutral-900/50 border-neutral-800 focus:border-primary-500/50 focus:ring-primary-500/20"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="nombre@ejemplo.com"
                icon={<Mail className="w-4 h-4" />}
                className="bg-neutral-900/50 border-neutral-800 focus:border-primary-500/50 focus:ring-primary-500/20"
              />

              <div className="space-y-1">
                <Input
                  label="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  className="bg-neutral-900/50 border-neutral-800 focus:border-primary-500/50 focus:ring-primary-500/20"
                />
                {isLogin && (
                  <div className="flex justify-end">
                    <button type="button" className="text-xs text-neutral-500 hover:text-primary-400 transition-colors">
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                )}
              </div>

              {authMutation.isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                >
                  <div className="w-1 h-8 bg-red-500 rounded-full" />
                  {authMutation.error instanceof Error
                    ? authMutation.error.message
                    : 'Error al autenticar. Por favor revisá tus datos.'}
                </motion.div>
              )}

              <Button
                type="submit"
                isLoading={authMutation.isPending}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white shadow-lg shadow-primary-900/20 border-none h-12 text-base"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {isLogin ? 'Ingresar' : 'Crear Cuenta'}
              </Button>
            </form>
          </div>

          {/* Dev Tools Toggle */}
          <div className="mt-8 flex flex-col items-center">
            <button
              onClick={() => setShowDevTools(!showDevTools)}
              className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-widest"
            >
              <Wrench className="w-3 h-3" />
              Dev Tools
            </button>

            <AnimatePresence>
              {showDevTools && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="w-full grid grid-cols-3 gap-2 overflow-hidden"
                >
                  {quickUsers.map((u) => (
                    <button
                      key={u.label}
                      type="button"
                      onClick={() => handleQuickLogin(u.email, u.password)}
                      className="glass px-3 py-2 rounded-lg text-xs text-neutral-300 hover:bg-white/5 transition-colors text-center border border-white/5"
                    >
                      <span className="block font-medium">{u.label}</span>
                      <span className="text-[10px] text-neutral-500">{u.role}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 text-center">
            <p className="text-neutral-500 text-sm">
              {isLogin ? '¿Aún no tenés cuenta?' : '¿Ya tenés una cuenta?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-neutral-300 hover:text-primary-400 font-medium transition-colors underline decoration-transparent hover:decoration-primary-400/30 underline-offset-4"
              >
                {isLogin ? 'Registrate gratis' : 'Iniciá sesión'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right: Image/Branding side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-neutral-900">
        {/* Abstract Cinematic Background */}
        <div
          className="absolute inset-0 z-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" // Cinema seats/theater abstract
        />
        <div className="absolute inset-0 bg-gradient-to-l from-neutral-900 via-neutral-900/20 to-neutral-900 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent z-10" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_100%_0%,rgba(215,18,58,0.3),transparent)] z-10" />

        <div className="relative z-20 flex flex-col justify-end h-full p-16 pb-24">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm w-fit">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-amber-100/90 font-medium uppercase tracking-widest">Experiencia Premium</span>
            </div>

            <h2 className="text-6xl font-bold text-white leading-[1.1] tracking-tight">
              Tu butaca te <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-amber-500">está esperando.</span>
            </h2>

            <p className="text-lg text-neutral-300 leading-relaxed max-w-md">
              Descubrí la magia del cine con la mejor calidad de imagen y sonido.
              Reservá tus entradas desde cualquier lugar.
            </p>

            <div className="flex gap-4 pt-4">
              <div className="flex flex-col gap-1 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-32">
                <span className="text-3xl font-bold text-white">4K</span>
                <span className="text-xs text-neutral-400 uppercase tracking-widest">Ultra HD</span>
              </div>
              <div className="flex flex-col gap-1 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 w-32">
                <span className="text-3xl font-bold text-white">3D</span>
                <span className="text-xs text-neutral-400 uppercase tracking-widest">Inmersivo</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
