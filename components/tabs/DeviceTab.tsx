
import React, { useState, useMemo } from 'react';
import { ServiceOrder } from '../../types.ts';
import { Smartphone, Lock, AlertTriangle, Edit3, Save, X, KeyRound, Type, Grid3X3, Check } from 'lucide-react';
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

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-full animate-in fade-in duration-300 pb-32">
      
      {/* SEÇÃO DA SENHA - IGUAL AO PRINT */}
      <section className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-slate-700">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Lock size={18} />
            </div>
            <h3 className="font-bold text-sm">Bloqueio do Aparelho</h3>
          </div>
          {editingField !== 'password' ? (
            <button 
              onClick={() => setEditingField('password')} 
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black border border-blue-100 uppercase tracking-widest shadow-sm"
            >
              Alterar
            </button>
          ) : (
            <div className="flex gap-2 items-center">
              <button onClick={handleCancel} className="p-2 text-slate-400"><X size={20} /></button>
              <button 
                onClick={handleSave} 
                className="px-6 py-2 bg-[#2563eb] text-white rounded-xl font-black text-xs uppercase shadow-md shadow-blue-200 active:scale-95 transition-all"
              >
                OK
              </button>
            </div>
          )}
        </div>

        {editingField === 'password' && (
          <div className="flex gap-2 mb-8 p-1 bg-slate-50 rounded-2xl border border-slate-100">
            <button 
              onClick={() => setFormData({...formData, passwordType: 'text', password: ''})}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${formData.passwordType === 'text' ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400'}`}
            >
              <Type size={14} /> Letras/Números
            </button>
            <button 
              onClick={() => setFormData({...formData, passwordType: 'pattern', password: ''})}
              className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all ${formData.passwordType === 'pattern' ? 'bg-[#2563eb] text-white shadow-md' : 'text-slate-400'}`}
            >
              <Grid3X3 size={14} /> Desenho
            </button>
          </div>
        )}

        <div className="relative min-h-[250px] flex flex-col items-center justify-center py-4">
          {formData.passwordType === 'text' ? (
            editingField === 'password' ? (
              <input 
                type="text"
                className="w-full max-w-[240px] bg-slate-50 p-5 rounded-2xl border-2 border-blue-100 text-center text-4xl font-black text-blue-600 tracking-[0.3em] outline-none shadow-inner uppercase"
                value={formData.password}
                placeholder="----"
                autoFocus
                onChange={(e) => setFormData({...formData, password: e.target.value.toUpperCase()})}
              />
            ) : (
              <p className="text-[2.75rem] font-black text-[#2563eb] tracking-[0.25em] uppercase text-center w-full break-all leading-tight">
                {os.password ? os.password : '---'}
              </p>
            )
          ) : (
            <PatternGrid 
              pattern={editingField === 'password' ? formData.password : (os.password || '')} 
              isEditing={editingField === 'password'}
              onPatternChange={(newPattern) => setFormData({...formData, password: newPattern})}
            />
          )}
        </div>
      </section>

      {/* DEFEITO RELATADO */}
      <section className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-500">
            <div className="p-1.5 bg-red-50 rounded-lg">
              <AlertTriangle size={16} />
            </div>
            <h3 className="font-bold text-sm">Defeito Relatado</h3>
          </div>
          {editingField !== 'defect' ? (
            <button onClick={() => setEditingField('defect')} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
              <Edit3 size={18} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-1.5 text-slate-400"><X size={20} /></button>
              <button onClick={handleSave} className="p-1.5 text-green-600"><Check size={20} /></button>
            </div>
          )}
        </div>
        
        <div className={`p-5 rounded-2xl border transition-all ${editingField === 'defect' ? 'bg-white border-red-200 ring-4 ring-red-50' : 'bg-red-50/40 border-red-100/50'}`}>
          {editingField === 'defect' ? (
            <textarea 
              className="w-full bg-transparent border-none text-base font-black text-red-700 outline-none resize-none min-h-[80px]"
              value={formData.reportedDefect}
              onChange={(e) => setFormData({...formData, reportedDefect: e.target.value})}
              autoFocus
            />
          ) : (
            <p className="text-base font-black text-red-700 leading-relaxed italic text-center">
              "{os.reportedDefect}"
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
