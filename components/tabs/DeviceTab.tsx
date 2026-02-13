
import React, { useState, useMemo } from 'react';
import { ServiceOrder } from '../../types';
import { Smartphone, Lock, AlertTriangle, Edit3, Save, X, Type, Grid3X3, KeyRound, Info, User, ChevronDown } from 'lucide-react';
import { PatternGrid } from '../PatternGrid';
import { DEVICE_DATA, BRANDS } from '../../data/deviceData';

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

  const modelsForSelectedBrand = useMemo(() => {
    if (!formData.brand) return [];
    const brandKey = Object.keys(DEVICE_DATA).find(k => k.toLowerCase() === formData.brand.toLowerCase());
    return brandKey ? DEVICE_DATA[brandKey] : [];
  }, [formData.brand]);

  const inputClasses = "w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all appearance-none";
  const labelClasses = "text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-wider";

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-full animate-in fade-in duration-300 pb-20">
      
      {/* SEÇÃO DO CLIENTE */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
          {os.customerPhoto ? (
            <img src={os.customerPhoto} className="w-full h-full object-cover" alt="Cliente" />
          ) : (
            <User className="text-slate-200" size={32} />
          )}
        </div>
        <div>
          <label className={labelClasses}>Cliente Responsável</label>
          <p className="text-base font-black text-slate-800">{os.customerName}</p>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tight">Identificado via foto</p>
        </div>
      </section>

      {/* SEÇÃO INFORMAÇÕES DO APARELHO */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Smartphone size={18} className="text-blue-500" />
            <h3 className="font-bold text-sm">Dispositivo</h3>
          </div>
          {editingField !== 'info' ? (
            <button onClick={() => setEditingField('info')} className="text-blue-600 p-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <Edit3 size={18} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl"><X size={20} /></button>
              <button onClick={handleSave} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"><Save size={20} /></button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Tipo</label>
            {editingField === 'info' ? (
              <input className={inputClasses} value={formData.deviceType} onChange={(e) => setFormData({...formData, deviceType: e.target.value})} />
            ) : (
              <p className="text-sm font-semibold text-slate-800 capitalize">{os.deviceType}</p>
            )}
          </div>
          <div>
            <label className={labelClasses}>Marca</label>
            {editingField === 'info' ? (
              <div className="relative">
                <input 
                  list="edit-brands-list"
                  className={inputClasses} 
                  value={formData.brand} 
                  onChange={(e) => setFormData({...formData, brand: e.target.value, model: ''})} 
                />
                <datalist id="edit-brands-list">
                  {BRANDS.map(brand => <option key={brand} value={brand} />)}
                </datalist>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <ChevronDown size={14} />
                </div>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-800">{os.brand}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className={labelClasses}>Modelo</label>
            {editingField === 'info' ? (
              <div className="relative">
                <input 
                  list="edit-models-list"
                  className={inputClasses} 
                  value={formData.model} 
                  onChange={(e) => setFormData({...formData, model: e.target.value})} 
                />
                <datalist id="edit-models-list">
                  {modelsForSelectedBrand.map(model => <option key={model} value={model} />)}
                </datalist>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <ChevronDown size={14} />
                </div>
              </div>
            ) : (
              <p className="text-base font-bold text-slate-900">{os.model}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className={labelClasses}>IMEI / Serial</label>
            {editingField === 'info' ? (
              <input className={inputClasses} value={formData.imei} onChange={(e) => setFormData({...formData, imei: e.target.value})} />
            ) : (
              <p className="text-sm font-medium text-slate-500 font-mono tracking-tight">{os.imei}</p>
            )}
          </div>
        </div>
      </section>

      {/* SEÇÃO DA SENHA - ATUALIZADA */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-700">
            <Lock size={18} className="text-slate-400" />
            <h3 className="font-bold text-sm">Senha do Cliente</h3>
          </div>
          {editingField !== 'password' ? (
            <button onClick={() => setEditingField('password')} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all shadow-sm border border-slate-200">
              <KeyRound size={14} className="text-blue-500" />
              Editar Senha
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-2 text-slate-400"><X size={20} /></button>
              <button onClick={handleSave} className="px-4 py-1.5 bg-blue-600 text-white rounded-xl font-bold text-xs uppercase shadow-md hover:bg-blue-700 transition-all">Salvar</button>
            </div>
          )}
        </div>

        {editingField === 'password' && (
          <div className="mb-6 animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 justify-center">
              <Info size={12} /> Escolha o tipo de bloqueio
            </div>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setFormData({...formData, passwordType: 'text', password: ''})}
                className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all border-2 ${
                  formData.passwordType === 'text' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
                    : 'bg-white border-slate-100 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-full ${formData.passwordType === 'text' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}>
                   <Type size={20} />
                </div>
                <span className="text-[11px] font-black uppercase">Texto / PIN</span>
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, passwordType: 'pattern', password: ''})}
                className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-2xl transition-all border-2 ${
                  formData.passwordType === 'pattern' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md' 
                    : 'bg-white border-slate-100 text-slate-400'
                }`}
              >
                <div className={`p-2 rounded-full ${formData.passwordType === 'pattern' ? 'bg-blue-500 text-white' : 'bg-slate-100'}`}>
                  <Grid3X3 size={20} />
                </div>
                <span className="text-[11px] font-black uppercase">Desenho Padrão</span>
              </button>
            </div>
          </div>
        )}

        <div className={`relative p-8 rounded-2xl min-h-[160px] flex flex-col items-center justify-center transition-all duration-300 ${
          editingField === 'password' ? 'bg-blue-50/50 border-2 border-dashed border-blue-200' : 'bg-slate-50 border border-slate-100'
        }`}>
          {formData.passwordType === 'text' ? (
            editingField === 'password' ? (
              <div className="w-full max-w-[240px]">
                <input 
                  className="w-full bg-white p-4 rounded-xl border border-blue-200 text-center text-3xl font-black text-slate-800 tracking-[0.3em] outline-none shadow-inner"
                  value={formData.password}
                  placeholder="----"
                  autoFocus
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            ) : (
              <p className="text-3xl font-black text-slate-700 tracking-[0.4em]">{os.password || '---'}</p>
            )
          ) : (
            <div className="py-2">
              <PatternGrid 
                pattern={editingField === 'password' ? formData.password : (os.password || '')} 
                isEditing={editingField === 'password'}
                onPatternChange={(newPattern) => setFormData({...formData, password: newPattern})}
              />
            </div>
          )}
          
          {!editingField && !os.password && (
            <p className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-tighter">Nenhuma senha cadastrada</p>
          )}
        </div>
      </section>

      {/* DEFEITO RELATADO */}
      <section className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle size={18} />
            <h3 className="font-bold text-sm">Defeito Relatado</h3>
          </div>
          {editingField !== 'defect' ? (
            <button onClick={() => setEditingField('defect')} className="text-red-600 p-2 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
              <Edit3 size={18} />
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleCancel} className="p-2 text-slate-400"><X size={20} /></button>
              <button onClick={handleSave} className="p-2 text-red-600"><Save size={20} /></button>
            </div>
          )}
        </div>
        
        <div className={`p-4 rounded-xl border transition-all ${editingField === 'defect' ? 'bg-white border-red-200 ring-4 ring-red-50' : 'bg-red-50/50 border-red-100'}`}>
          {editingField === 'defect' ? (
            <textarea 
              className="w-full bg-transparent border-none text-base font-bold text-red-800 outline-none resize-none min-h-[100px]"
              value={formData.reportedDefect}
              onChange={(e) => setFormData({...formData, reportedDefect: e.target.value})}
              placeholder="Descreva detalhadamente o problema relatado pelo cliente..."
            />
          ) : (
            <p className="text-base font-bold text-red-800 leading-relaxed italic">
              "{os.reportedDefect}"
            </p>
          )}
        </div>
      </section>
    </div>
  );
};
