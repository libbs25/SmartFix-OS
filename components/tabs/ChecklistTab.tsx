
import React from 'react';
import { ServiceOrder, OSChecklist } from '../../types';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface ChecklistTabProps {
  os: ServiceOrder;
  onUpdate: (checklist: OSChecklist) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({ os, onUpdate }) => {
  const toggleItem = (key: keyof OSChecklist) => {
    const newChecklist = { ...os.checklist, [key]: !os.checklist[key] };
    onUpdate(newChecklist);
  };

  const checklistItems = [
    { key: 'powersOn' as const, label: 'Aparelho liga normalmente' },
    { key: 'mainFunctionsTested' as const, label: 'Função principal testada' },
    { key: 'partReplaced' as const, label: 'Peça substituída funcionando' },
    { key: 'cleaned' as const, label: 'Limpeza realizada' },
    { key: 'finalApproval' as const, label: 'Teste final aprovado' },
  ];

  const allCompleted = Object.values(os.checklist).every(v => v);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Checklist de Manutenção</h3>
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleItem(item.key)}
              className={`w-full p-4 flex items-center gap-3 rounded-xl border transition-all ${
                os.checklist[item.key]
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-gray-200 text-gray-600'
              }`}
            >
              {os.checklist[item.key] ? (
                <CheckCircle2 size={22} className="text-green-500" />
              ) : (
                <Circle size={22} className="text-gray-300" />
              )}
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {!allCompleted && (
        <div className="p-4 bg-orange-50 rounded-xl flex gap-3 border border-orange-100">
          <AlertCircle className="text-orange-500 shrink-0" size={20} />
          <p className="text-xs text-orange-700 font-medium">
            Itens não marcados precisam de comentário ou atenção especial antes de finalizar a OS.
          </p>
        </div>
      )}

      {allCompleted && (
        <div className="p-4 bg-green-50 rounded-xl flex gap-3 border border-green-100">
          <CheckCircle2 className="text-green-500 shrink-0" size={20} />
          <p className="text-xs text-green-700 font-medium">
            Tudo pronto! Você pode finalizar esta ordem de serviço agora.
          </p>
        </div>
      )}
    </div>
  );
};
