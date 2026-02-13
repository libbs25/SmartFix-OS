
import React, { useState } from 'react';
import { ServiceOrder } from '../../types';
import { MessageSquare, Save } from 'lucide-react';

interface NotesTabProps {
  os: ServiceOrder;
  onUpdate: (notes: string) => void;
}

export const NotesTab: React.FC<NotesTabProps> = ({ os, onUpdate }) => {
  const [notes, setNotes] = useState(os.notes);

  return (
    <div className="p-4 flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 font-bold">
          <MessageSquare size={20} />
          <span>Observações Internas</span>
        </div>
        <button 
          onClick={() => onUpdate(notes)}
          className="text-xs font-bold text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
        >
          <Save size={14} />
          Salvar
        </button>
      </div>
      
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Adicione observações técnicas aqui..."
        className="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[300px]"
      />

      <div className="text-[10px] text-gray-400 text-center italic">
        * Estas notas não são visíveis para o cliente por padrão.
      </div>
    </div>
  );
};
