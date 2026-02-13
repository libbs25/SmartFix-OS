
import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, Wrench, ArrowRight, Store, ShieldCheck, RefreshCw, ArrowLeft, MessageCircle, AlertCircle, CheckCircle2, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { Language, t } from '../i18n';

interface LoginScreenProps {
  onLogin: (name?: string) => void;
  language: Language;
  isDarkMode: boolean;
  storeName: string;
  storePhoto: string | null;
}

type LoginView = 'login' | 'register' | 'verify' | 'google_select' | 'google_authenticating';

const ADMIN_EMAIL = 'admin@smartfix.com';
const ADMIN_PASSWORD = 'admin';
const VALID_VERIFY_CODE = '123456';

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
  const [showPassword, setShowPassword] = useState(false);
  const [newStoreName, setNewStoreName] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);
  const [isSending, setIsSending] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authStep, setAuthStep] = useState<'initial' | 'scanning' | 'completing'>('initial');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let interval: number | undefined;
    if (view === 'verify' && timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [view, timer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsSending(true);

    // Simulação de delay de rede para feedback visual
    setTimeout(() => {
      const savedAccountsRaw = localStorage.getItem('smartfix_accounts');
      const savedAccounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
      const accountFound = savedAccounts.find((acc: any) => acc.email === email && acc.password === password);

      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        onLogin();
      } else if (accountFound) {
        onLogin(accountFound.storeName);
      } else {
        setErrorMessage(t(language, 'loginError'));
        setError(true);
        setIsSending(false);
      }
    }, 1500);
  };

  // Add handleRegister function to fix the error "Cannot find name 'handleRegister'"
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setIsSending(true);

    // Simulação de delay de rede para envio de código de verificação
    setTimeout(() => {
      setIsSending(false);
      setView('verify');
      setTimer(60);
    }, 1500);
  };

  const handleGoogleLoginTrigger = () => {
    setIsGoogleLoading(true);
    setAuthStep('scanning');
    setView('google_authenticating');
    
    setTimeout(() => {
      setIsGoogleLoading(false);
      setView('google_select');
    }, 2000);
  };

  const handleSelectGoogleAccount = (name: string, email: string) => {
    setIsGoogleLoading(true);
    setAuthStep('completing');
    setView('google_authenticating');

    setTimeout(() => {
      const savedAccountsRaw = localStorage.getItem('smartfix_accounts');
      const savedAccounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
      
      if (!savedAccounts.find((acc: any) => acc.email === email)) {
        savedAccounts.push({ email, storeName: name, password: 'google_auth' });
        localStorage.setItem('smartfix_accounts', JSON.stringify(savedAccounts));
      }

      onLogin(name);
    }, 2500);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...verificationCode];
    newCode[index] = value.slice(-1);
    setVerificationCode(newCode);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const verifyCode = () => {
    const codeStr = verificationCode.join('');
    if (codeStr === VALID_VERIFY_CODE) {
      const savedAccountsRaw = localStorage.getItem('smartfix_accounts');
      const savedAccounts = savedAccountsRaw ? JSON.parse(savedAccountsRaw) : [];
      savedAccounts.push({ email, password, storeName: newStoreName });
      localStorage.setItem('smartfix_accounts', JSON.stringify(savedAccounts));
      onLogin(newStoreName);
    } else {
      setErrorMessage(t(language, 'codeError'));
      setError(true);
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  useEffect(() => {
    if (verificationCode.every(v => v !== '')) verifyCode();
  }, [verificationCode]);

  const inputClasses = `w-full pl-12 pr-12 py-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-300 font-medium border ${
    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
  }`;

  const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4";

  if (view === 'google_authenticating') {
    return (
      <div className={`flex flex-col min-h-screen p-8 justify-center items-center text-center animate-in fade-in duration-500 transition-colors ${
        isDarkMode ? 'bg-slate-900' : 'bg-[#f8fafc]'
      }`}>
        <div className="w-full max-sm space-y-8">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl overflow-hidden">
              <Fingerprint size={64} strokeWidth={1.5} className="relative z-10" />
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-300 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_15px_rgba(147,197,253,1)]"></div>
            </div>
            <div className="absolute -inset-4 border-2 border-blue-500/20 rounded-[3rem] animate-[ping_3s_linear_infinite]"></div>
          </div>
          
          <div className="space-y-2">
            <h2 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {authStep === 'scanning' ? 'Iniciando Google Login' : 'Validando Credenciais'}
            </h2>
            <p className="text-sm text-slate-400 font-medium px-8">
              {authStep === 'scanning' ? 'Aguarde um momento enquanto conectamos ao Google Services...' : 'Sincronizando os dados da sua assistência técnica...'}
            </p>
          </div>

          <div className="flex justify-center gap-1.5">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'google_select') {
    return (
      <div className={`flex flex-col min-h-screen p-8 justify-center animate-in fade-in slide-in-from-bottom-10 duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="w-full max-w-sm mx-auto space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl shadow-inner border border-slate-100 dark:border-slate-700">
                <svg className="w-10 h-10" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
             </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Escolha uma conta</h2>
            <p className="text-sm text-slate-500">para prosseguir para o SmartFix OS</p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Libras Eletrônico', email: 'contato@libras.com.br' },
              { name: 'Jonatas Oliveira', email: 'jonatas@gmail.com' }
            ].map((acc, i) => (
              <button 
                key={i}
                onClick={() => handleSelectGoogleAccount(acc.name, acc.email)}
                className={`w-full p-4 rounded-2xl border flex items-center gap-4 transition-all active:scale-[0.97] hover:bg-blue-50/50 dark:hover:bg-blue-900/10 ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-white shadow-sm'}`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {acc.name[0]}
                </div>
                <div className="text-left flex-1">
                  <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{acc.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{acc.email}</p>
                </div>
                <ArrowRight size={14} className="text-slate-300" />
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setView('login')}
            className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
          >
            Cancelar Acesso
          </button>
        </div>
      </div>
    );
  }

  // Handle the verification view (missing in original code)
  if (view === 'verify') {
    return (
      <div className={`flex flex-col min-h-screen p-8 justify-center animate-in fade-in duration-500 transition-colors ${
        isDarkMode ? 'bg-slate-900 text-white' : 'bg-[#f8fafc] text-slate-800'
      }`}>
        <div className="w-full max-w-sm mx-auto space-y-8">
          <button onClick={() => setView('register')} className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-xs font-black uppercase tracking-widest">Voltar</span>
          </button>
          
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Mail size={32} />
            </div>
            <h2 className="text-2xl font-black">{t(language, 'verifyEmailTitle')}</h2>
            <p className="text-sm text-slate-400 font-medium">
              {t(language, 'verifyEmailSubtitle')} <span className="text-blue-500 font-bold">{email}</span>
            </p>
          </div>

          <div className="flex justify-between gap-2">
            {verificationCode.map((digit, idx) => (
              <input
                key={idx}
                ref={el => inputRefs.current[idx] = el}
                type="text"
                maxLength={1}
                className={`w-12 h-14 text-center text-xl font-black rounded-xl border-2 transition-all outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-800 shadow-sm'
                }`}
                value={digit}
                onChange={e => handleCodeChange(idx, e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Backspace' && !digit && idx > 0) {
                    inputRefs.current[idx - 1]?.focus();
                  }
                }}
              />
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30 justify-center">
              <AlertCircle size={16} />
              <span className="text-xs font-bold">{errorMessage}</span>
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={verifyCode}
              className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-2xl hover:bg-blue-700 active:scale-95 transition-all uppercase text-sm tracking-widest"
            >
              {t(language, 'confirmCode')}
            </button>
            
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-xs text-slate-400 font-medium">
                  {t(language, 'resendCode')} <span className="text-blue-500 font-bold">{timer}s</span>
                </p>
              ) : (
                <button 
                  onClick={() => { setTimer(60); setError(false); }}
                  className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={14} />
                  Reenviar Código
                </button>
              )}
            </div>
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
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 overflow-hidden relative group">
            {isSending ? (
              <RefreshCw size={32} className="animate-spin text-white" />
            ) : (storePhoto && view === 'login' ? (
              <img src={storePhoto} className="w-full h-full object-cover" alt="Logo" />
            ) : (
              <Wrench size={40} strokeWidth={2} />
            ))}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter">
              {view === 'register' ? "Crie sua conta" : (storePhoto ? storeName : 'SmartFix OS')}
            </h1>
            <p className="text-sm text-slate-400 font-medium px-4">
              {view === 'register' ? "Comece a gerenciar sua assistência técnica agora." : "Acesse sua conta para gerenciar ordens de serviço."}
            </p>
          </div>
        </div>

        <form onSubmit={view === 'register' ? handleRegister : handleLogin} className="space-y-4">
          {view === 'register' && (
            <div className="space-y-1.5 animate-in slide-in-from-left duration-300">
              <label className={labelClasses}>Nome da Loja</label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" required
                  disabled={isSending}
                  className={inputClasses}
                  placeholder="Ex: Libras Eletrônico"
                  value={newStoreName}
                  onChange={e => setNewStoreName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 animate-in slide-in-from-left duration-500">
            <label className={labelClasses}>E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" required
                disabled={isSending}
                className={inputClasses}
                placeholder="exemplo@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 animate-in slide-in-from-left duration-700">
            <label className={labelClasses}>Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isSending}
                className={inputClasses}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-500 transition-colors z-10"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 text-xs font-bold p-4 rounded-xl border border-red-100 dark:border-red-900/30 text-center animate-in shake duration-300">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 mt-6">
            <button 
              type="submit"
              disabled={isSending}
              className={`w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black flex items-center justify-center gap-3 shadow-2xl hover:bg-blue-700 active:scale-[0.98] transition-all uppercase text-sm tracking-widest ${isSending ? 'opacity-70' : ''}`}
            >
              {isSending ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Validando Acesso...
                </>
              ) : (
                <>
                  {view === 'register' ? 'Criar Conta Grátis' : 'Entrar agora'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {view === 'login' && (
              <button 
                type="button"
                onClick={handleGoogleLoginTrigger}
                disabled={isSending}
                className={`w-full py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-black flex items-center justify-center gap-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase text-[10px] tracking-widest active:scale-95 shadow-sm ${isSending ? 'opacity-50' : ''}`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </button>
            )}
          </div>
        </form>

        <div className="pt-4 flex flex-col items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">
              {view === 'register' ? "Já tem uma conta?" : "Não tem uma conta?"}
            </span>
            <button 
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
            >
              {view === 'register' ? "Entrar agora" : "Cadastre-se"}
            </button>
          </div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] opacity-40 italic">SmartFix Enterprise v2.5</p>
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};
