
import React, { useState } from 'react';
import { ServiceOrder } from '../../types.ts';
import { Smartphone, Lock, Edit3, X, Type, Grid3X3, Check } from 'lucide-react';
import { PatternGrid } from '../PatternGrid.tsx';

interface DeviceTabProps {
  os: ServiceOrder;
  onUpdate: (updatedFields: Partial<ServiceOrder>) => void;
}

export const DeviceTab: React.FC<DeviceTabProps> = ({ os, onUpdate }) => {
  const [editingField, setEditingField] = useState<'none' | 'info' | 'password' | 'defect'>('none');
  const [formData, setFormData] = useState({
    deviceType: os.deviceType,
    brand: os.brand,
    model: os.model,
    imei: os.imei,
    password: os.password || '',
    passwordType: os.passwordType || 'text',
    reportedDefect: os.reportedDefect
  });

  const handleSave = () => {
    onUpdate(formData);
    setEditingField('none');
  };

  const handleCancel = () => {
    setFormData({
      deviceType: os.deviceType,
      brand: os.brand,
      model: os.model,
      imei: os.imei,
      password: os.password || '',
      passwordType: os.passwordType || 'text',
      reportedDefect: os.reportedDefect
    });
    setEditingField('none');
  };

  const labelClasses = "text-[10px] font-bold text-[#a0aec0] uppercase tracking-wider mb-1";
  const valueClasses = "text-[13px] font-bold text-slate-800";

  return (
    <div className="p-4 space-y-4 pb-24">
      
      {/* SEÇÃO DISPOSITIVO */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
            <Smartphone size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Dispositivo</h3>
        </div>

        <div className="grid grid-cols-2 gap-y-6">
          <div>
            <p className={labelClasses}>TIPO</p>
            <p className={valueClasses}>{os.deviceType || 'celular'}</p>
          </div>
          <div>
            <p className={labelClasses}>MARCA</p>
            <p className={valueClasses}>{os.brand}</p>
          </div>
          <div>
            <p className={labelClasses}>MODELO</p>
            <p className={valueClasses}>{os.model}</p>
          </div>
          <div>
            <p className={labelClasses}>IMEI/SERIAL</p>
            <p className={valueClasses}>{os.imei || '---'}</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO SENHA EM CAIXA CINZA */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <Lock size={16} />
             </div>
             <p className={labelClasses}>SENHA</p>
          </div>
          {editingField !== 'password' ? (
            <button onClick={() => setEditingField('password')} className="p-1.5 text-blue-500"><Edit3 size={16} /></button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-2 text-slate-300"><X size={20} /></button>
              <button onClick={handleSave} className="px-4 py-1.5 bg-[#2563eb] text-white rounded-xl font-bold text-[10px] uppercase shadow-md active:scale-95">OK</button>
            </div>
          )}
        </div>

        {editingField === 'password' ? (
          <div className="animate-in slide-in-from-top duration-300">
            <div className="flex gap-2 mb-6 p-1 bg-slate-50 rounded-xl">
              <button onClick={() => setFormData({...formData, passwordType: 'text', password: ''})} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all ${formData.passwordType === 'text' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                Letras/Números
              </button>
              <button onClick={() => setFormData({...formData, passwordType: 'pattern', password: ''})} className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-2 transition-all ${formData.passwordType === 'pattern' ? 'bg-[#2563eb] text-white shadow-md' : 'text-slate-400'}`}>
                Desenho
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center py-4">
              {formData.passwordType === 'text' ? (
                <input type="text" className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 text-center text-3xl font-black text-blue-600 tracking-[0.2em] outline-none" value={formData.password} autoFocus onChange={(e) => setFormData({...formData, password: e.target.value})} />
              ) : (
                <div className="p-4 bg-blue-50/20 rounded-3xl border-2 border-dashed border-blue-100">
                  <PatternGrid pattern={formData.password} isEditing={true} onPatternChange={(p) => setFormData({...formData, password: p})} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-[#f1f5f9] p-5 rounded-2xl mt-1 min-h-[60px] flex items-center justify-center">
             {os.passwordType === 'pattern' ? (
               <div className="scale-75 origin-center">
                 <PatternGrid pattern={os.password || ''} isEditing={false} />
               </div>
             ) : (
               <p className="text-2xl font-bold text-slate-600 tracking-wider text-center">{os.password || 'Sem senha'}</p>
             )}
          </div>
        )}
      </section>

      {/* SEÇÃO DEFEITO EM CAIXA ROSA */}
      <section className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700">Defeito Relatado</h3>
          {editingField !== 'defect' ? (
            <button onClick={() => setEditingField('defect')} className="p-1.5 text-slate-300"><Edit3 size={16} /></button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-1.5 text-slate-400"><X size={20} /></button>
              <button onClick={handleSave} className="p-1.5 text-green-600"><Check size={20} /></button>
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-2xl border transition-all ${editingField === 'defect' ? 'bg-white border-blue-200' : 'bg-[#fff1f2] border-[#fecdd3]'}`}>
          {editingField === 'defect' ? (
            <textarea className="w-full bg-transparent border-none text-[13px] font-bold text-[#be123c] outline-none resize-none min-h-[60px]" value={formData.reportedDefect} onChange={(e) => setFormData({...formData, reportedDefect: e.target.value})} autoFocus />
          ) : (
            <p className="text-[13px] font-bold text-[#be123c] leading-relaxed">
              {os.reportedDefect}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
