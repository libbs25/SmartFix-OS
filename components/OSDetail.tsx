
import React, { useState } from 'react';
import { ServiceOrder, TabType, OSStatus } from '../types';
import { ArrowLeft, Smartphone, MessageSquare, Camera, CheckSquare, X, DollarSign, FileText, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { DeviceTab } from './tabs/DeviceTab';
import { NotesTab } from './tabs/NotesTab';
import { PhotosTab } from './tabs/PhotosTab';
import { ChecklistTab } from './tabs/ChecklistTab';

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
    { id: 'device' as TabType, label: 'Aparelho', icon: Smartphone },
    { id: 'notes' as TabType, label: 'Observações', icon: MessageSquare },
    { id: 'photos' as TabType, label: 'Fotos', icon: Camera },
    { id: 'checklist' as TabType, label: 'Checklist', icon: CheckSquare },
  ];

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
    onUpdate({
      ...os,
      status: OSStatus.OPEN
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
      <div className="flex flex-col h-screen bg-white p-6 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-800">Finalizar OS #{os.osNumber}</h2>
          <button onClick={() => setShowFinishForm(false)} className="p-2 text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <DollarSign size={14} className="text-green-500" />
              Valor Total do Conserto (R$)
            </label>
            <input 
              type="number" 
              placeholder="0,00"
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-xl font-bold text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
              value={finalCost}
              onChange={(e) => setFinalCost(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status do Pagamento</label>
            <div className="flex gap-3">
              <button 
                onClick={() => setPaymentStatus('pago')}
                className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                  paymentStatus === 'pago' 
                    ? 'bg-green-50 border-green-500 text-green-700 shadow-md' 
                    : 'bg-white border-gray-100 text-gray-400'
                }`}
              >
                <CheckCircle2 size={24} className={paymentStatus === 'pago' ? 'text-green-500' : 'text-gray-200'} />
                <span className="text-xs font-black uppercase">Pago</span>
              </button>
              <button 
                onClick={() => setPaymentStatus('pendente')}
                className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                  paymentStatus === 'pendente' 
                    ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-md' 
                    : 'bg-white border-gray-100 text-gray-400'
                }`}
              >
                <AlertCircle size={24} className={paymentStatus === 'pendente' ? 'text-amber-500' : 'text-gray-200'} />
                <span className="text-xs font-black uppercase">Não Pago</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FileText size={14} className="text-blue-500" />
              Resumo do Trabalho / Peças (Opcional)
            </label>
            <textarea 
              placeholder="Ex: Trocada tela original e bateria. Realizada limpeza preventiva."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={finalSummary}
              onChange={(e) => setFinalSummary(e.target.value)}
            />
          </div>

          <div className={`${paymentStatus === 'pago' ? 'bg-blue-50 border-blue-100 text-blue-700' : 'bg-amber-50 border-amber-100 text-amber-700'} p-4 rounded-xl border`}>
            <p className="text-xs leading-relaxed font-medium">
              {paymentStatus === 'pago' 
                ? 'Ao confirmar como PAGO, esta ordem será marcada como ENTREGUE e movida para o Histórico.'
                : 'Ao confirmar como NÃO PAGO, esta ordem ficará EM ABERTO aguardando o acerto do cliente.'}
            </p>
          </div>
        </div>

        <button 
          onClick={handleFinish}
          disabled={!finalCost}
          className={`w-full py-5 text-white rounded-[1.5rem] font-black shadow-lg transition-all mt-6 uppercase text-sm tracking-widest ${
            !finalCost ? 'bg-gray-300 cursor-not-allowed' : (paymentStatus === 'pago' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700')
          }`}
        >
          Confirmar {paymentStatus === 'pago' ? 'Entrega e Recebimento' : 'Conclusão (Pendente)'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onBack} className="p-1 -ml-1 text-gray-500 hover:text-gray-800">
            <ArrowLeft size={24} />
          </button>
          <div className="flex gap-2">
            <span className="text-lg font-bold text-gray-800">{os.osNumber}</span>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold self-center uppercase ${
              os.status === OSStatus.DELIVERED ? 'bg-green-100 text-green-600' : (os.status === OSStatus.READY ? 'bg-amber-100 text-amber-600' : (os.status === OSStatus.OPEN ? 'bg-blue-600 text-white' : 'bg-orange-100 text-orange-600'))
            }`}>
              {os.status === OSStatus.OPEN ? 'Adiantado' : os.status}
            </span>
          </div>
          <button onClick={onBack} className="p-1 -mr-1 text-gray-400">
            <X size={24} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs text-gray-400 font-medium">
            {os.brand} {os.model} • {os.customerName}
          </p>
          {os.paymentStatus && (
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${os.paymentStatus === 'pago' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {os.paymentStatus}
            </span>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-100 bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 transition-all ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                : 'text-gray-400'
            }`}
          >
            <tab.icon size={18} />
            <span className="text-[10px] font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {renderTabContent()}
      </div>

      {os.status !== OSStatus.DELIVERED && (
        <div className="p-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-3">
          {os.status !== OSStatus.OPEN && (
            <button 
              onClick={handleSetPriority}
              className="py-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold shadow-sm hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
            >
              <Zap size={20} className="fill-amber-500" />
              Adiantar
            </button>
          )}
          <button 
            onClick={() => setShowFinishForm(true)}
            className={`${os.status === OSStatus.OPEN ? 'col-span-2' : 'col-span-1'} py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2`}
          >
            <CheckSquare size={20} />
            Finalizar
          </button>
        </div>
      )}
      
      {os.status === OSStatus.DELIVERED && os.cost && (
        <div className="p-4 bg-green-50 border-t border-green-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-green-700">
            <DollarSign size={20} />
            <span className="font-bold">Conserto Finalizado e Pago</span>
          </div>
          <span className="text-xl font-black text-green-800">R$ {os.cost.toFixed(2)}</span>
        </div>
      )}

      {os.status === OSStatus.READY && os.paymentStatus === 'pendente' && (
        <div className="p-4 bg-amber-50 border-t border-amber-100 flex justify-between items-center">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle size={20} />
            <span className="font-bold">Aguardando Pagamento</span>
          </div>
          <button 
            onClick={() => setShowFinishForm(true)}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-xs font-black uppercase shadow-sm"
          >
            Receber R$ {os.cost?.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
};
