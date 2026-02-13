
import React, { useState } from 'react';
import { ServiceOrder, TabType, OSStatus } from '../types.ts';
import { ArrowLeft, Smartphone, MessageSquare, Camera, CheckSquare, X, DollarSign, FileText, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { DeviceTab } from './tabs/DeviceTab.tsx';
import { NotesTab } from './tabs/NotesTab.tsx';
import { PhotosTab } from './tabs/PhotosTab.tsx';
import { ChecklistTab } from './tabs/ChecklistTab.tsx';

interface OSDetailProps {
  os: ServiceOrder;
  onBack: () => void;
  onUpdate: (os: ServiceOrder) => void;
}

export const OSDetail: React.FC<OSDetailProps> = ({ os, onBack, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('device');
  const [showFinishForm, setShowFinishForm] = useState(false);
  const [finalCost, setFinalCost] = useState(os.cost?.toString() || '');
  const [finalSummary, setFinalSummary] = useState(os.workSummary || '');
  const [paymentStatus, setPaymentStatus] = useState<'pago' | 'pendente'>('pago');

  const tabs = [
    { id: 'device' as TabType, label: 'APARELHO', icon: Smartphone },
    { id: 'notes' as TabType, label: 'OBSERVAÇÕES', icon: MessageSquare },
    { id: 'photos' as TabType, label: 'FOTOS', icon: Camera },
    { id: 'checklist' as TabType, label: 'CHECKLIST', icon: CheckSquare },
  ];

  const getStatusBadgeStyles = (status: OSStatus) => {
    switch (status) {
      case OSStatus.DELIVERED: return 'bg-emerald-500 text-white';
      case OSStatus.READY: return 'bg-blue-500 text-white';
      case OSStatus.OPEN: return 'bg-purple-600 text-white';
      case OSStatus.MAINTENANCE: return 'bg-orange-500 text-white';
      case OSStatus.WAITING_PARTS: return 'bg-rose-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  const handleFinish = () => {
    onUpdate({
      ...os,
      status: paymentStatus === 'pago' ? OSStatus.DELIVERED : OSStatus.READY,
      paymentStatus: paymentStatus,
      cost: parseFloat(finalCost) || 0,
      workSummary: finalSummary,
      completionDate: new Date().toISOString()
    });
    onBack();
  };

  const handleSetPriority = () => {
    onUpdate({ ...os, status: OSStatus.OPEN });
    onBack();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'device': return <DeviceTab os={os} onUpdate={(updatedFields) => onUpdate({ ...os, ...updatedFields })} />;
      case 'notes': return <NotesTab os={os} onUpdate={(notes) => onUpdate({ ...os, notes })} />;
      case 'photos': return <PhotosTab os={os} onUpdate={(photos) => onUpdate({ ...os, photos })} />;
      case 'checklist': return <ChecklistTab os={os} onUpdate={(checklist) => onUpdate({ ...os, checklist })} />;
      default: return null;
    }
  };

  if (showFinishForm) {
    return (
      <div className="flex flex-col h-screen bg-white p-6 animate-in slide-in-from-bottom duration-300 z-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-slate-800">Finalizar OS #{os.osNumber}</h2>
          <button onClick={() => setShowFinishForm(false)} className="p-2 text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={14} className="text-green-500" />
              VALOR DO CONSERTO (R$)
            </label>
            <input 
              type="number" 
              placeholder="0,00"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-black text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
              value={finalCost}
              onChange={(e) => setFinalCost(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS DO PAGAMENTO</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setPaymentStatus('pago')}
                className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                  paymentStatus === 'pago' 
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-md' 
                    : 'bg-white border-slate-100 text-slate-400'
                }`}
              >
                <CheckCircle2 size={24} className={paymentStatus === 'pago' ? 'text-green-500' : 'text-slate-200'} />
                <span className="text-[10px] font-black uppercase">Já Pago</span>
              </button>
              <button 
                onClick={() => setPaymentStatus('pendente')}
                className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                  paymentStatus === 'pendente' 
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-md' 
                    : 'bg-white border-slate-100 text-slate-400'
                }`}
              >
                <AlertCircle size={24} className={paymentStatus === 'pendente' ? 'text-amber-500' : 'text-slate-200'} />
                <span className="text-[10px] font-black uppercase">Pendente</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">RESUMO DO SERVIÇO</label>
            <textarea 
              placeholder="Ex: Troca de frontal e limpeza..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={finalSummary}
              onChange={(e) => setFinalSummary(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={handleFinish}
          disabled={!finalCost}
          className={`w-full py-5 text-white rounded-[1.5rem] font-black shadow-lg transition-all mt-6 uppercase text-sm tracking-widest ${
            !finalCost ? 'bg-slate-300 cursor-not-allowed' : (paymentStatus === 'pago' ? 'bg-green-600' : 'bg-blue-600')
          }`}
        >
          CONFIRMAR CONCLUSÃO
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="p-4 bg-white border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-800 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-slate-800 tracking-tight">#{os.osNumber}</span>
            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusBadgeStyles(os.status)} shadow-sm`}>
              {os.status}
            </span>
          </div>
          <button onClick={onBack} className="p-2 -mr-2 text-slate-300">
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col items-center justify-center pt-1">
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.15em]">
            {os.brand} {os.model} <span className="mx-2 text-slate-200">•</span> {os.customerName}
          </p>
        </div>
      </div>

      <div className="flex bg-white border-b border-slate-100 px-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 flex flex-col items-center gap-1.5 min-w-[80px] transition-all relative ${
              activeTab === tab.id 
                ? 'text-blue-600' 
                : 'text-slate-400'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-[9px] font-black tracking-widest">{tab.label}</span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-2 right-2 h-1 bg-blue-600 rounded-t-full shadow-[0_0_10px_rgba(37,99,235,0.4)]" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderTabContent()}
      </div>

      {os.status !== OSStatus.DELIVERED && (
        <div className="p-5 bg-white border-t border-slate-100 grid grid-cols-2 gap-4 pb-8">
          <button 
            onClick={handleSetPriority}
            className="py-4 bg-purple-50 text-purple-700 border border-purple-100 rounded-2xl font-black uppercase text-xs tracking-widest shadow-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Zap size={18} className="fill-purple-500" />
            PRIORIDADE
          </button>
          <button 
            onClick={() => setShowFinishForm(true)}
            className="py-4 bg-[#2563eb] text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <CheckSquare size={18} />
            FINALIZAR
          </button>
        </div>
      )}
    </div>
  );
};
