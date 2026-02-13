
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Wrench, ArrowRight, Store, ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react';
import { Language, t } from '../i18n';

interface LoginScreenProps {
  onLogin: () => void;
  language: Language;
  isDarkMode: boolean;
  storeName: string;
  storePhoto: string | null;
}

type LoginView = 'login' | 'register' | 'verify';

export const LoginScreen: React.FC<LoginScreenProps> = ({ 
  onLogin, 
  language, 
  isDarkMode,
  storeName,
  storePhoto
}) => {
  const [view, setView] = useState<LoginView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newStoreName, setNewStoreName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval: number | undefined;
    if (view === 'verify' && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (!validateEmail(email)) {
      setErrorMessage(t(language, 'invalidEmail'));
      setError(true);
      return;
    }

    if (password.length < 4) {
      setErrorMessage(t(language, 'loginError'));
      setError(true);
      return;
    }

    if (newStoreName.length < 3) {
      setErrorMessage(t(language, 'loginError'));
      setError(true);
      return;
    }

    // Após cadastro, vai para verificação
    setView('verify');
    setTimer(60);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (!validateEmail(email) || password.length < 4) {
      setErrorMessage(t(language, 'loginError'));
      setError(true);
      return;
    }

    onLogin();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (verificationCode.length !== 6) {
      setErrorMessage(t(language, 'codeError'));
      setError(true);
      return;
    }

    // Simulação de verificação bem-sucedida
    onLogin();
  };

  const inputClasses = `w-full pl-12 pr-4 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 font-medium border ${
    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
  }`;

  const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4";

  if (view === 'verify') {
    return (
      <div className={`flex flex-col min-h-screen p-8 justify-center animate-in slide-in-from-right duration-500 transition-colors ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#f8fafc] text-slate-800'
      }`}>
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200">
              <ShieldCheck size={40} strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter mb-2">
                {t(language, 'verifyEmailTitle')}
              </h1>
              <p className="text-sm text-slate-400 font-medium px-4">
                {t(language, 'verifyEmailSubtitle')} <span className="text-blue-600 font-bold">{email}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-1.5">
              <label className={labelClasses}>
                {t(language, 'verifyCodeLabel')}
              </label>
              <input 
                type="text"
                maxLength={6}
                required
                autoFocus
                className={`${inputClasses} pl-4 text-center text-3xl tracking-[0.5em] font-black`}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 animate-in shake duration-300">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase text-sm tracking-widest"
            >
              {t(language, 'confirmCode')}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="pt-4 flex flex-col items-center gap-4">
            <button 
              disabled={timer > 0}
              onClick={() => setTimer(60)}
              className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${
                timer > 0 ? 'text-slate-300' : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              <RefreshCw size={14} className={timer > 0 ? '' : 'animate-spin-slow'} />
              {timer > 0 ? `${t(language, 'resendCode')} ${timer}s` : t(language, 'resendCode').replace(' em', '')}
            </button>
            
            <button 
              onClick={() => setView('register')}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              <ArrowLeft size={14} /> Corrigir e-mail
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen p-8 justify-center animate-in fade-in duration-700 transition-colors ${
      isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#f8fafc] text-slate-800'
    }`}>
      <div className="w-full max-w-sm mx-auto space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-200 overflow-hidden transition-transform hover:scale-105">
            {storePhoto && view === 'login' ? (
              <img src={storePhoto} className="w-full h-full object-cover" alt="Logo" />
            ) : (
              <Wrench size={40} strokeWidth={2} />
            )}
          </div>
          <div className="animate-in slide-in-from-top duration-500">
            <h1 className="text-3xl font-black tracking-tighter mb-2">
              {view === 'register' ? t(language, 'createAccountTitle') : (storePhoto ? storeName : 'SmartFix OS')}
            </h1>
            <p className="text-sm text-slate-400 font-medium px-4">
              {view === 'register' ? t(language, 'createAccountSubtitle') : t(language, 'loginSubtitle')}
            </p>
          </div>
        </div>

        <form onSubmit={view === 'register' ? handleRegister : handleLogin} className="space-y-4">
          {view === 'register' && (
            <div className="space-y-1.5 animate-in slide-in-from-left duration-300">
              <label className={labelClasses}>
                {t(language, 'storeNameLabel')}
              </label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text"
                  required
                  className={inputClasses}
                  placeholder="Nome da sua assistência"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 animate-in slide-in-from-left duration-400">
            <label className={labelClasses}>
              {t(language, 'emailLabel')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email"
                required
                className={inputClasses}
                placeholder="exemplo@loja.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 animate-in slide-in-from-left duration-500">
            <label className={labelClasses}>
              {t(language, 'passwordLabel')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password"
                required
                className={inputClasses}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {view === 'login' && (
            <div className="flex justify-end pr-2">
              <button type="button" className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline transition-all">
                {t(language, 'forgotPassword')}
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 animate-in shake duration-300">
              {errorMessage}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-2xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all uppercase text-sm tracking-widest mt-4"
          >
            {view === 'register' ? t(language, 'registerBtn') : t(language, 'signIn')}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="pt-4 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">
              {view === 'register' ? t(language, 'alreadyHaveAccount') : t(language, 'noAccount')}
            </span>
            <button 
              onClick={() => {
                setView(view === 'login' ? 'register' : 'login');
                setError(false);
              }}
              className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
            >
              {view === 'register' ? t(language, 'signIn') : t(language, 'signUp')}
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            SmartFix OS v2.1.2 • Powered by Tech
          </p>
        </div>
      </div>
    </div>
  );
};
