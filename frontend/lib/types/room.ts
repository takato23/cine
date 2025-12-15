import { SeatRow } from '@/components/seats/SeatMap';

export interface Room {
    id: string;
    name: string;
    rows: SeatRow[];
    capacity?: number;
    seatingType?: 'assigned' | 'general'; // 'assigned' (numerada) or 'general' (sin numerar)
    type?: string; // 'Standard', 'VIP', etc.
    // Add other properties as needed
}
