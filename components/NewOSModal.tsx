
import React, { useState, useRef, useMemo } from 'react';
import { ServiceOrder, OSStatus } from '../types.ts';
import { X, User, Smartphone, AlertCircle, Save, Hash, Camera, Trash2, Calendar, ChevronDown, Lock, Type, Grid3X3 } from 'lucide-react';
import { DEVICE_DATA, BRANDS } from '../data/deviceData.ts';
import { PatternGrid } from './PatternGrid.tsx';

interface NewOSModalProps {
  onClose: () => void;
  onSave: (os: ServiceOrder) => void;
  osNumberToUse: number;
  isDarkMode: boolean;
}

export const NewOSModal: React.FC<NewOSModalProps> = ({ onClose, onSave, osNumberToUse, isDarkMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const defaultDeadline = new Date(Date.now() + 172800000).toISOString().split('T')[0] + 'T18:00';
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhoto: '',
    deviceType: 'celular',
    brand: '',
    model: '',
    imei: '',
    reportedDefect: '',
    expectedDeliveryDate: defaultDeadline,
    password: '',
    passwordType: 'text' as 'text' | 'pattern'
  });

  const nextOSNumber = osNumberToUse.toString();
  const isFormValid = formData.customerName && formData.brand && formData.model && formData.reportedDefect;

  const handleCapturePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, customerPhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const modelsForSelectedBrand = useMemo(() => {
    if (!formData.brand) return [];
    const brandKey = Object.keys(DEVICE_DATA).find(k => k.toLowerCase() === formData.brand.toLowerCase());
    return brandKey ? DEVICE_DATA[brandKey] : [];
  }, [formData.brand]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newOS: ServiceOrder = {
      id: Date.now().toString(),
      osNumber: nextOSNumber,
      status: OSStatus.MAINTENANCE,
      ...formData,
      notes: '',
      photos: [],
      checklist: {
        powersOn: false,
        mainFunctionsTested: false,
        partReplaced: false,
        cleaned: false,
        finalApproval: false,
      },
      createdAt: new Date().toISOString()
    };

    onSave(newOS);
  };

  const labelClasses = "text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-widest";
  
  const inputClasses = `w-full px-4 py-3 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 font-bold appearance-none border ${
    isDarkMode 
      ? 'bg-slate-800 border-slate-700 text-white' 
      : 'bg-slate-50 border-slate-100 text-slate-900 shadow-sm'
  }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={`w-full max-w-md rounded-t-[2.5rem] shadow-2xl p-6 space-y-6 animate-in slide-in-from-bottom duration-500 max-h-[95vh] overflow-y-auto relative no-scrollbar transition-colors ${
        isDarkMode ? 'bg-slate-900' : 'bg-white'
      }`}>
        <div className={`flex justify-between items-center sticky top-0 pb-2 z-10 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
              isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
            }`}>
              <Hash size={20} />
            </div>
            <div>
              <h2 className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Nova OS</h2>
              <p className="text-xs text-blue-600 font-black tracking-tight">#{nextOSNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className={`p-2.5 rounded-2xl transition-colors ${
            isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
          }`}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6 pb-10">
          <div className="flex flex-col items-center py-2">
            <label className={`${labelClasses} text-center w-full mb-3`}>Foto do Cliente / Pessoa</label>
            <div className="relative group">
              <div className={`w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all group-hover:border-blue-300 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
              }`}>
                {formData.customerPhoto ? (
                  <img src={formData.customerPhoto} className="w-full h-full object-cover" alt="Cliente" />
                ) : (
                  <User size={40} className="text-slate-300" />
                )}
              </div>
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg border-2 border-white dark:border-slate-800 hover:bg-blue-700 transition-all active:scale-90"
              >
                <Camera size={16} />
              </button>
              {formData.customerPhoto && (
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, customerPhoto: ''})}
                  className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full shadow-md border border-white dark:border-slate-800 active:scale-90"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleCapturePhoto} accept="image/*" capture="user" className="hidden" />
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Cliente *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  required
                  className={`${inputClasses} pl-10`}
                  placeholder="Nome completo do cliente"
                  value={formData.customerName}
                  onChange={e => setFormData({...formData, customerName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Marca *</label>
                <div className="relative">
                  <input 
                    required
                    list="brands-list"
                    className={inputClasses}
                    placeholder="Ex: Apple"
                    value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value, model: ''})}
                  />
                  <datalist id="brands-list">
                    {BRANDS.map(brand => <option key={brand} value={brand} />)}
                  </datalist>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <ChevronDown size={14} />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Prazo de Entrega *</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="datetime-local"
                    required
                    className={`${inputClasses} pl-10`}
                    value={formData.expectedDeliveryDate}
                    onChange={e => setFormData({...formData, expectedDeliveryDate: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Modelo *</label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  required
                  list="models-list"
                  className={`${inputClasses} pl-10`}
                  placeholder={formData.brand ? "Escolha ou digite o modelo" : "Digite a marca primeiro"}
                  value={formData.model}
                  onChange={e => setFormData({...formData, model: e.target.value})}
                />
                <datalist id="models-list">
                  {modelsForSelectedBrand.map(model => <option key={model} value={model} />)}
                </datalist>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <ChevronDown size={14} />
                </div>
              </div>
            </div>

            {/* SELEÇÃO DE SENHA NA CRIAÇÃO */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <Lock size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase">Bloqueio do Aparelho</span>
              </div>
              <div className="flex gap-2 mb-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, passwordType: 'text', password: ''})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${formData.passwordType === 'text' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-400 border border-slate-100 dark:border-slate-600'}`}
                >
                  <Type size={14} /> Texto
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, passwordType: 'pattern', password: ''})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${formData.passwordType === 'pattern' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-700 text-slate-400 border border-slate-100 dark:border-slate-600'}`}
                >
                  <Grid3X3 size={14} /> Padrão
                </button>
              </div>

              {formData.passwordType === 'text' ? (
                <input 
                  className={`${inputClasses} text-center tracking-[0.2em] font-black h-14`}
                  placeholder="DIGITE A SENHA"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              ) : (
                <div className="flex justify-center py-2">
                  <PatternGrid 
                    pattern={formData.password} 
                    isEditing={true} 
                    onPatternChange={(p) => setFormData({...formData, password: p})} 
                  />
                </div>
              )}
            </div>

            <div>
              <label className={labelClasses}>Defeito Relatado *</label>
              <div className="relative">
                <AlertCircle className="absolute left-3.5 top-4 text-red-400" size={16} />
                <textarea 
                  required
                  rows={3}
                  className={`${inputClasses} pl-10 resize-none h-auto min-h-[100px] leading-relaxed`}
                  placeholder="O que o cliente relatou de problema?"
                  value={formData.reportedDefect}
                  onChange={e => setFormData({...formData, reportedDefect: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-2xl transition-all uppercase text-sm tracking-widest mt-4 ${
              isFormValid 
              ? 'bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700 active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Save size={20} />
            Gerar Ordem de Serviço
          </button>
        </form>
      </div>
    </div>
  );
};
