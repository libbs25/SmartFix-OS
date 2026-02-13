
import React, { useState } from 'react';
import { ServiceOrder, TabType, OSStatus } from '../types.ts';
import { ArrowLeft, Smartphone, MessageSquare, Camera, CheckSquare, X, DollarSign, CheckCircle2, AlertCircle, Zap, Share2 } from 'lucide-react';
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

  const shareOS = () => {
    const text = `*ORDEM DE SERVIÇO #${os.osNumber}*\n\n` +
      `*Cliente:* ${os.customerName}\n` +
      `*Aparelho:* ${os.brand} ${os.model}\n` +
      `*Defeito:* ${os.reportedDefect}\n` +
      `*Status:* ${os.status}\n\n` +
      `_Enviado via SmartFix OS_`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const getStatusBadgeStyles = (status: OSStatus) => {
    switch (status) {
      case OSStatus.MAINTENANCE: return 'bg-[#f97316] text-white';
      case OSStatus.DELIVERED: return 'bg-emerald-500 text-white';
      case OSStatus.READY: return 'bg-blue-500 text-white';
      case OSStatus.OPEN: return 'bg-purple-600 text-white';
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
              <DollarSign size={14} className="text-green-500" /> VALOR DO CONSERTO (R$)
            </label>
            <input 
              type="number" 
              placeholder="0,00"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-2xl font-black text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              value={finalCost}
              onChange={(e) => setFinalCost(e.target.value)}
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS DO PAGAMENTO</label>
            <div className="flex gap-3">
              <button onClick={() => setPaymentStatus('pago')} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${paymentStatus === 'pago' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                <CheckCircle2 size={24} /> <span className="text-[10px] font-black uppercase">PAGO</span>
              </button>
              <button onClick={() => setPaymentStatus('pendente')} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${paymentStatus === 'pendente' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                <AlertCircle size={24} /> <span className="text-[10px] font-black uppercase">PENDENTE</span>
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">RESUMO DO SERVIÇO</label>
            <textarea placeholder="O que foi consertado?" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none resize-none" value={finalSummary} onChange={(e) => setFinalSummary(e.target.value)} />
          </div>
        </div>
        <button onClick={handleFinish} disabled={!finalCost} className={`w-full py-5 text-white rounded-2xl font-black shadow-lg transition-all mt-6 uppercase text-sm tracking-widest ${!finalCost ? 'bg-slate-300' : 'bg-blue-600'}`}>CONFIRMAR</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="px-4 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onBack} className="p-1 text-slate-300">
            <ArrowLeft size={24} strokeWidth={1.5} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-800">#{os.osNumber}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getStatusBadgeStyles(os.status)}`}>
              {os.status}
            </span>
          </div>
          <button onClick={shareOS} className="p-2 bg-blue-50 text-blue-600 rounded-xl active:scale-95 transition-all">
            <Share2 size={20} />
          </button>
        </div>
        <div className="text-center">
          <p className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-widest">
            {os.brand} {os.model} <span className="mx-2 opacity-50">•</span> {os.customerName}
          </p>
        </div>
      </div>

      <div className="flex px-4 border-b border-slate-100 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
              activeTab === tab.id ? 'text-[#2563eb]' : 'text-[#a0aec0]'
            }`}
          >
            <tab.icon size={18} className={activeTab === tab.id ? "stroke-[2.5]" : "stroke-[1.5]"} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{tab.label}</span>
            {activeTab === tab.id && <div className="absolute bottom-0 left-4 right-4 h-[3px] bg-[#2563eb] rounded-t-full" />}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-[#f8fafc] no-scrollbar">
        {renderTabContent()}
      </div>

      {os.status !== OSStatus.DELIVERED && (
        <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-4 pb-8">
          <button 
            onClick={() => onUpdate({ ...os, status: OSStatus.OPEN })}
            className="py-4 bg-[#fdf2ff] text-[#7c3aed] border border-purple-100 rounded-2xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-95"
          >
            <Zap size={16} className="fill-purple-500" /> PRIORIDADE
          </button>
          <button 
            onClick={() => setShowFinishForm(true)}
            className="py-4 bg-[#2563eb] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
          >
            <CheckSquare size={16} /> FINALIZAR
          </button>
        </div>
      )}
    </div>
  );
};
