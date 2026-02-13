
import React, { useState, useRef, useEffect } from 'react';

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

  const getPointCoords = (point: number) => {
    const row = Math.floor((point - 1) / 3);
    const col = (point - 1) % 3;
    // Espaçamento de 70px entre centros
    return { x: col * 75 + 35, y: row * 75 + 35 };
  };

  const updatePattern = (clientX: number, clientY: number) => {
    if (!containerRef.current || !onPatternChange) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    setCurrentPos({ x, y });

    // Detecção de proximidade (Hitbox de 30px)
    for (let i = 1; i <= 9; i++) {
      const pCoord = getPointCoords(i);
      const dist = Math.sqrt(Math.pow(x - pCoord.x, 2) + Math.pow(y - pCoord.y, 2));
      
      if (dist < 30 && !selectedPoints.includes(i)) {
        const newPattern = selectedPoints.length === 0 ? i.toString() : [...selectedPoints, i].join(',');
        onPatternChange(newPattern);
        if ('vibrate' in navigator) navigator.vibrate(15);
        break;
      }
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditing || !onPatternChange) return;
    e.preventDefault(); // Impede scroll
    setIsDragging(true);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    updatePattern(clientX, clientY);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !isEditing) return;
    e.preventDefault(); // Impede scroll enquanto desenha
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    updatePattern(clientX, clientY);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setCurrentPos(null);
  };

  useEffect(() => {
    const handleGlobalEnd = () => handleEnd();
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchend', handleGlobalEnd);
    return () => {
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchend', handleGlobalEnd);
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
        className="relative w-[220px] h-[220px] select-none touch-none bg-white rounded-3xl border-2 border-dashed border-slate-100 p-2"
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
                <line
                  x1={start.x} y1={start.y}
                  x2={end.x} y2={end.y}
                  stroke="#086788"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path 
                  d="M -5 -5 L 5 0 L -5 5 z" 
                  fill="#ffffff"
                  transform={`translate(${midX}, ${midY}) rotate(${angle * 180 / Math.PI})`}
                />
              </g>
            );
          })}
          
          {isDragging && selectedPoints.length > 0 && currentPos && (
            <line
              x1={getPointCoords(selectedPoints[selectedPoints.length - 1]).x}
              y1={getPointCoords(selectedPoints[selectedPoints.length - 1]).y}
              x2={currentPos.x}
              y2={currentPos.y}
              stroke="#086788"
              strokeWidth="4"
              strokeDasharray="5,5"
              opacity="0.4"
            />
          )}
        </svg>

        <div className="grid grid-cols-3 h-full w-full relative z-10 pointer-events-none">
          {points.map((point) => {
            const isSelected = selectedPoints.includes(point);
            return (
              <div key={point} className="flex items-center justify-center">
                <div
                  className={`w-16 h-16 rounded-full border-2 transition-all duration-200 flex items-center justify-center shadow-sm ${
                    isSelected
                      ? 'border-[#086788] bg-[#086788]'
                      : 'border-[#92d5e6] bg-white'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#92d5e6]'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {isEditing && selectedPoints.length > 0 && (
        <button 
          type="button"
          onClick={() => onPatternChange?.('')}
          className="mt-6 px-6 py-2 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-red-100 shadow-sm active:scale-95 transition-all"
        >
          LIMPAR DESENHO
        </button>
      )}
    </div>
  );
};
