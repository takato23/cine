'use client';

import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface QuantitySelectorProps {
    quantity: number;
    onChange: (value: number) => void;
    max?: number;
    min?: number;
}

export function QuantitySelector({ quantity, onChange, max = 10, min = 1 }: QuantitySelectorProps) {
    const handleDecrement = () => {
        if (quantity > min) onChange(quantity - 1);
    };

    const handleIncrement = () => {
        if (quantity < max) onChange(quantity + 1);
    };

    return (
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 w-fit">
            <Button
                variant="ghost"
                size="sm"
                onClick={handleDecrement}
                disabled={quantity <= min}
                className="h-10 w-10 p-0 rounded-xl"
            >
                <Minus className="h-5 w-5" />
            </Button>

            <div className="w-12 text-center">
                <span className="text-2xl font-black text-white tabular-nums">{quantity}</span>
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={handleIncrement}
                disabled={quantity >= max}
                className="h-10 w-10 p-0 rounded-xl bg-white/10 hover:bg-white/20"
            >
                <Plus className="h-5 w-5" />
            </Button>
        </div>
    );
}
