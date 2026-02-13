
import React from 'react';
import { ServiceOrder, OSChecklist } from '../../types.ts';
import { CheckCircle2, Circle, Smartphone, Wifi, Camera, Mic, BatteryCharging, AlertCircle } from 'lucide-react';

interface ChecklistTabProps {
  os: ServiceOrder;
  onUpdate: (checklist: OSChecklist) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({ os, onUpdate }) => {
  const toggleItem = (key: keyof OSChecklist) => {
    const newChecklist = { ...os.checklist, [key]: !os.checklist[key] };
    onUpdate(newChecklist);
    if ('vibrate' in navigator) navigator.vibrate(10);
  };

  const checklistItems = [
    { key: 'touchDisplay' as const, label: 'Touch e Display (Sem manchas/toques fantasma)', icon: Smartphone },
    { key: 'wifiBluetooth' as const, label: 'Conectividade (Wi-Fi e Bluetooth)', icon: Wifi },
    { key: 'cameras' as const, label: 'Câmeras (Frontal, Traseira e Foco)', icon: Camera },
    { key: 'micAudio' as const, label: 'Áudio (Microfones e Alto-falantes)', icon: Mic },
    { key: 'charging' as const, label: 'Carga e Bateria (Consumo e Conector)', icon: BatteryCharging },
  ];

  const completedCount = Object.values(os.checklist).filter(v => v).length;
  const isFullyCompleted = completedCount === checklistItems.length;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inspeção Técnica</h3>
        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${isFullyCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {completedCount}/{checklistItems.length} OK
        </span>
      </div>

      <div className="space-y-3">
        {checklistItems.map((item) => (
          <button
            key={item.key}
            onClick={() => toggleItem(item.key)}
            className={`w-full p-5 flex items-center gap-4 rounded-2xl border transition-all active:scale-[0.98] ${
              os.checklist[item.key]
                ? 'bg-green-50 border-green-200 text-green-700 shadow-sm'
                : 'bg-white border-slate-100 text-slate-500 shadow-sm'
            }`}
          >
            <div className={`p-2 rounded-xl transition-colors ${os.checklist[item.key] ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              <item.icon size={20} />
            </div>
            
            <span className="flex-1 text-left text-sm font-bold leading-tight">
              {item.label}
            </span>

            {os.checklist[item.key] ? (
              <CheckCircle2 size={24} className="text-green-500 shrink-0" />
            ) : (
              <Circle size={24} className="text-slate-200 shrink-0" />
            )}
          </button>
        ))}
      </div>

      {isFullyCompleted ? (
        <div className="p-5 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4 animate-in fade-in zoom-in duration-300">
          <div className="p-2 bg-green-500 text-white rounded-full">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="text-sm font-black text-green-800">Testes Concluídos!</p>
            <p className="text-xs text-green-600 font-medium">Aparelho liberado para fechamento ou entrega.</p>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
          <AlertCircle size={24} className="text-blue-400 shrink-0" />
          <p className="text-xs text-blue-600 font-medium leading-relaxed">
            Certifique-se de realizar todos os testes antes de liberar o aparelho para o cliente.
          </p>
        </div>
      )}
    </div>
  );
};
