'use client'

import { motion } from 'framer-motion'

interface TimeOption {
    time: string // "HH:mm" format
    available?: boolean
}

interface TimeSelectorProps {
    times: TimeOption[]
    selectedTime: string
    onTimeSelect: (time: string) => void
}

export function TimeSelector({
    times,
    selectedTime,
    onTimeSelect,
}: TimeSelectorProps) {
    // Find selected index for positioning
    const selectedIndex = times.findIndex(t => t.time === selectedTime)

    return (
        <div className="w-full overflow-hidden">
            <div className="flex items-center justify-center gap-1 py-4">
                {times.map((timeOption, idx) => {
                    const isSelected = timeOption.time === selectedTime
                    const isNearSelected = Math.abs(idx - selectedIndex) === 1
                    const isFar = Math.abs(idx - selectedIndex) > 1

                    return (
                        <motion.button
                            key={timeOption.time}
                            onClick={() => timeOption.available !== false && onTimeSelect(timeOption.time)}
                            disabled={timeOption.available === false}
                            className={`
                relative px-3 py-2 rounded-xl transition-all duration-300
                ${isSelected
                                    ? 'bg-transparent'
                                    : 'bg-transparent hover:bg-white/5'
                                }
                ${timeOption.available === false ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              `}
                            whileHover={timeOption.available !== false ? { scale: 1.05 } : undefined}
                            whileTap={timeOption.available !== false ? { scale: 0.95 } : undefined}
                        >
                            <motion.span
                                className={`
                  font-semibold transition-all duration-300
                  ${isSelected
                                        ? 'text-white text-xl'
                                        : isNearSelected
                                            ? 'text-white/50 text-base'
                                            : 'text-white/30 text-sm'
                                    }
                `}
                                animate={{
                                    scale: isSelected ? 1.1 : 1,
                                    opacity: isFar ? 0.3 : 1,
                                }}
                            >
                                {timeOption.time}
                            </motion.span>

                            {/* Underline for selected */}
                            {isSelected && (
                                <motion.div
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                                    layoutId="time-indicator"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    )
                })}
            </div>

            {/* Decorative gradient edges */}
            <div className="relative -mt-12 h-12 pointer-events-none flex justify-between">
                <div className="w-16 h-full bg-gradient-to-r from-background-dark to-transparent" />
                <div className="w-16 h-full bg-gradient-to-l from-background-dark to-transparent" />
            </div>
        </div>
    )
}
