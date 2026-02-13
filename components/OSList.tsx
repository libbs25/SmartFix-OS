
import React from 'react';
import { ServiceOrder, OSStatus } from '../types';
import { ChevronRight, Smartphone, Clock } from 'lucide-react';

interface OSListProps {
  orders: ServiceOrder[];
  onSelectOS: (os: ServiceOrder) => void;
}

export const OSList: React.FC<OSListProps> = ({ orders, onSelectOS }) => {
  const getStatusStyles = (status: OSStatus) => {
    switch (status) {
      case OSStatus.MAINTENANCE: 
        return 'bg-orange-500 text-white shadow-orange-100 dark:shadow-none';
      case OSStatus.READY: 
        return 'bg-blue-500 text-white shadow-blue-100 dark:shadow-none';
      case OSStatus.OPEN: 
        return 'bg-purple-600 text-white shadow-purple-100 dark:shadow-none';
      case OSStatus.DELIVERED: 
        return 'bg-emerald-500 text-white shadow-emerald-100 dark:shadow-none';
      case OSStatus.WAITING_PARTS:
        return 'bg-rose-500 text-white shadow-rose-100 dark:shadow-none';
      default: 
        return 'bg-slate-400 text-white';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-full mb-4">
          <Smartphone size={40} className="opacity-20" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest">Nenhuma OS encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {orders.map((os) => (
        <div 
          key={os.id}
          onClick={() => onSelectOS(os)}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 active:scale-[0.98] transition-all cursor-pointer group relative overflow-hidden"
        >
          {/* TOPO: NÚMERO E STATUS */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex flex-col">
              <h2 className="text-blue-600 dark:text-blue-400 font-black text-xl tracking-tighter">#{os.osNumber}</h2>
              <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                <Clock size={10} />
                {new Date(os.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
            <div className={`flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm transition-colors ${getStatusStyles(os.status)}`}>
              {os.status}
            </div>
          </div>
          
          {/* MEIO: APARELHO */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-xl text-slate-400 dark:text-slate-300">
              <Smartphone size={18} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-black text-slate-800 dark:text-white text-base truncate">{os.brand} {os.model}</span>
              <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{os.deviceType}</span>
            </div>
          </div>

          {/* BASE: DEFEITO */}
          <div className="pt-2 border-t border-slate-50 dark:border-slate-700/50 mt-1">
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              <span className="font-black text-slate-400 dark:text-slate-500 uppercase text-[9px] tracking-widest mr-1">Defeito:</span>
              {os.reportedDefect}
            </p>
          </div>

          {/* INDICADOR LATERAL DE STATUS */}
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusStyles(os.status).split(' ')[0]}`} />
          
          <div className="absolute right-4 bottom-5 text-slate-200 dark:text-slate-600 group-hover:text-blue-400 transition-colors">
            <ChevronRight size={20} strokeWidth={3} />
          </div>
        </div>
      ))}
    </div>
  );
};
