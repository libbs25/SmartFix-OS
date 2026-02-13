
import React from 'react';

interface PatternGridProps {
  pattern: string;
  onPatternChange?: (newPattern: string) => void;
  isEditing: boolean;
}

export const PatternGrid: React.FC<PatternGridProps> = ({ pattern, onPatternChange, isEditing }) => {
  const points = Array.from({ length: 9 }, (_, i) => i + 1);
  const selectedPoints = pattern ? pattern.split(',').map(Number) : [];

  const handlePointClick = (point: number) => {
    if (!isEditing || !onPatternChange) return;
    
    let newSelected;
    if (selectedPoints.includes(point)) {
      const index = selectedPoints.indexOf(point);
      // Se clicar em um ponto já selecionado, mantém até aquele ponto para facilitar correções
      newSelected = selectedPoints.slice(0, index + 1);
      // Se clicou no último, remove para permitir "backspace"
      if (newSelected.length === selectedPoints.length) {
         newSelected = selectedPoints.slice(0, index);
      }
    } else {
      newSelected = [...selectedPoints, point];
    }
    onPatternChange(newSelected.join(','));
  };

  const getPointCoords = (point: number) => {
    const row = Math.floor((point - 1) / 3);
    const col = (point - 1) % 3;
    // Coordenadas ajustadas para um grid 3x3 em um SVG de 200x200
    return { x: col * 60 + 40, y: row * 60 + 40 };
  };

  return (
    <div className={`relative w-[200px] h-[200px] mx-auto select-none p-4 rounded-3xl border transition-all ${
      isEditing ? 'bg-white shadow-lg border-blue-100' : 'bg-slate-100/50 border-slate-200'
    }`}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="3"
            markerHeight="3"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={isEditing ? "#3b82f6" : "#94a3b8"} />
          </marker>
        </defs>
        {selectedPoints.map((point, i) => {
          if (i === 0) return null;
          const start = getPointCoords(selectedPoints[i - 1]);
          const end = getPointCoords(point);
          
          const dx = end.x - start.x;
          const dy = end.y - start.y;
          const angle = Math.atan2(dy, dx);
          const distance = Math.sqrt(dx*dx + dy*dy);
          const shortDistance = distance - 15; 
          
          const lineEndX = start.x + Math.cos(angle) * shortDistance;
          const lineEndY = start.y + Math.sin(angle) * shortDistance;

          return (
            <line
              key={`line-${i}`}
              x1={start.x}
              y1={start.y}
              x2={lineEndX}
              y2={lineEndY}
              stroke={isEditing ? "#3b82f6" : "#94a3b8"}
              strokeWidth="4"
              strokeLinecap="round"
              markerEnd="url(#arrow)"
              className="opacity-40 transition-all duration-300"
            />
          );
        })}
      </svg>
      <div className="grid grid-cols-3 gap-4 h-full w-full relative z-10">
        {points.map((point) => {
          const isSelected = selectedPoints.includes(point);
          const isLast = selectedPoints[selectedPoints.length - 1] === point;
          const order = selectedPoints.indexOf(point) + 1;
          
          return (
            <div
              key={point}
              onClick={() => handlePointClick(point)}
              className="flex items-center justify-center relative cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                  isSelected
                    ? isEditing 
                      ? 'bg-blue-500 border-blue-600 scale-110 shadow-lg ring-4 ring-blue-50' 
                      : 'bg-slate-500 border-slate-600'
                    : 'border-slate-200 bg-white hover:border-blue-300'
                }`}
              >
                {isSelected && (
                  <div className={`w-3 h-3 rounded-full bg-white ${isLast && isEditing ? 'animate-pulse' : ''}`} />
                )}
                
                {/* Indicador de ordem numérica para facilitar o cadastro */}
                {isSelected && isEditing && (
                  <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black shadow-sm z-20">
                    {order}
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
      
      {isEditing && (
        <div className="absolute -bottom-12 left-0 right-0 flex justify-center">
           <button 
            type="button"
            onClick={() => onPatternChange?.('')}
            className="text-[10px] text-red-500 font-black uppercase tracking-widest bg-red-50 px-4 py-1.5 rounded-full border border-red-100 active:scale-95 transition-all shadow-sm"
          >
            Limpar Padrão
          </button>
        </div>
      )}
    </div>
  );
};
