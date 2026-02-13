
import React, { useState, useEffect, useMemo } from 'react';
import { OSList } from './components/OSList.tsx';
import { OSDetail } from './components/OSDetail.tsx';
import { NewOSModal } from './components/NewOSModal.tsx';
import { StoreProfile } from './components/StoreProfile.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';
import { ServiceOrder, OSStatus } from './types.ts';
import { Language, t } from './i18n.ts';
import { Search, Plus, LogOut, RefreshCcw, Wrench } from 'lucide-react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('smartfix_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [orders, setOrders] = useState<ServiceOrder[]>(() => {
    try {
      const saved = localStorage.getItem('smartfix_orders');
      if (!saved) return [];
      return JSON.parse(saved);
    } catch (e) {
      console.error("Erro ao carregar ordens:", e);
      return [];
    }
  });
  
  const [nextOSConfig, setNextOSConfig] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('smartfix_next_os');
      return saved ? parseInt(saved, 10) : 5652;
    } catch {
      return 5652;
    }
  });

  const [selectedOS, setSelectedOS] = useState<ServiceOrder | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'Todas' | 'Em Aberto' | 'Adiantados'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('smartfix_lang') as Language;
      return (saved === 'Português' || saved === 'English') ? saved : 'Português';
    } catch {
      return 'Português';
    }
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('smartfix_theme') === 'dark';
    } catch {
      return false;
    }
  });

  const [storePhoto, setStorePhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('smartfix_store_photo');
    } catch {
      return null;
    }
  });

  const [storeName, setStoreName] = useState<string>(() => {
    try {
      return localStorage.getItem('smartfix_store_name') || 'SmartFix Tech';
    } catch {
      return 'SmartFix Tech';
    }
  });

  useEffect(() => {
    localStorage.setItem('smartfix_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('smartfix_next_os', nextOSConfig.toString());
  }, [nextOSConfig]);

  useEffect(() => {
    localStorage.setItem('smartfix_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('smartfix_lang', language);
  }, [language]);

  const handleLogin = (name?: string) => {
    if (name) {
      setStoreName(name);
      localStorage.setItem('smartfix_store_name', name);
    }
    setIsLoggedIn(true);
    localStorage.setItem('smartfix_auth', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('smartfix_auth');
    setIsProfileOpen(false);
  };

  const updateOS = (updatedOS: ServiceOrder) => {
    setOrders(prev => prev.map(os => os.id === updatedOS.id ? updatedOS : os));
    setSelectedOS(updatedOS);
  };

  const deleteOS = (id: string) => {
    setOrders(prev => prev.filter(os => os.id !== id));
  };

  const handleCreateNewOS = (newOS: ServiceOrder) => {
    setOrders(prev => [newOS, ...prev]);
    setNextOSConfig(prev => prev + 1);
    setIsCreating(false);
    setSelectedOS(newOS);
  };

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return [];
    return orders.filter(o => {
      const matchesSearch = 
        (o.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.osNumber || '').includes(searchTerm) ||
        (o.model || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (activeFilter === 'Em Aberto') return o.status === OSStatus.READY;
      if (activeFilter === 'Adiantados') return o.status === OSStatus.OPEN;
      
      return o.status !== OSStatus.DELIVERED;
    });
  }, [orders, searchTerm, activeFilter]);

  const counts = useMemo(() => ({
    todas: orders.filter(o => o.status !== OSStatus.DELIVERED).length,
    aberto: orders.filter(o => o.status === OSStatus.READY).length,
    adiantados: orders.filter(o => o.status === OSStatus.OPEN).length
  }), [orders]);

  if (!isLoggedIn) {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        language={language}
        isDarkMode={isDarkMode}
        storeName={storeName}
        storePhoto={storePhoto}
      />
    );
  }

  return (
    <div className={`max-w-md mx-auto min-h-screen flex flex-col shadow-2xl overflow-hidden font-sans relative transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-[#f1f5f9]'}`}>
      {selectedOS ? (
        <OSDetail os={selectedOS} onBack={() => setSelectedOS(null)} onUpdate={updateOS} />
      ) : isProfileOpen ? (
        <StoreProfile 
          onBack={() => setIsProfileOpen(false)} 
          language={language} 
          setLanguage={setLanguage}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          profilePhoto={storePhoto}
          setProfilePhoto={setStorePhoto}
          storeName={storeName}
          setStoreName={setStoreName}
          onLogout={handleLogout}
          orders={orders}
          onDeleteOS={deleteOS}
          onSelectOS={setSelectedOS}
          nextOSNumber={nextOSConfig}
          setNextOSNumber={setNextOSConfig}
        />
      ) : (
        <>
          <header className={`p-4 sticky top-0 z-20 transition-colors ${isDarkMode ? 'bg-slate-800 border-b border-slate-700 shadow-sm' : 'bg-[#f1f5f9]'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsProfileOpen(true)} 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                    isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <Wrench size={20} />
                </button>
                <div>
                  <h1 className={`text-xl font-black leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>SmartFix</h1>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{storeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.location.reload()}
                  className="p-2.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  <RefreshCcw size={18} />
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 bg-red-500 text-white rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              <button onClick={() => setActiveFilter('Todas')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black transition-all whitespace-nowrap shadow-sm border ${activeFilter === 'Todas' ? 'bg-[#2563eb] text-white border-blue-600' : (isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-100')}`}>
                Todas <span className={`ml-1 ${activeFilter === 'Todas' ? 'text-white/80' : 'text-slate-400'}`}>{counts.todas}</span>
              </button>
              <button onClick={() => setActiveFilter('Em Aberto')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black transition-all whitespace-nowrap shadow-sm border ${activeFilter === 'Em Aberto' ? 'bg-[#2563eb] text-white border-blue-600' : (isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-100')}`}>
                Em Aberto <span className={`ml-1 ${activeFilter === 'Em Aberto' ? 'text-white/80' : 'text-slate-400'}`}>{counts.aberto}</span>
              </button>
              <button onClick={() => setActiveFilter('Adiantados')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black transition-all whitespace-nowrap shadow-sm border ${activeFilter === 'Adiantados' ? 'bg-[#2563eb] text-white border-blue-600' : (isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-100')}`}>
                Adiantados <span className={`ml-1 ${activeFilter === 'Adiantados' ? 'text-white/80' : 'text-slate-400'}`}>{counts.adiantados}</span>
              </button>
            </div>

            <div className="mt-4 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar por OS, cliente ou aparelho..." 
                className={`w-full pl-10 pr-4 py-3.5 rounded-2xl text-sm outline-none transition-all placeholder:text-slate-400 font-bold border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-100 text-slate-800 shadow-sm'}`} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </header>

          <main className="flex-1 p-4 space-y-4">
            <OSList orders={filteredOrders} onSelectOS={setSelectedOS} />
          </main>

          <button onClick={() => setIsCreating(true)} className="fixed bottom-8 right-6 w-16 h-16 bg-blue-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all z-[40]">
            <Plus size={36} strokeWidth={3} />
          </button>
        </>
      )}

      {isCreating && (
        <NewOSModal 
          onClose={() => setIsCreating(false)} 
          onSave={handleCreateNewOS} 
          osNumberToUse={nextOSConfig} 
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default App;
