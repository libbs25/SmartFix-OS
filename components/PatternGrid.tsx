
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
    // Baseado em um container de 210px (70px por célula)
    return { x: col * 70 + 35, y: row * 70 + 35 };
  };

  const getPointFromCoords = (x: number, y: number) => {
    if (!containerRef.current) return null;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = x - rect.left;
    const relY = y - rect.top;

    // Verifica cada ponto para ver se o dedo está perto do centro (raio de 25px)
    for (let i = 1; i <= 9; i++) {
      const pCoord = getPointCoords(i);
      const dist = Math.sqrt(Math.pow(relX - pCoord.x, 2) + Math.pow(relY - pCoord.y, 2));
      if (dist < 25) return i;
    }
    return null;
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isEditing || !onPatternChange) return;
    
    const touch = 'touches' in e ? e.touches[0] : e;
    const point = getPointFromCoords(touch.clientX, touch.clientY);
    
    setIsDragging(true);
    if (point) {
      onPatternChange(point.toString());
      if ('vibrate' in navigator) navigator.vibrate(10);
    }
    
    updateCurrentPos(e);
  };

  const updateCurrentPos = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const touch = 'touches' in e ? e.touches[0] : e;
    const rect = containerRef.current.getBoundingClientRect();
    setCurrentPos({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !isEditing || !onPatternChange) return;
    
    updateCurrentPos(e);
    const touch = 'touches' in e ? e.touches[0] : e;
    const point = getPointFromCoords(touch.clientX, touch.clientY);
    
    if (point && !selectedPoints.includes(point)) {
      const newPattern = [...selectedPoints, point].join(',');
      onPatternChange(newPattern);
      if ('vibrate' in navigator) navigator.vibrate(10);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    setCurrentPos(null);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchend', handleEnd);
    }
    return () => {
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      onMouseMove={handleMove}
      onTouchMove={handleMove}
      className={`relative w-[210px] h-[210px] mx-auto select-none touch-none rounded-3xl ${
        isEditing ? 'bg-blue-50/20 shadow-inner border border-blue-100/50' : ''
      }`}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Linhas conectadas */}
        {selectedPoints.map((point, i) => {
          if (i === 0) return null;
          const start = getPointCoords(selectedPoints[i - 1]);
          const end = getPointCoords(point);
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2;
          const angle = Math.atan2(end.y - start.y, end.x - start.x);

          return (
            <g key={`line-${i}`}>
              <line
                x1={start.x} y1={start.y}
                x2={end.x} y2={end.y}
                stroke="#086788"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path 
                d="M -4 -4 L 4 0 L -4 4 z" 
                fill="#ffffff"
                transform={`translate(${midX}, ${midY}) rotate(${angle * 180 / Math.PI})`}
              />
            </g>
          );
        })}

        {/* Linha "elástica" que segue o dedo */}
        {isDragging && selectedPoints.length > 0 && currentPos && (
          <line
            x1={getPointCoords(selectedPoints[selectedPoints.length - 1]).x}
            y1={getPointCoords(selectedPoints[selectedPoints.length - 1]).y}
            x2={currentPos.x}
            y2={currentPos.y}
            stroke="#086788"
            strokeWidth="4"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        )}
      </svg>

      <div className="grid grid-cols-3 h-full w-full relative z-10 pointer-events-none">
        {points.map((point) => {
          const isSelected = selectedPoints.includes(point);
          const isLast = selectedPoints[selectedPoints.length - 1] === point;
          
          return (
            <div key={point} className="flex items-center justify-center">
              <div
                className={`w-14 h-14 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                  isSelected
                    ? 'border-[#086788] bg-[#086788] scale-110 shadow-lg'
                    : 'border-[#92d5e6] bg-white/50'
                }`}
              >
                {isSelected && (
                  <div className={`w-2 h-2 rounded-full bg-white ${isLast && isEditing ? 'animate-ping' : ''}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {isEditing && selectedPoints.length > 0 && (
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onPatternChange?.(''); }}
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-50 text-red-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm whitespace-nowrap active:scale-95 transition-all"
        >
          LIMPAR DESENHO
        </button>
      )}
    </div>
  );
};
