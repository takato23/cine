'use client'

import { useMemo, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DateOption {
    date: Date
    isToday?: boolean
}

interface DateSelectorProps {
    dates?: DateOption[]
    selectedDate: Date
    onDateSelect: (date: Date) => void
    daysToShow?: number
    label?: string
}

function formatDayShort(date: Date): string {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    return days[date.getDay()]
}

function isSameDay(d1: Date, d2: Date): boolean {
    return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    )
}

function generateDates(daysToShow: number): DateOption[] {
    const dates: DateOption[] = []
    const today = new Date()

    for (let i = 0; i < daysToShow; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dates.push({
            date,
            isToday: i === 0,
        })
    }

    return dates
}

export function DateSelector({
    dates,
    selectedDate,
    onDateSelect,
    daysToShow = 7,
    label = 'Elegí fecha',
}: DateSelectorProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const dateOptions = useMemo(() => dates || generateDates(daysToShow), [dates, daysToShow])

    // Scroll to selected date on mount
    useEffect(() => {
        if (scrollRef.current) {
            const selectedIndex = dateOptions.findIndex(d => isSameDay(d.date, selectedDate))
            if (selectedIndex > 0) {
                const pillWidth = 64 // approximate width of each pill
                scrollRef.current.scrollLeft = selectedIndex * pillWidth - 20
            }
        }
    }, [dateOptions, selectedDate])

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-white font-bold text-base">{label}</h3>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1"
            >
                {dateOptions.map((dateOption, idx) => {
                    const isSelected = isSameDay(dateOption.date, selectedDate)

                    return (
                        <motion.button
                            key={dateOption.date.toISOString()}
                            onClick={() => onDateSelect(dateOption.date)}
                            className={`
                relative flex flex-col items-center justify-center
                min-w-[56px] h-[72px] rounded-2xl
                transition-colors duration-200
                ${isSelected
                                    ? 'bg-gradient-to-b from-primary to-primary-600 text-white shadow-glow-primary'
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80'
                                }
              `}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            {/* Today dot indicator */}
                            {dateOption.isToday && !isSelected && (
                                <motion.div
                                    className="absolute top-2 w-1.5 h-1.5 rounded-full bg-primary"
                                    layoutId="today-dot"
                                />
                            )}

                            <span className={`text-[10px] font-medium uppercase tracking-wider ${isSelected ? 'text-white/80' : ''}`}>
                                {formatDayShort(dateOption.date)}
                            </span>
                            <span className={`text-xl font-bold mt-0.5 ${isSelected ? 'text-white' : ''}`}>
                                {dateOption.date.getDate()}
                            </span>

                            {/* Selected indicator glow */}
                            {isSelected && (
                                <motion.div
                                    className="absolute inset-0 rounded-2xl bg-primary/20"
                                    layoutId="date-glow"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
