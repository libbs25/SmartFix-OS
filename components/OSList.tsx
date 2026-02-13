
import React from 'react';
import { ServiceOrder, OSStatus } from '../types';
import { ChevronRight, Smartphone } from 'lucide-react';

interface OSListProps {
  orders: ServiceOrder[];
  onSelectOS: (os: ServiceOrder) => void;
}

export const OSList: React.FC<OSListProps> = ({ orders, onSelectOS }) => {
  const getStatusBadge = (os: ServiceOrder) => {
    switch (os.status) {
      case OSStatus.MAINTENANCE: 
        return 'bg-[#f59e0b] text-white';
      case OSStatus.READY: 
        return 'bg-[#2563eb] text-white';
      case OSStatus.OPEN: 
        return 'bg-purple-600 text-white';
      case OSStatus.DELIVERED: 
        return 'bg-green-500 text-white';
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
        <p className="text-sm font-bold uppercase tracking-widest">Nenhuma OS encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24">
      {orders.map((os) => (
        <div 
          key={os.id}
          onClick={() => onSelectOS(os)}
          className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 active:scale-[0.98] transition-all cursor-pointer group relative"
        >
          {/* TOPO: NÚMERO E STATUS */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-[#2563eb] dark:text-blue-400 font-bold text-xl tracking-tight">{os.osNumber}</h2>
            <div className={`flex items-center px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight shadow-sm ${getStatusBadge(os)}`}>
              {os.status}
            </div>
            {/* CHEVRON DISCRETO NO CANTO */}
            <div className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-300">
              <ChevronRight size={18} />
            </div>
          </div>
          
          {/* MEIO: APARELHO */}
          <div className="flex items-center gap-2 mb-3">
            <Smartphone size={16} className="text-slate-400" />
            <div className="flex items-baseline gap-1.5 overflow-hidden">
              <span className="font-bold text-slate-800 dark:text-white text-sm truncate">{os.brand} {os.model}</span>
              <span className="text-slate-400 text-[11px] font-medium whitespace-nowrap"> • {os.deviceType}</span>
            </div>
          </div>

          {/* BASE: DEFEITO */}
          <div className="pt-2">
            <p className="text-[12px] text-slate-500 dark:text-slate-400 font-medium">
              <span className="font-bold text-slate-600 dark:text-slate-300">Defeito: </span>
              {os.reportedDefect}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
