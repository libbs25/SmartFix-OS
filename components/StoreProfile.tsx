
import React, { useRef, useState } from 'react';
import { ArrowLeft, Moon, Sun, Globe, Bell, Shield, LogOut, ChevronRight, Store, Camera, Edit2, History, X, Hash, Save } from 'lucide-react';
import { Language, t } from '../i18n';
import { ServiceOrder, OSStatus } from '../types';
import { HistoryList } from './HistoryList';

interface StoreProfileProps {
  onBack: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  profilePhoto: string | null;
  setProfilePhoto: (photo: string | null) => void;
  storeName: string;
  setStoreName: (name: string) => void;
  onLogout: () => void;
  orders: ServiceOrder[];
  onDeleteOS: (id: string) => void;
  onSelectOS: (os: ServiceOrder) => void;
  nextOSNumber: number;
  setNextOSNumber: (num: number) => void;
}

export const StoreProfile: React.FC<StoreProfileProps> = ({ 
  onBack, 
  language, 
  setLanguage, 
  isDarkMode, 
  setIsDarkMode,
  profilePhoto,
  setProfilePhoto,
  storeName,
  setStoreName,
  onLogout,
  orders,
  onDeleteOS,
  onSelectOS,
  nextOSNumber,
  setNextOSNumber
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(storeName);
  const [view, setView] = useState<'main' | 'history'>('main');
  
  const [tempNextOS, setTempNextOS] = useState(nextOSNumber.toString());
  const [isEditingOSNum, setIsEditingOSNum] = useState(false);

  const historyOrders = orders.filter(os => os.status === OSStatus.DELIVERED);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    setStoreName(tempName || 'SmartFix Tech');
    setIsEditingName(false);
  };

  const saveNextOS = () => {
    const num = parseInt(tempNextOS);
    if (!isNaN(num) && num > 0) {
      setNextOSNumber(num);
    }
    setIsEditingOSNum(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'Português' ? 'English' : 'Português');
  };

  const menuItems = [
    { 
      id: 'history', 
      label: t(language, 'history'), 
      icon: History, 
      value: historyOrders.length.toString(), 
      onClick: () => setView('history'),
      highlight: true
    },
    { 
      id: 'lang', 
      label: t(language, 'language'), 
      icon: Globe, 
      value: language.toUpperCase(), 
      onClick: toggleLanguage 
    },
    { 
      id: 'theme', 
      label: t(language, 'darkMode'), 
      icon: isDarkMode ? Moon : Sun, 
      isToggle: true, 
      value: isDarkMode, 
      onToggle: () => setIsDarkMode(!isDarkMode) 
    },
    { 
      id: 'notif', 
      label: t(language, 'notifications'), 
      icon: Bell, 
      value: t(language, 'activated').toUpperCase() 
    },
  ];

  if (view === 'history') {
    return (
      <div className={`flex flex-col h-screen animate-in slide-in-from-right duration-300 transition-colors ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#f8fafc] text-slate-800'}`}>
        <header className={`p-6 border-b flex items-center justify-between transition-colors sticky top-0 z-10 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
          <button onClick={() => setView('main')} className={`p-2.5 rounded-2xl transition-all active:scale-95 ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h2 className="text-sm font-black uppercase tracking-widest">{t(language, 'history')}</h2>
          <div className="w-10" />
        </header>
        <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
          <HistoryList 
            orders={historyOrders} 
            onSelectOS={(os) => { onSelectOS(os); onBack(); }} 
            onDeleteOS={onDeleteOS}
          />
        </main>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen animate-in slide-in-from-left duration-300 transition-colors ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#f8fafc] text-slate-800'}`}>
      <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
      
      <header className={`p-6 border-b flex flex-col items-center transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        <div className="w-full flex justify-between items-center mb-6">
          <button onClick={onBack} className={`p-2.5 rounded-2xl transition-all active:scale-95 ${isDarkMode ? 'bg-slate-700 text-slate-200' : 'bg-slate-50 text-slate-600'}`}>
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <h2 className="text-sm font-black uppercase tracking-widest">{t(language, 'profile')}</h2>
          <div className="w-10" />
        </div>

        <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 overflow-hidden">
            {profilePhoto ? (
              <img src={profilePhoto} className="w-full h-full object-cover" alt="Perfil" />
            ) : (
              <Store size={48} strokeWidth={1.5} />
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 border-4 border-white dark:border-slate-800 rounded-full flex items-center justify-center text-white shadow-md">
            <Camera size={12} />
          </div>
        </div>

        {isEditingName ? (
          <div className="flex flex-col items-center gap-2">
            <input 
              autoFocus
              className={`text-xl font-black text-center bg-transparent border-b-2 border-blue-500 outline-none px-2 py-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
            />
            <span className="text-[10px] text-blue-500 font-bold uppercase">Pressione Enter para salvar</span>
          </div>
        ) : (
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity group"
            onClick={() => setIsEditingName(true)}
          >
            <h3 className="text-xl font-black">{storeName}</h3>
            <Edit2 size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
        <p className="text-xs text-slate-400 font-bold uppercase tracking-tight mt-1">Assistência Autorizada</p>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar">
        {/* NOVA SEÇÃO: CONFIGURAÇÃO DE OS */}
        <div className="space-y-3">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-4 mb-2">Numeração do Sistema</p>
          <div className={`rounded-[2rem] p-6 border transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg">
                  <Hash size={20} />
                </div>
                <div>
                   <p className="text-xs font-black uppercase text-slate-400">Próxima OS</p>
                   <p className="text-lg font-black text-blue-600">#{nextOSNumber}</p>
                </div>
              </div>
              {isEditingOSNum ? (
                <button onClick={saveNextOS} className="p-3 bg-green-500 text-white rounded-xl shadow-md">
                  <Save size={18} />
                </button>
              ) : (
                <button onClick={() => setIsEditingOSNum(true)} className="p-3 bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Edit2 size={18} />
                </button>
              )}
            </div>
            
            {isEditingOSNum && (
              <div className="animate-in slide-in-from-top duration-300">
                <input 
                  type="number"
                  className={`w-full p-4 rounded-xl text-lg font-black outline-none border-2 border-blue-500 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800'}`}
                  value={tempNextOS}
                  onChange={(e) => setTempNextOS(e.target.value)}
                />
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase leading-tight italic">
                  Defina o número da próxima OS que será criada. Use isso para sincronizar com seus blocos físicos.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-4 mb-2">{t(language, 'preferences')}</p>
          
          <div className={`rounded-[2rem] shadow-sm border overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'}`}>
            {menuItems.map((item, index) => (
              <div 
                key={item.id}
                onClick={item.isToggle ? undefined : item.onClick}
                className={`p-5 flex items-center justify-between transition-colors active:opacity-70 ${!item.isToggle ? 'cursor-pointer' : ''} ${index !== menuItems.length - 1 ? (isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-50') : ''} ${item.highlight ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-slate-700 text-slate-400' : (item.highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-500')}`}>
                    <item.icon size={20} />
                  </div>
                  <span className={`text-sm font-bold ${item.highlight ? 'text-blue-600 dark:text-blue-400' : ''}`}>{item.label}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.isToggle ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); item.onToggle?.(); }}
                      className={`w-12 h-6 rounded-full p-1 transition-colors relative ${item.value ? 'bg-blue-600' : 'bg-slate-400'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${item.value ? 'translate-x-6' : 'translate-x-0'} shadow-sm`} />
                    </button>
                  ) : (
                    <>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${item.highlight ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'}`}>
                        {item.value}
                      </span>
                      <ChevronRight size={16} className="text-slate-300" />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-4 mb-2">{t(language, 'account')}</p>
          <button 
            onClick={onLogout}
            className={`w-full rounded-2xl p-5 flex items-center justify-between shadow-sm border text-red-500 font-black uppercase text-xs tracking-widest active:scale-[0.98] transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-50'}`}
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <LogOut size={20} />
              </div>
              <span>{t(language, 'logout')}</span>
            </div>
            <ChevronRight size={16} />
          </button>
        </div>
      </main>

      <footer className="p-8 text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SmartFix OS v2.1.0</p>
      </footer>
    </div>
  );
};
