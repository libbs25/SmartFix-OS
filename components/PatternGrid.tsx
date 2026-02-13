
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface PatternGridProps {
  pattern: string;
  onPatternChange?: (newPattern: string) => void;
  isEditing: boolean;
}

export const PatternGrid: React.FC<PatternGridProps> = ({ pattern, onPatternChange, isEditing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentPos, setCurrentPos] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const points = Array.from({ length: 9 }, (_, i) => i + 1);
  const selectedPoints = pattern ? pattern.split(',').map(Number) : [];

  const getPointCoords = useCallback((point: number) => {
    const row = Math.floor((point - 1) / 3);
    const col = (point - 1) % 3;
    // Baseado num container de ~200px
    return { x: col * 65 + 32, y: row * 65 + 32 };
  }, []);

  const updatePattern = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || !onPatternChange) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setCurrentPos({ x, y });

    // Hitbox generosa de 28px para técnicos com luva
    for (let i = 1; i <= 9; i++) {
      const pCoord = getPointCoords(i);
      const dist = Math.sqrt(Math.pow(x - pCoord.x, 2) + Math.pow(y - pCoord.y, 2));
      if (dist < 28 && !selectedPoints.includes(i)) {
        onPatternChange(selectedPoints.length === 0 ? i.toString() : [...selectedPoints, i].join(','));
        if ('vibrate' in navigator) navigator.vibrate(12);
        break;
      }
    }
  }, [getPointCoords, onPatternChange, selectedPoints]);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditing || !onPatternChange) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    updatePattern(clientX, clientY);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !isEditing) return;
    // Crucial: impede o scroll do celular enquanto desenha
    if (e.cancelable) e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    updatePattern(clientX, clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setCurrentPos(null);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div 
        ref={containerRef}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
        onMouseMove={handleMove}
        onTouchMove={handleMove}
        className="relative w-[195px] h-[195px] select-none touch-none"
        style={{ touchAction: 'none' }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          {selectedPoints.map((point, i) => {
            if (i === 0) return null;
            const start = getPointCoords(selectedPoints[i - 1]);
            const end = getPointCoords(point);
            const angle = Math.atan2(end.y - start.y, end.x - start.x);
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2;

            return (
              <g key={`pattern-line-${i}`}>
                <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#086788" strokeWidth="7" strokeLinecap="round" />
                <path d="M -4 -4 L 4 0 L -4 4 z" fill="#ffffff" transform={`translate(${midX}, ${midY}) rotate(${angle * 180 / Math.PI})`} />
              </g>
            );
          })}
          {isDragging && selectedPoints.length > 0 && currentPos && (
            <line x1={getPointCoords(selectedPoints[selectedPoints.length - 1]).x} y1={getPointCoords(selectedPoints[selectedPoints.length - 1]).y} x2={currentPos.x} y2={currentPos.y} stroke="#086788" strokeWidth="3" strokeDasharray="4,4" opacity="0.4" />
          )}
        </svg>

        <div className="grid grid-cols-3 h-full w-full relative z-10 pointer-events-none">
          {points.map((point) => {
            const isSelected = selectedPoints.includes(point);
            return (
              <div key={point} className="flex items-center justify-center">
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-[#086788] bg-[#086788]' : 'border-[#92d5e6] bg-transparent'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#92d5e6]'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {isEditing && selectedPoints.length > 0 && (
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onPatternChange?.(''); }}
          className="mt-6 px-6 py-2 bg-[#fff1f2] text-[#be123c] rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-[#fecdd3] shadow-sm active:scale-95 transition-all"
        >
          LIMPAR DESENHO
        </button>
      )}
    </div>
  );
};
