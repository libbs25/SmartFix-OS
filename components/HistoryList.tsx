
import React from 'react';
import { ServiceOrder } from '../types';
import { Calendar, DollarSign, Smartphone, ChevronRight, Trash2 } from 'lucide-react';

interface HistoryListProps {
  orders: ServiceOrder[];
  onSelectOS: (os: ServiceOrder) => void;
  onDeleteOS: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ orders, onSelectOS, onDeleteOS }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data N/D';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Calendar size={48} className="mb-4 opacity-20" />
        <p className="text-sm font-bold uppercase tracking-widest">Nenhum histórico encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {orders.map((os) => (
        <div 
          key={os.id}
          className="bg-white dark:bg-slate-800 p-5 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-all group relative"
        >
          <div className="flex justify-between items-start mb-3" onClick={() => onSelectOS(os)}>
            <div className="cursor-pointer">
              <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest block mb-1">OS #{os.osNumber}</span>
              <span className="text-slate-800 dark:text-white font-black text-lg">{os.customerName}</span>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span className="text-green-600 font-black text-base block">
                {os.cost ? `R$ ${os.cost.toFixed(2)}` : 'R$ 0,00'}
              </span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if(confirm('Deseja excluir este registro permanentemente do histórico?')) {
                    onDeleteOS(os.id);
                  }
                }}
                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4 text-sm text-slate-500 dark:text-slate-400 cursor-pointer" onClick={() => onSelectOS(os)}>
            <Smartphone size={16} className="text-blue-500" />
            <span className="font-bold">{os.brand} {os.model}</span>
            <span className="text-[10px] ml-auto font-black uppercase text-slate-300">{formatDate(os.completionDate)}</span>
          </div>

          <div 
            onClick={() => onSelectOS(os)}
            className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between items-center group-hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1 italic">
              {os.workSummary || 'Sem resumo do serviço.'}
            </p>
            <ChevronRight size={14} className="text-blue-300" />
          </div>
        </div>
      ))}
    </div>
  );
};
