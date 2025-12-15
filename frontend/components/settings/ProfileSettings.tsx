'use client'

import { useState } from 'react'
import { useAuthStore } from '@/lib/store'
import { Button } from '@/components/ui/Button'
import { Camera, Mail, Phone, User } from 'lucide-react'

export function ProfileSettings() {
    const { user } = useAuthStore()
    const [isLoading, setIsLoading] = useState(false)

    // Mock save
    const handleSave = async () => {
        setIsLoading(true)
        await new Promise(r => setTimeout(r, 1000))
        setIsLoading(false)
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-white/10 overflow-hidden bg-neutral-900">
                        <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || user?.email}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-[#0a0a0a] shadow-lg transition-transform group-hover:scale-110">
                        <Camera className="w-4 h-4 text-white" />
                    </button>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Tu Avatar</h3>
                    <p className="text-sm text-white/50">Personaliza cómo te ven los demás.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="grid gap-6 max-w-xl">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="text"
                            defaultValue={user?.name || ''}
                            placeholder="Tu nombre"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="email"
                            defaultValue={user?.email || ''}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white/50 cursor-not-allowed font-medium"
                        />
                    </div>
                    <p className="text-xs text-white/30 ml-1">El email no se puede cambiar.</p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-white/60 uppercase tracking-wider ml-1">Teléfono</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="tel"
                            placeholder="+54 9 ..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <Button onClick={handleSave} isLoading={isLoading} className="w-full md:w-auto">
                        Guardar Cambios
                    </Button>
                </div>
            </div>
        </div>
    )
}
