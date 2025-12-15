'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface TabItem {
    id: string
    label: string
    icon?: React.ElementType
}

interface SettingsTabsProps {
    tabs: TabItem[]
    activeTab: string
    onChange: (id: string) => void
}

export function SettingsTabs({ tabs, activeTab, onChange }: SettingsTabsProps) {
    return (
        <div className="flex overflow-x-auto gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                const Icon = tab.icon
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                            isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="settings-tab-active"
                                className="absolute inset-0 bg-white/10 rounded-xl border border-white/5 shadow-sm"
                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {Icon && <Icon className="w-4 h-4 relative z-10" />}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
