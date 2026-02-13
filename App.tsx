
import React, { useState, useEffect, useMemo } from 'react';
import { OSList } from './components/OSList';
import { OSDetail } from './components/OSDetail';
import { NewOSModal } from './components/NewOSModal';
import { StoreProfile } from './components/StoreProfile';
import { LoginScreen } from './components/LoginScreen';
import { ServiceOrder, OSStatus } from './types';
import { Language, t } from './i18n';
import { Search, Plus, LogOut, RefreshCcw, Wrench, AlertTriangle, X } from 'lucide-react';

const MOCK_DATA: ServiceOrder[] = [
  {
    id: '1',
    osNumber: '5651',
    customerName: 'Jonatas Oliveira',
    deviceType: 'celular',
    brand: 'Apple',
    model: 'iPhone 11',
    imei: '860870078592529',
    passwordType: 'text',
    reportedDefect: 'Troca de Tela 2ª Linha',
    status: OSStatus.MAINTENANCE,
    notes: '',
    photos: [],
    checklist: {
      powersOn: true,
      mainFunctionsTested: false,
      partReplaced: true,
      cleaned: true,
      finalApproval: false,
    },
    createdAt: new Date().toISOString(),
    expectedDeliveryDate: new Date(Date.now() - 3600000).toISOString(),
  }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('smartfix_auth') === 'true');
  const [orders, setOrders] = useState<ServiceOrder[]>(() => {
    const saved = localStorage.getItem('smartfix_orders');
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });
  
  const [nextOSConfig, setNextOSConfig] = useState<number>(() => {
    const saved = localStorage.getItem('smartfix_next_os');
    return saved ? parseInt(saved) : 5652;
  });

  const [selectedOS, setSelectedOS] = useState<ServiceOrder | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'Todas' | 'Em Aberto' | 'Adiantados'>('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState<{message: string, type: 'warning'} | null>(null);
  
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('smartfix_lang') as Language) || 'Português');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('smartfix_theme') === 'dark');
  const [storePhoto, setStorePhoto] = useState<string | null>(() => localStorage.getItem('smartfix_store_photo'));
  const [storeName, setStoreName] = useState<string>(() => localStorage.getItem('smartfix_store_name') || 'Jonatas');

  useEffect(() => {
    localStorage.setItem('smartfix_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('smartfix_next_os', nextOSConfig.toString());
  }, [nextOSConfig]);

  useEffect(() => {
    localStorage.setItem('smartfix_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('smartfix_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
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
    return orders.filter(o => {
      const matchesSearch = 
        o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.osNumber.includes(searchTerm) ||
        o.model.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      if (activeFilter === 'Em Aberto') return o.status === OSStatus.READY;
      if (activeFilter === 'Adiantados') return o.status === OSStatus.OPEN;
      
      // "Todas" exibe tudo exceto o que já foi entregue (Histórico)
      return o.status !== OSStatus.DELIVERED;
    });
  }, [orders, searchTerm, activeFilter]);

  const countTodas = orders.filter(o => o.status !== OSStatus.DELIVERED).length;
  const countEmAberto = orders.filter(o => o.status === OSStatus.READY).length;
  const countAdiantados = orders.filter(o => o.status === OSStatus.OPEN).length;

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
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-[200] animate-in fade-in slide-in-from-top duration-500">
          <div className="bg-amber-600 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3 border border-amber-500/50">
            <div className="bg-white/20 p-2 rounded-xl"><AlertTriangle size={20} /></div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest mb-1">Notificação</p>
              <p className="text-sm font-bold leading-tight">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/10 rounded-lg"><X size={18} /></button>
          </div>
        </div>
      )}

      {isProfileOpen ? (
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
      ) : selectedOS ? (
        <OSDetail os={selectedOS} onBack={() => setSelectedOS(null)} onUpdate={updateOS} />
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
                  <h1 className={`text-xl font-bold leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Minhas OS</h1>
                  <p className="text-xs text-slate-400 font-medium">Olá, {storeName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"><RefreshCcw size={18} /></button>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 bg-[#ef4444] text-white rounded-xl shadow-lg active:scale-95 transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              <button onClick={() => setActiveFilter('Todas')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap shadow-sm border ${activeFilter === 'Todas' ? 'bg-[#2563eb] text-white border-blue-600' : (isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-100')}`}>
                <div className={`w-2 h-2 rounded-full ${activeFilter === 'Todas' ? 'bg-white' : 'bg-blue-600'}`} />
                Todas <span className={`ml-1 text-[10px] ${activeFilter === 'Todas' ? 'text-white/80' : 'text-slate-400'}`}>{countTodas}</span>
              </button>
              <button onClick={() => setActiveFilter('Em Aberto')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap shadow-sm border ${activeFilter === 'Em Aberto' ? 'bg-[#2563eb] text-white border-blue-600' : (isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-100')}`}>
                <div className={`w-2 h-2 rounded-full ${activeFilter === 'Em Aberto' ? 'bg-white' : 'bg-blue-500'}`} />
                Em Aberto <span className={`ml-1 text-[10px] ${activeFilter === 'Em Aberto' ? 'text-white/80' : 'text-slate-400'}`}>{countEmAberto}</span>
              </button>
              <button onClick={() => setActiveFilter('Adiantados')} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all whitespace-nowrap shadow-sm border ${activeFilter === 'Adiantados' ? 'bg-[#2563eb] text-white border-blue-600' : (isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600' : 'bg-white text-slate-500 border-slate-100')}`}>
                <div className={`w-2 h-2 rounded-full ${activeFilter === 'Adiantados' ? 'bg-white' : 'bg-purple-500'}`} />
                Pré-apr <span className={`ml-1 text-[10px] ${activeFilter === 'Adiantados' ? 'text-white/80' : 'text-slate-400'}`}>{countAdiantados}</span>
              </button>
            </div>

            <div className="mt-4 relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder={t(language, 'searchPlaceholder')} 
                className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-100 text-slate-800 shadow-sm'}`} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </header>

          <main className="flex-1 p-4 space-y-4">
            <OSList orders={filteredOrders} onSelectOS={setSelectedOS} />
          </main>

          <button onClick={() => setIsCreating(true)} className="fixed bottom-8 right-6 w-14 h-14 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all z-[40]">
            <Plus size={32} strokeWidth={2.5} />
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
