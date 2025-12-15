'use client';

import { useState } from 'react';
import { SeatRow } from '@/components/seats/SeatMap';
import { cn } from '@/lib/cn';
import { Plus, Minus, Save, Trash2, Sofa, Armchair } from 'lucide-react';

interface RoomEditorProps {
    initialRows: SeatRow[];
    onSave: (rows: SeatRow[], seatingType: 'assigned' | 'general') => void;
}

export function RoomEditor({ initialRows, onSave }: RoomEditorProps) {
    // We convert the "SeatRow" structure into a simpler 2D Grid for editing
    // Then convert back on save.
    // Temporary State: Grid of "Cell Types" (Seat, Aisle, Empty)

    // For now, let's just visualize the current rows and allow adding/removing seats from ends
    const [rows, setRows] = useState<SeatRow[]>(initialRows.length > 0 ? initialRows : createDefaultGrid(10, 20));
    const [seatingType, setSeatingType] = useState<'assigned' | 'general'>('assigned');
    const [selectedTool, setSelectedTool] = useState<'seat' | 'aisle' | 'delete'>('seat');

    function createDefaultGrid(rowCount: number, colCount: number): SeatRow[] {
        const newRows: SeatRow[] = [];
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < rowCount; i++) {
            const letter = alphabet[i] || `R${i + 1}`;
            newRows.push({
                letter,
                seats: Array.from({ length: colCount }, (_, j) => ({
                    row: letter,
                    number: j + 1,
                    type: 'STANDARD', // 'STANDARD', 'VIP', 'COUPLE'
                    available: true
                }))
            });
        }
        return newRows;
    }

    // Handlers for Row/Col manipulation
    const addRow = () => {
        const nextLetter = String.fromCharCode(65 + rows.length); // A, B, C...
        const colCount = rows[0]?.seats.length || 20;
        setRows([...rows, {
            letter: nextLetter,
            seats: Array.from({ length: colCount }, (_, j) => ({
                row: nextLetter,
                number: j + 1,
                type: 'STANDARD',
                available: true
            }))
        }]);
    };

    const removeRow = () => {
        if (rows.length === 0) return;
        setRows(rows.slice(0, -1));
    };

    const addColumn = () => {
        setRows(rows.map(row => ({
            ...row,
            seats: [...row.seats, {
                row: row.letter,
                number: row.seats.length + 1,
                type: 'STANDARD',
                available: true
            }]
        })));
    };

    const removeColumn = () => {
        setRows(rows.map(row => ({
            ...row,
            seats: row.seats.slice(0, -1)
        })));
    };

    // Cell Click Handler
    const handleCellClick = (rIndex: number, sIndex: number) => {
        const newRows = [...rows];
        const seat = newRows[rIndex].seats[sIndex];

        if (selectedTool === 'seat') {
            // cycle types? or just set to standard if it was empty/aisle?
            // Since we don't have a specific "Aisle" type in the SeatData interface yet,
            // we usually simulate aisles by... well, actually we need to think about this.
            // Currently the "rows" array defines the physics.
            // If we want a GAP, we might need a "type: 'gap'" or simply *remove* the seat from the array?
            // But a grid editor needs to keep the slot.

            // VISUAL HACK: 'locked' = true could be a "gap" if we hide it in CSS?
            // Better: Let's assume 'type: empty'
            seat.type = 'STANDARD';
            seat.available = true;
        } else if (selectedTool === 'aisle') {
            // Mark as Aisle/Gap (we'll implement logic to skip rendering this seat)
            seat.type = 'GAP';
            seat.available = false;
        } else if (selectedTool === 'delete') {
            seat.type = 'GAP';
            seat.available = false;
        }

        setRows(newRows);
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                        <button onClick={addRow} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Agregar Fila"><Plus className="w-4 h-4" /></button>
                        <span className="text-white font-mono text-sm">Filas: {rows.length}</span>
                        <button onClick={removeRow} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Quitar Fila"><Minus className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                        <button onClick={addColumn} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Agregar Columna"><Plus className="w-4 h-4" /></button>
                        <span className="text-white font-mono text-sm">Columnas: {rows[0]?.seats.length || 0}</span>
                        <button onClick={removeColumn} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Quitar Columna"><Minus className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="flex items-center gap-2 mr-4 border-r border-white/10 pr-4">
                    <span className="text-white font-mono text-sm mr-2">Tipo:</span>
                    <button
                        onClick={() => setSeatingType('assigned')}
                        className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", seatingType === 'assigned' ? "bg-brand-primary text-white" : "bg-white/10 text-white/50")}
                    >Numerada</button>
                    <button
                        onClick={() => setSeatingType('general')}
                        className={cn("px-3 py-1 rounded-md text-xs font-bold transition-all", seatingType === 'general' ? "bg-brand-primary text-white" : "bg-white/10 text-white/50")}
                    >Sin Numerar</button>
                </div>

                <div className="flex items-center gap-2">
                    <ToolButton
                        active={selectedTool === 'seat'}
                        onClick={() => setSelectedTool('seat')}
                        icon={<Sofa className="w-4 h-4" />}
                        label="Butaca"
                    />
                    <ToolButton
                        active={selectedTool === 'aisle'}
                        onClick={() => setSelectedTool('aisle')}
                        icon={<div className="w-4 h-4 border-2 border-dashed border-current rounded" />}
                        label="Pasillo"
                    />
                    <ToolButton
                        active={selectedTool === 'delete'}
                        onClick={() => setSelectedTool('delete')}
                        icon={<Trash2 className="w-4 h-4" />}
                        label="Borrar"
                    />
                </div>

                <button
                    onClick={() => onSave(rows, seatingType)}
                    className="flex items-center gap-2 px-6 py-2 bg-brand-primary text-white rounded-lg font-bold hover:bg-brand-secondary transition-colors"
                >
                    <Save className="w-4 h-4" />
                    Guardar Diseño
                </button>
            </div>

            {/* Grid Visualizer */}
            <div className="overflow-x-auto p-8 bg-black/20 rounded-xl border border-white/5 flex justify-center min-h-[500px]">
                <div className="flex flex-col gap-2">
                    {/* Screen Indicator */}
                    <div className="w-full h-8 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl mb-8 flex items-center justify-center text-white/30 text-xs tracking-[0.5em] font-bold uppercase border-t border-white/10">
                        Pantalla
                    </div>

                    {rows.map((row, rIndex) => (
                        <div key={row.letter} className="flex items-center gap-2">
                            <div className="w-6 text-right text-white/50 text-xs font-mono">{row.letter}</div>
                            <div className="flex gap-1">
                                {row.seats.map((seat, sIndex) => (
                                    <div
                                        key={`${rIndex}-${sIndex}`}
                                        onClick={() => handleCellClick(rIndex, sIndex)}
                                        className={cn(
                                            "w-8 h-8 rounded-t-lg cursor-pointer transition-all border",
                                            seat.type === 'GAP'
                                                ? "bg-transparent border-white/5 hover:bg-white/5"
                                                : "bg-[#8a1c1c] border-white/20 hover:bg-[#aa2424]"
                                        )}
                                        title={`${row.letter}${seat.number}`}
                                    >
                                        {/* Little armrests visual */}
                                        {seat.type !== 'GAP' && (
                                            <div className="w-full h-full relative">
                                                <div className="absolute bottom-0 left-0 w-1 h-3 bg-black/30 rounded-tr" />
                                                <div className="absolute bottom-0 right-0 w-1 h-3 bg-black/30 rounded-tl" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="w-6 text-left text-white/50 text-xs font-mono">{row.letter}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ToolButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors border text-sm font-medium",
                active
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white/70 border-white/10 hover:bg-white/5 hover:text-white"
            )}
        >
            {icon}
            <span>{label}</span>
        </button>
    )
}
