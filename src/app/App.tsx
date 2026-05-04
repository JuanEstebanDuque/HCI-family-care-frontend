import React, { useState, useEffect, type FormEvent, type ReactNode } from 'react';
import { Home, Heart, Bell, Settings, Eye, EyeOff, Wifi, Check, ChevronRight, X, Plus, Edit, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchDashboard, fetchTimeline, fetchPatterns, fetchMedications, addMedication, updateMedication, deleteMedication, fetchSettings, registerUser, loginUser, fetchUserByEmail, fetchReminders, addReminder, updateReminder, deleteReminder, fetchDailyRoutine, type Repetition } from './api';

export default function App() {
  const [authStep, setAuthStep] = useState<'login' | 'hardware' | 'dashboard'>('login');
  const [activeTab, setActiveTab] = useState('resumen');
  const [isLogin, setIsLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  if (authStep === 'login') {
    return <LoginScreen
      onComplete={(user: any, isRegister: boolean) => {
        setCurrentUser(user);
        setAuthStep(isRegister ? 'hardware' : 'dashboard');
      }}
      isLogin={isLogin}
      setIsLogin={setIsLogin}
    />;
  }

  if (authStep === 'hardware') {
    return <HardwareSetupScreen onComplete={() => setAuthStep('dashboard')} />;
  }

  return (
    <div className="bg-white min-h-screen w-full flex flex-col desktop:flex-row desktop:items-start">
      {/* Desktop Sidebar Nav */}
      <div className="hidden desktop:flex desktop:flex-col desktop:w-[240px] desktop:min-h-screen desktop:border-r desktop:border-[#d8d8de] desktop:bg-white desktop:fixed desktop:left-0 desktop:top-0 desktop:bottom-0">
        <div className="p-6 border-b border-[#d8d8de]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c97b6b] to-[#b86a5a] flex items-center justify-center">
              <Heart size={20} className="text-white" />
            </div>
            <span className="font-bold text-[18px] text-[#111]">El Faro</span>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-4 flex-1">
          {[{tab:'resumen',icon:<Home size={20}/>,label:'Resumen'},{tab:'rutina',icon:<Heart size={20}/>,label:'Rutina'},{tab:'alertas',icon:<Bell size={20}/>,label:'Alertas'},{tab:'ajustes',icon:<Settings size={20}/>,label:'Ajustes'}].map(({tab,icon,label})=>(
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeTab===tab?'bg-[#c97b6b] text-white':'text-[#6e6e73] hover:bg-[#fdfcfb]'}`}>
              {icon}<span className="text-[15px] font-medium">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 desktop:ml-[240px] overflow-y-auto pb-[84px] desktop:pb-6 desktop:max-w-[900px]">
        {activeTab === 'resumen' && <DashboardScreen setActiveTab={setActiveTab} user={currentUser} />}
        {activeTab === 'rutina' && <TimelineScreen user={currentUser} />}
        {activeTab === 'medicacion' && <MedicacionScreen />}
        {activeTab === 'actividad' && <ActividadScreen user={currentUser} />}
        {activeTab === 'alertas' && <AlertasScreen />}
        {activeTab === 'ajustes' && <AjustesScreen user={currentUser} />}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="desktop:hidden fixed bottom-0 left-0 right-0 h-[84px] bg-white border-t border-[#d8d8de] flex items-center justify-around px-5 z-40">
        <NavItem icon={<Home size={20}/>} label="Resumen" active={activeTab==='resumen'} onClick={()=>setActiveTab('resumen')}/>
        <NavItem icon={<Heart size={20}/>} label="Rutina" active={activeTab==='rutina'} onClick={()=>setActiveTab('rutina')}/>
        <NavItem icon={<Bell size={20}/>} label="Alertas" active={activeTab==='alertas'} onClick={()=>setActiveTab('alertas')}/>
        <NavItem icon={<Settings size={20}/>} label="Ajustes" active={activeTab==='ajustes'} onClick={()=>setActiveTab('ajustes')}/>
      </div>
    </div>
  );
}

function LoginScreen({ onComplete, isLogin, setIsLogin }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (isLogin) {
        user = await loginUser({ email, password });
        onComplete(user, false);
      } else {
        user = await registerUser({ nombre: name, email, password });
        onComplete(user, true);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fdfcfb] min-h-screen w-full flex flex-col desktop:flex-row">
      {/* Desktop: Left Branding Panel */}
      <div className="hidden desktop:flex desktop:w-1/2 desktop:min-h-screen bg-gradient-to-br from-[#c97b6b] to-[#9d5a4d] flex-col items-center justify-center px-12 gap-6">
        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center shadow-2xl mb-2">
          <Heart size={52} className="text-white" strokeWidth={2} />
        </div>
        <h2 className="text-[36px] font-bold text-white text-center leading-tight">El Faro</h2>
        <p className="text-[18px] text-white/80 text-center max-w-[320px] leading-relaxed">
          Monitorea el bienestar de tu ser querido con tranquilidad, desde cualquier lugar.
        </p>
        <div className="flex gap-3 mt-4">
          {['Tiempo real','Alertas','Medicación'].map(tag => (
            <span key={tag} className="px-3 py-1.5 bg-white/20 rounded-full text-white text-[13px] font-medium">{tag}</span>
          ))}
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[390px]">
          {/* Logo visible solo en mobile */}
          <div className="desktop:hidden flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c97b6b] to-[#b86a5a] flex items-center justify-center shadow-lg">
              <Heart size={40} className="text-white" strokeWidth={2} />
            </div>
          </div>

          <h1 className="text-[32px] font-bold text-[#111] mb-2 text-center desktop:text-left">
            {isLogin ? 'Bienvenido' : 'Crear cuenta'}
          </h1>
          <p className="text-[16px] text-[#6e6e73] mb-8 text-center desktop:text-left">
            {isLogin ? 'Cuida de tu ser querido con tranquilidad' : 'Comienza a cuidar de quien más importa'}
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[14px] text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-[14px] font-medium text-[#111] mb-2">Nombre completo</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full h-[52px] px-4 bg-white border border-[#d8d8de] rounded-2xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                  placeholder="Tu nombre" required />
              </div>
            )}
            <div>
              <label className="block text-[14px] font-medium text-[#111] mb-2">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[52px] px-4 bg-white border border-[#d8d8de] rounded-2xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                placeholder="tu@email.com" required />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#111] mb-2">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] px-4 pr-12 bg-white border border-[#d8d8de] rounded-2xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e8e93] hover:text-[#111] transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-[14px] text-[#c97b6b] font-medium hover:text-[#b86a5a] transition-colors">¿Olvidaste tu contraseña?</button>
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full h-[56px] bg-[#c97b6b] hover:bg-[#b86a5a] disabled:opacity-60 text-white text-[16px] font-semibold rounded-2xl transition-all shadow-lg shadow-[#c97b6b]/20 mt-6">
              {loading ? 'Cargando...' : (isLogin ? 'Iniciar sesión' : 'Crear cuenta')}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-2 justify-center desktop:justify-start">
            <p className="text-[14px] text-[#6e6e73]">{isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}</p>
            <button onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[14px] text-[#c97b6b] font-semibold hover:text-[#b86a5a] transition-colors">
              {isLogin ? 'Registrarse' : 'Iniciar sesión'}
            </button>
          </div>
          <p className="text-[12px] text-[#8e8e93] text-center desktop:text-left mt-8 leading-relaxed">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad médica.
          </p>
        </div>
      </div>
    </div>
  );
}

function HardwareSetupScreen({ onComplete }: any) {
  const [step, setStep] = useState<'intro' | 'token' | 'ready'>('intro');

  if (step === 'intro') {
    return (
      <div className="bg-[#fdfcfb] min-h-screen w-full flex flex-col desktop:flex-row">
        {/* Desktop: Left Branding Panel */}
        <div className="hidden desktop:flex desktop:w-1/2 desktop:min-h-screen bg-gradient-to-br from-[#8faf74] to-[#5c7d48] flex-col items-center justify-center px-12 gap-6">
          <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center shadow-2xl mb-2">
            <Wifi size={60} className="text-white" strokeWidth={2} />
          </div>
          <h2 className="text-[36px] font-bold text-white text-center">Configuración del Tótem</h2>
          <p className="text-[18px] text-white/80 text-center max-w-[320px] leading-relaxed">
            En pocos pasos vincularemos el dispositivo con tu cuenta.
          </p>
        </div>

        {/* Right: Content */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[390px] flex flex-col items-center">
            {/* Icon visible solo en mobile */}
            <div className="desktop:hidden w-24 h-24 rounded-full bg-gradient-to-br from-[#8faf74] to-[#7a9a63] flex items-center justify-center mb-8 shadow-xl">
              <Wifi size={48} className="text-white" strokeWidth={2} />
            </div>

            <h1 className="text-[28px] font-bold text-[#111] mb-4 text-center">Configuración de Dispositivo</h1>
            <p className="text-[16px] text-[#6e6e73] text-center max-w-[320px] mb-12 leading-relaxed">
              Vamos a vincular el Tótem con tu cuenta para que puedas comenzar a monitorear el bienestar de tu ser querido.
            </p>

            <div className="w-full space-y-4 mb-12">
              <StepItem number={1} title="Verificar código de enlace" description="El Tótem tiene un código único preconfigurado" />
              <StepItem number={2} title="Enchufar el Tótem" description="Tu ser querido solo necesita conectarlo a la corriente" />
              <StepItem number={3} title="Listo para usar" description="El sistema comenzará a funcionar automáticamente" />
            </div>

            <button onClick={() => setStep('token')}
              className="w-full h-[56px] bg-[#c97b6b] hover:bg-[#b86a5a] text-white text-[16px] font-semibold rounded-2xl transition-all shadow-lg shadow-[#c97b6b]/20">
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfcfb] min-h-screen w-full flex flex-col desktop:flex-row">
      {/* Desktop: Left Branding Panel */}
      <div className="hidden desktop:flex desktop:w-1/2 desktop:min-h-screen bg-gradient-to-br from-[#8faf74] to-[#5c7d48] flex-col items-center justify-center px-12 gap-6">
        <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center shadow-2xl mb-2">
          <Check size={60} className="text-white" strokeWidth={3} />
        </div>
        <h2 className="text-[36px] font-bold text-white text-center">Enlace de Dispositivo</h2>
        <p className="text-[18px] text-white/80 text-center max-w-[320px] leading-relaxed">
          Tu Tótem está listo para comenzar a cuidar de tu ser querido.
        </p>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8faf74]/10 mb-4">
            <Check size={32} className="text-[#8faf74]" strokeWidth={3} />
          </div>
          <h1 className="text-[28px] font-bold text-[#111] mb-2">
            Enlace de Dispositivo
          </h1>
          <p className="text-[16px] text-[#6e6e73]">
            Tu código de vinculación
          </p>
        </div>

        {/* Token Card */}
        <div className="bg-white rounded-[24px] border-2 border-[#8faf74] shadow-2xl shadow-[#8faf74]/10 p-8 mb-6">
          <div className="text-center">
            <p className="text-[14px] font-medium text-[#8e8e93] uppercase tracking-wider mb-3">
              Código de Tótem
            </p>
            <div className="font-mono text-[48px] font-bold text-[#111] tracking-[0.2em] mb-2">
              CASA10
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-[#c97b6b] to-[#8faf74] rounded-full mx-auto"></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#8faf74]/5 rounded-[20px] p-5 mb-8 border border-[#8faf74]/20">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#8faf74] flex items-center justify-center flex-shrink-0 mt-0.5">
              <Heart size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-[#111] mb-2">
                Instrucciones para tu ser querido
              </h3>
              <p className="text-[15px] text-[#6e6e73] leading-relaxed">
                El sistema de tu ser querido ya ha sido preconfigurado. Para empezar a cuidar de él, solo asegúrate de que enchufe el Tótem a la corriente en su casa.
              </p>
            </div>
          </div>
          <div className="pl-11">
            <p className="text-[15px] text-[#6e6e73] leading-relaxed italic">
              No necesita usar aplicaciones ni configurar contraseñas.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-auto">
          <FeatureItem
            icon="✓"
            text="Configuración automática al enchufar"
          />
          <FeatureItem
            icon="✓"
            text="Sin instalación de apps necesaria"
          />
          <FeatureItem
            icon="✓"
            text="Monitoreo comienza inmediatamente"
          />
        </div>

        {/* CTA Button */}
        <button
          onClick={onComplete}
          className="w-full h-[56px] bg-[#c97b6b] hover:bg-[#b86a5a] text-white text-[16px] font-semibold rounded-2xl transition-all shadow-lg shadow-[#c97b6b]/20 mt-8"
        >
          Ir al Tablero de Monitoreo
        </button>

        {/* Help Link */}
        <button className="w-full mt-4 text-[14px] text-[#8e8e93] hover:text-[#c97b6b] transition-colors">
          ¿Necesitas ayuda con la instalación?
        </button>
        </div>
      </div>
    </div>
  );
}

function StepItem({ number, title, description }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-[#c97b6b] flex items-center justify-center flex-shrink-0 text-white font-bold text-[14px]">
        {number}
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="text-[16px] font-semibold text-[#111] mb-1">{title}</h3>
        <p className="text-[14px] text-[#6e6e73]">{description}</p>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded-full bg-[#8faf74] flex items-center justify-center text-white text-[14px] font-bold">
        {icon}
      </div>
      <p className="text-[15px] text-[#6e6e73]">{text}</p>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1"
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
        active ? 'bg-[#c97b6b]' : 'bg-[#ebebf0]'
      }`}>
        <div className={active ? 'text-white' : 'text-black'}>
          {icon}
        </div>
      </div>
      <span className="text-[12px] text-[#8e8e93] font-medium">
        {label}
      </span>
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────
// RepetitionSelector — matches the project design system
// ──────────────────────────────────────────────────────────────────────
const DAYS_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const DAYS_NAMES  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];

function formatRepetition(rep?: Repetition): string {
  if (!rep || rep.frequency === 'none') return 'No se repite';
  const iv = rep.interval || 1;
  switch (rep.frequency) {
    case 'daily':   return iv === 1 ? 'Todos los días' : `Cada ${iv} días`;
    case 'weekly': {
      const days = (rep.daysOfWeek || []).map(d => DAYS_NAMES[d]).join(', ');
      const base = iv === 1 ? 'Cada semana' : `Cada ${iv} semanas`;
      return days ? `${base} (${days})` : base;
    }
    case 'monthly': return iv === 1 ? 'Cada mes' : `Cada ${iv} meses`;
    case 'yearly':  return iv === 1 ? 'Cada año' : `Cada ${iv} años`;
    default:        return 'Personalizado';
  }
}

type QuickOption = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';

function RepetitionSelector({ value, onChange }: { value: Repetition; onChange: (r: Repetition) => void }) {
  const toQuick = (r: Repetition): QuickOption => {
    if (r.frequency === 'none')    return 'none';
    if (r.frequency === 'daily' && (r.interval||1) === 1)   return 'daily';
    if (r.frequency === 'weekly' && (r.interval||1) === 1 && !(r.daysOfWeek?.length)) return 'weekly';
    if (r.frequency === 'monthly' && (r.interval||1) === 1) return 'monthly';
    return 'custom';
  };

  const [quick, setQuick] = useState<QuickOption>(toQuick(value));

  const handleQuick = (q: QuickOption) => {
    setQuick(q);
    if (q === 'none')    { onChange({ frequency: 'none' }); return; }
    if (q === 'daily')   { onChange({ frequency: 'daily', interval: 1 }); return; }
    if (q === 'weekly')  { onChange({ frequency: 'weekly', interval: 1 }); return; }
    if (q === 'monthly') { onChange({ frequency: 'monthly', interval: 1 }); return; }
    // custom — keep current values or default to weekly
    if (q === 'custom') {
      onChange({ frequency: value.frequency === 'none' ? 'weekly' : value.frequency, interval: value.interval || 1, daysOfWeek: value.daysOfWeek || [] });
    }
  };

  const toggleDay = (d: number) => {
    const days = value.daysOfWeek || [];
    const next = days.includes(d) ? days.filter(x => x !== d) : [...days, d];
    onChange({ ...value, daysOfWeek: next });
  };

  const freqLabels: { freq: 'daily'|'weekly'|'monthly'|'yearly'; label: string }[] = [
    { freq: 'daily',   label: 'día(s)' },
    { freq: 'weekly',  label: 'semana(s)' },
    { freq: 'monthly', label: 'mes(es)' },
    { freq: 'yearly',  label: 'año(s)' },
  ];

  const inputCls = 'h-[40px] border border-[#d8d8de] rounded-xl text-[14px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all bg-white';

  return (
    <div className="space-y-3">
      {/* Quick options */}
      <div>
        <label className="block text-[13px] font-medium text-[#111] mb-2">Repetición</label>
        <select
          value={quick}
          onChange={e => handleQuick(e.target.value as QuickOption)}
          className={`w-full px-3 ${inputCls}`}
        >
          <option value="none">No se repite</option>
          <option value="daily">Todos los días</option>
          <option value="weekly">Cada semana</option>
          <option value="monthly">Cada mes</option>
          <option value="custom">Personalizado...</option>
        </select>
      </div>

      {/* Custom panel */}
      {quick === 'custom' && (
        <div className="bg-[#fdfcfb] border border-[#d8d8de] rounded-xl p-3 space-y-3">
          {/* Interval + frequency */}
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#6e6e73] whitespace-nowrap">Repetir cada</span>
            <input
              type="number" min={1} max={99}
              value={value.interval || 1}
              onChange={e => onChange({ ...value, interval: Math.max(1, parseInt(e.target.value) || 1) })}
              className={`w-[60px] px-2 text-center ${inputCls}`}
            />
            <select
              value={value.frequency === 'none' ? 'weekly' : value.frequency}
              onChange={e => onChange({ ...value, frequency: e.target.value as Repetition['frequency'] })}
              className={`flex-1 px-2 ${inputCls}`}
            >
              {freqLabels.map(({ freq, label }) => (
                <option key={freq} value={freq}>{label}</option>
              ))}
            </select>
          </div>

          {/* Day-of-week toggles — only for weekly */}
          {(value.frequency === 'weekly' || value.frequency === 'none') && (
            <div>
              <p className="text-[12px] text-[#8e8e93] mb-2">Días de la semana</p>
              <div className="flex gap-1.5 justify-between">
                {DAYS_LABELS.map((label, idx) => {
                  const active = (value.daysOfWeek || []).includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`w-9 h-9 rounded-full text-[12px] font-semibold transition-all ${
                        active
                          ? 'bg-[#c97b6b] text-white shadow-sm shadow-[#c97b6b]/30'
                          : 'bg-[#ebebf0] text-[#6e6e73] hover:bg-[#d8d8de]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────
// RoutineSection — collapsible accordion for Medicamentos / Actividades
// ──────────────────────────────────────────────────────────────────────
function RoutineSection({ title, accentColor, bgTint, borderTint, items, renderItem }: {
  title: string;
  accentColor: string;
  bgTint: string;
  borderTint: string;
  items: any[];
  renderItem: (item: any, index: number) => ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const count = items.length;

  return (
    <div className="rounded-[16px] border overflow-hidden shadow-sm" style={{ borderColor: borderTint + '40' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 transition-colors"
        style={{ backgroundColor: bgTint }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }} />
          <span className="text-[16px] font-semibold text-[#111]">{title}</span>
          <span
            className="text-[12px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: accentColor + '22', color: accentColor }}
          >
            {count}
          </span>
        </div>
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', color: accentColor }}
        >
          <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Items */}
      {open && (
        <div className="bg-white px-3 py-3 space-y-2.5">
          {count === 0 ? (
            <p className="text-[13px] text-[#8e8e93] text-center py-3">Sin elementos para hoy</p>
          ) : (
            items.map((item, i) => renderItem(item, i))
          )}
        </div>
      )}
    </div>
  );
}

function DashboardScreen({ setActiveTab, user }: any) {
  const caregiver = user?.nombre || 'Cuidador';
  const elderId = user?.pin_vinculacion || 'CASA10';
  const elderName = user?.nombre_persona_a_cuidar || 'Manuel';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });

  useEffect(() => {
    fetchDashboard(elderId)
      .then(res => {
        console.log('[HCI Resumen] respuesta analytics/dashboard', { elderId, payload: res });
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [elderId]);

  if (loading) return <div className="px-4 pt-4 pb-6">Cargando resumen...</div>;
  if (!data) return <div className="px-4 pt-4 pb-6 text-red-500">Error cargando resumen</div>;

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-[28px] font-semibold text-[#111] mb-1">
        Cuidado de {elderName}
      </h1>
      <p className="text-[16px] text-[#8e8e93] mb-6 capitalize">
        Hoy, {todayStr}
      </p>

      {/* Hero Status Card */}
      <div className="bg-white rounded-[20px] border border-[#d8d8de] shadow-lg p-5 flex flex-col items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.estadoGeneral?.color || '#8faf74' }}></div>
        <p className="text-[12px] text-[#8e8e93]">Estado actual</p>
        <h2 className="text-[32px] font-bold text-[#111] text-center leading-tight">{data.estadoGeneral?.titulo || 'Todo normal hoy'}</h2>
        <p className="text-[16px] text-[#6e6e73] text-center">
          {data.estadoGeneral?.descripcion || `La rutina de ${elderName} se mantiene dentro de lo esperado.`}
        </p>
        <p className="text-[12px] text-[#8e8e93]">Última actualización {data.estadoGeneral?.ultimaActualizacion || ''}</p>
      </div>

      <h3 className="text-[16px] font-semibold text-[#111] mb-4">Resumen de hoy</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => setActiveTab('medicacion')} className="text-left w-full h-full">
          <StatCard
            icon={<div className="w-3 h-3 rounded-full bg-[#d8d8de]"></div>}
            title="Medicación"
            value={data.resumenHoy?.medicacion?.estado || 'Sin datos'}
            time={data.resumenHoy?.medicacion?.hora || ''}
          />
        </button>
        <button onClick={() => setActiveTab('actividad')} className="text-left w-full h-full">
          <StatCard
            icon={<div className="w-3 h-3 rounded-full bg-[#d8d8de]"></div>}
            title="Actividad"
            value={data.resumenHoy?.actividad?.estado || 'Sin datos'}
            time={data.resumenHoy?.actividad?.hora || ''}
          />
        </button>
      </div>

      {/* System Card */}
      <button onClick={() => setActiveTab('ajustes')} className="w-full text-left bg-white rounded-[10px] border border-[#d8d8de] shadow-lg p-4 mb-6 transition-colors hover:bg-[#fdfcfb]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ebebf0] border border-[#d8d8de] flex items-center justify-center flex-shrink-0">
            <div className="w-6 h-6 bg-[#d8d8de] rounded"></div>
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-medium text-[#111] mb-0.5">
              {data.lecturaSistema?.titulo || 'Lectura del sistema'}
            </p>
            <p className="text-[14px] text-[#8e8e93]">
              {data.lecturaSistema?.mensaje || 'No se detectan anomalías relevantes'}
            </p>
          </div>
          <ChevronRight size={20} className="text-[#8e8e93]" />
        </div>
      </button>

      {/* Action Buttons */}
      <button className="w-full h-[56px] bg-[#1c1c1e] rounded-2xl text-white text-[16px] font-medium">
        Contactar a {elderName}
      </button>
    </div>
  );
}

function StatCard({ icon, title, value, time }: any) {
  return (
    <div className="bg-white rounded-[20px] border border-[#d8d8de] shadow-sm p-5 flex flex-col items-center justify-center text-center h-full">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <p className="text-[16px] font-medium text-[#8e8e93]">{title}</p>
      </div>
      <p className="text-[15px] font-semibold text-[#111] mb-3 leading-snug">
        {value}
      </p>
      <p className="text-[13px] text-[#8e8e93]">{time}</p>
    </div>
  );
}

function TimelineScreen({ user }: any) {
  const elderId = user?.pin_vinculacion || 'CASA10';
  const elderName = user?.nombre_persona_a_cuidar || 'Manuel';
  const [medications, setMedications] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ actividad: '', recordatorio_dia: 1, hora: '' });
  const [repetition, setRepetition] = useState<Repetition>({ frequency: 'none' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const today = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

  const load = () => {
    setLoading(true);
    Promise.all([
      fetchMedications(elderId).catch(() => []),
      fetchReminders(elderId).catch(() => [])
    ]).then(([meds, rems]) => {
      const medList = Array.isArray(meds) ? meds : [];
      const remList = Array.isArray(rems) ? rems : [];
      console.log('[HCI Rutina] respuestas paralelas', { elderId, medications: medList, reminders: remList });
      medList.forEach((m: any, i: number) => {
        console.log(`[HCI Rutina / medicamento #${i}] status & phase (y claves del objeto)`, {
          name: m.name ?? m.title,
          status: m.status,
          phase: m.phase,
          todasLasClaves: m && typeof m === 'object' ? Object.keys(m) : [],
          item: m,
        });
      });
      setMedications(medList);
      setReminders(remList);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.actividad || !form.hora) return;
    setSaving(true); setSaveError('');
    try {
      if (editingId) {
        await updateReminder(editingId, { elder_id: elderId, ...form, repetition });
      } else {
        await addReminder({ elder_id: elderId, ...form, repetition });
      }
      setForm({ actividad: '', recordatorio_dia: 1, hora: '' });
      setRepetition({ frequency: 'none' });
      setEditingId(null);
      setShowModal(false);
      load();
    } catch (e: any) {
      setSaveError(e.message);
    } finally {
      setSaving(false);
    }
  };
  const handleEdit = (r: any) => {
    setForm({ actividad: r.actividad, recordatorio_dia: r.recordatorio_dia, hora: r.hora });
    setRepetition(r.repetition || { frequency: 'none' });
    setEditingId(r._id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar recordatorio?')) return;
    try {
      await deleteReminder(id);
      load();
    } catch (e) {
      alert('Error eliminando');
    }
  };

  // Sort each list by hora
  const sortedMeds = [...medications].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));
  const sortedRems = [...reminders].sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));

  return (
    <div className="px-4 pt-4 pb-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-[28px] font-semibold text-[#111]">Plan de {elderName}</h1>
        <button
          onClick={() => {
            setEditingId(null);
            setForm({ actividad: '', recordatorio_dia: 1, hora: '' });
            setRepetition({ frequency: 'none' });
            setShowModal(true);
          }}
          className="w-10 h-10 rounded-full bg-[#c97b6b] flex items-center justify-center shadow-lg hover:bg-[#b86a5a] transition-colors">
          <Plus size={20} className="text-white" />
        </button>
      </div>
      <p className="text-[15px] text-[#8e8e93] mb-6 capitalize">{today}</p>

      {loading ? (
        <div className="bg-white rounded-[16px] border border-[#d8d8de] shadow-lg p-6 flex flex-col items-center gap-3">
          <p className="text-[#8e8e93]">Cargando rutina...</p>
        </div>
      ) : (medications.length === 0 && reminders.length === 0) ? (
        <div className="bg-white rounded-[16px] border border-[#d8d8de] shadow-lg p-6 flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#ebebf0] flex items-center justify-center">
            <Bell size={24} className="text-[#8e8e93]" />
          </div>
          <p className="text-[15px] text-[#8e8e93] text-center">No hay actividades para hoy.<br/>Agrega una con el botón +</p>
        </div>
      ) : (
        <div className="space-y-3 mb-4">
          {/* ── Medicamentos ── */}
          <RoutineSection
            title="Medicamentos"
            accentColor="#8faf74"
            bgTint="#f0f9eb"
            borderTint="#8faf74"
            items={sortedMeds}
            renderItem={(r: any, i: number) => {
              const isCompleted = r.status === 'completado';
              const isIgnored = r.status === 'ignorado';
              
              return (
                <div key={r._id || i} className={`bg-white rounded-[10px] border shadow-sm p-4 ${isCompleted ? 'border-[#8faf74]' : isIgnored ? 'border-red-400' : 'border-[#d8d8de]'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-[16px] font-medium ${isCompleted ? 'text-[#8faf74]' : isIgnored ? 'text-red-500' : 'text-[#c97b6b]'}`}>
                          {r.title || r.name || '—'}
                        </p>
                        {isCompleted && <Check size={16} className="text-[#8faf74]" />}
                        {isIgnored && <AlertCircle size={16} className="text-red-500" />}
                      </div>
                      {r.dose && <p className="text-[14px] text-[#8e8e93]">{r.dose}</p>}
                    </div>
                    {!isCompleted && !isIgnored && <div className="w-2.5 h-2.5 rounded-full bg-[#c97b6b] mt-1 ml-2 flex-shrink-0"></div>}
                  </div>

                  {(isCompleted || isIgnored) && r.phase && (
                    <p className={`text-[12px] font-medium mb-2 ${isCompleted ? 'text-[#8faf74]' : 'text-red-500'}`}>
                      {isCompleted ? 'Tomado en el ' : 'Ignorado en el '}{r.phase}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[14px] text-[#c97b6b]">
                    <span>{r.schedule || ''}</span>
                    <span>{r.hora}</span>
                  </div>
                  {r.repetition && r.repetition.frequency !== 'none' && (
                    <div className="flex items-center gap-1 mt-2">
                      <RefreshCw size={10} className="text-[#8faf74]" />
                      <span className="text-[11px] text-[#8faf74] font-medium">{formatRepetition(r.repetition)}</span>
                    </div>
                  )}
                </div>
              );
            }}
          />

          {/* ── Actividades ── */}
          <RoutineSection
            title="Actividades"
            accentColor="#c97b6b"
            bgTint="#fdf4f2"
            borderTint="#c97b6b"
            items={sortedRems}
            renderItem={(r: any, i: number) => (
              <div key={r._id || i} className="bg-white border border-[#c97b6b]/30 rounded-xl p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#111] capitalize">{r.title || r.actividad || '—'}</p>
                    {r.recordatorio_dia && (
                      <p className="text-[12px] text-[#8e8e93] mt-0.5">Recordatorio #{r.recordatorio_dia}</p>
                    )}
                    {r.repetition && r.repetition.frequency !== 'none' && (
                      <div className="flex items-center gap-1 mt-1.5">
                        <RefreshCw size={10} className="text-[#c97b6b]" />
                        <span className="text-[11px] text-[#c97b6b] font-medium">{formatRepetition(r.repetition)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                    <span className="text-[13px] font-bold text-[#c97b6b]">{r.hora}</span>
                    {r._id && (
                      <div className="flex gap-0.5">
                        <button onClick={() => handleEdit(r)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#c97b6b]/10 transition-colors">
                          <Edit size={13} className="text-[#8e8e93]"/>
                        </button>
                        <button onClick={() => handleDelete(r._id)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 size={13} className="text-red-400"/>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* Modal agregar recordatorio */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-[24px] w-full max-w-[360px] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[22px] font-bold text-[#111]">{editingId ? 'Editar Recordatorio' : 'Nuevo Recordatorio'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full bg-[#ebebf0] flex items-center justify-center">
                <X size={18} className="text-[#111]" />
              </button>
            </div>
            {saveError && <div className="mb-3 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-600">{saveError}</div>}
            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-[13px] font-medium text-[#111] mb-1.5">Actividad</label>
                <input type="text" value={form.actividad} onChange={e => setForm({...form, actividad: e.target.value})}
                  className="w-full h-[48px] px-4 bg-white border border-[#d8d8de] rounded-xl text-[15px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                  placeholder="ej. caminar" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#111] mb-1.5">Hora</label>
                <input type="time" value={form.hora} onChange={e => setForm({...form, hora: e.target.value})}
                  className="w-full h-[48px] px-4 bg-white border border-[#d8d8de] rounded-xl text-[15px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all" />
              </div>
              <RepetitionSelector value={repetition} onChange={setRepetition} />
              <div>
                <label className="block text-[13px] font-medium text-[#111] mb-1.5">Número de recordatorio del día</label>
                <input type="number" min={1} value={form.recordatorio_dia} onChange={e => setForm({...form, recordatorio_dia: parseInt(e.target.value)})}
                  className="w-full h-[48px] px-4 bg-white border border-[#d8d8de] rounded-xl text-[15px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 h-[48px] bg-[#ebebf0] hover:bg-[#d8d8de] text-[#111] rounded-xl font-medium transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 h-[48px] bg-[#c97b6b] hover:bg-[#b86a5a] disabled:opacity-60 text-white rounded-xl font-semibold transition-colors">
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TimelineItem({ time, title, subtitle, isLast }: any) {
  return (
    <div className={`flex items-start gap-3 ${!isLast ? 'mb-4' : ''}`}>
      <div className="flex flex-col items-center gap-1">
        <p className="text-[14px] text-[#c97b6b] w-[50px] text-left">{time}</p>
      </div>
      <div className="flex-1">
        <p className="text-[16px] font-medium text-[#c97b6b]">{title}</p>
        {subtitle && (
          <p className="text-[14px] text-[#8e8e93]">{subtitle}</p>
        )}
      </div>
      <div className="w-3 h-3 rounded-full bg-[#8faf74] mt-1"></div>
    </div>
  );
}

function MedicacionScreen() {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    dosis: '',
    horario: '',
    hora: ''
  });
  const [repetition, setRepetition] = useState<Repetition>({ frequency: 'none' });

  const loadMedications = () => {
    setLoading(true);
    fetchMedications('CASA10')
      .then(res => {
        const list = Array.isArray(res) ? res : [];
        console.log('[HCI Medicación] respuesta fetchMedications', { elderId: 'CASA10', lista: list });
        list.forEach((m: any, i: number) => {
          console.log(`[HCI Medicación / medicamento #${i}] status & phase (y claves del objeto)`, {
            name: m.name ?? m.title,
            status: m.status,
            phase: m.phase,
            todasLasClaves: m && typeof m === 'object' ? Object.keys(m) : [],
            item: m,
          });
        });
        setMedications(list);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMedications();
  }, []);

  const handleSave = () => {
    const payload = {
      elder_id: 'CASA10',
      name: formData.nombre,
      dose: formData.dosis,
      schedule: formData.horario,
      hora: formData.hora,
      repetition
    };
    const action = editingId ? updateMedication(editingId, payload) : addMedication(payload);
    
    action.then(() => {
      setFormData({ nombre: '', dosis: '', horario: '', hora: '' });
      setRepetition({ frequency: 'none' });
      setEditingId(null);
      setShowModal(false);
      loadMedications();
    }).catch(err => {
      console.error(err);
      alert('Error al guardar medicamento');
    });
  };

  const handleEdit = (med: any) => {
    setFormData({ nombre: med.name, dosis: med.dose, horario: med.schedule, hora: med.hora || '' });
    setRepetition(med.repetition || { frequency: 'none' });
    setEditingId(med._id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('¿Eliminar medicamento?')) return;
    deleteMedication(id).then(() => loadMedications()).catch(() => alert('Error eliminando'));
  };

  return (
    <div className="px-4 pt-4 pb-6">
      {/* Date Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { day: '17', name: 'Lu' },
          { day: '18', name: 'Ma' },
          { day: '19', name: 'Mi' },
          { day: '20', name: 'Ju' },
          { day: '21', name: 'Vi' },
          { day: '22', name: 'Sa' }
        ].map((date, i) => (
          <button
            key={i}
            className={`flex-shrink-0 w-[50px] h-[78px] rounded-[10px] border flex flex-col items-center justify-center gap-1 shadow-sm ${
              i === 0 ? 'bg-[#d8d8de] border-[#d8d8de]' : 'bg-white border-[#d8d8de]'
            }`}
          >
            <span className="text-[12px] font-normal">{date.day}</span>
            <span className="text-[12px] font-normal">{date.name}</span>
          </button>
        ))}
      </div>

      {/* Medication List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-center text-[#8e8e93]">Cargando medicamentos...</p>
        ) : medications.length === 0 ? (
          <p className="text-center text-[#8e8e93]">No hay medicamentos registrados</p>
        ) : (
          medications.map((med, index) => (
            <MedicationCard
              key={med._id || index}
              med={med}
              onEdit={() => handleEdit(med)}
              onDelete={() => handleDelete(med._id)}
            />
          ))
        )}
      </div>

      {/* Add New Button */}
      <button
        onClick={() => {
          setEditingId(null);
          setFormData({ nombre: '', dosis: '', horario: '', hora: '' });
          setRepetition({ frequency: 'none' });
          setShowModal(true);
        }}
        className="w-[185px] h-[56px] bg-[#8faf74] hover:bg-[#7a9a63] rounded-[20px] text-white text-[16px] font-medium mx-auto block mt-8 transition-colors shadow-lg shadow-[#8faf74]/20"
      >
        ADD NEW
      </button>

      {/* Add Medicine Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-[24px] w-full max-w-[340px] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[24px] font-bold text-[#111]">{editingId ? 'Editar Medicamento' : 'Nuevo Medicamento'}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-[#ebebf0] flex items-center justify-center hover:bg-[#d8d8de] transition-colors"
              >
                <X size={18} className="text-[#111]" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[14px] font-medium text-[#111] mb-2">
                  Nombre del Medicamento
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full h-[48px] px-4 bg-white border border-[#d8d8de] rounded-xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                  placeholder="Ej: Aspirina"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#111] mb-2">
                  Dosis
                </label>
                <input
                  type="text"
                  value={formData.dosis}
                  onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                  className="w-full h-[48px] px-4 bg-white border border-[#d8d8de] rounded-xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                  placeholder="Ej: 1 capsula / 500mg"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#111] mb-2">
                  Instrucciones
                </label>
                <input
                  type="text"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  className="w-full h-[48px] px-4 bg-white border border-[#d8d8de] rounded-xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                  placeholder="Ej: Con el desayuno"
                />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-[#111] mb-2">
                  Hora
                </label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  className="w-full h-[48px] px-4 bg-white border border-[#d8d8de] rounded-xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                />
              </div>

              <RepetitionSelector value={repetition} onChange={setRepetition} />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 h-[52px] bg-[#ebebf0] hover:bg-[#d8d8de] text-[#111] text-[16px] font-semibold rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 h-[52px] bg-[#8faf74] hover:bg-[#7a9a63] text-white text-[16px] font-semibold rounded-xl transition-colors shadow-lg shadow-[#8faf74]/20"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MedicationCard({ med, onEdit, onDelete }: any) {
  const repText = formatRepetition(med.repetition);
  
  // Status logic
  const isCompleted = med.status === 'completado';
  const isIgnored = med.status === 'ignorado';
  
  return (
    <div className={`bg-white rounded-[10px] border shadow-lg p-4 ${isCompleted ? 'border-[#8faf74]' : isIgnored ? 'border-red-400' : 'border-[#d8d8de]'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className={`text-[16px] font-medium ${isCompleted ? 'text-[#8faf74]' : isIgnored ? 'text-red-500' : 'text-[#c97b6b]'}`}>
              {med.name}
            </p>
            {isCompleted && <Check size={16} className="text-[#8faf74]" />}
            {isIgnored && <AlertCircle size={16} className="text-red-500" />}
          </div>
          <p className="text-[14px] text-[#8e8e93]">{med.dose}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onEdit}><Edit size={16} className="text-[#8e8e93] hover:text-[#c97b6b]"/></button>
          <button onClick={onDelete}><Trash2 size={16} className="text-red-400 hover:text-red-600"/></button>
          {!isCompleted && !isIgnored && <div className="w-2.5 h-2.5 rounded-full bg-[#c97b6b] mt-0.5 ml-2"></div>}
        </div>
      </div>
      
      {(isCompleted || isIgnored) && med.phase && (
        <p className={`text-[12px] font-medium mb-2 ${isCompleted ? 'text-[#8faf74]' : 'text-red-500'}`}>
          {isCompleted ? 'Tomado en el ' : 'Ignorado en el '}{med.phase}
        </p>
      )}

      <div className="flex items-center justify-between text-[14px] text-[#c97b6b] mt-2">
        <span>{med.schedule}</span>
        <span>{med.hora}</span>
      </div>
      {med.repetition && med.repetition.frequency !== 'none' && (
        <div className="mt-2 flex items-center gap-1.5">
          <RefreshCw size={11} className="text-[#8faf74] flex-shrink-0" />
          <span className="text-[12px] text-[#8faf74] font-medium">{repText}</span>
        </div>
      )}
    </div>
  );
}

function ActividadScreen({ user }: any) {
  const elderId = user?.pin_vinculacion || 'CASA10';
  const elderName = user?.nombre_persona_a_cuidar || 'Manuel';
  const [patterns, setPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatterns = () => {
      fetchPatterns(elderId)
        .then(res => {
          console.log('[HCI Actividad] respuesta analytics/patterns', { elderId, payload: res });
          setPatterns(res);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };
    
    // Initial load
    loadPatterns();
    
    // Polling every 5 seconds for real-time updates (pedometer, etc.)
    const intervalId = setInterval(loadPatterns, 5000);
    
    return () => clearInterval(intervalId);
  }, [elderId]);

  // Build weekly summary data for Recharts
  const weeklyData = (() => {
    const dias = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];
    const arr = patterns?.semanal;
    if (!Array.isArray(arr) || arr.length === 0) {
      // No data yet — render flat zeros
      return dias.map(d => ({ dia: d, valor: 0 }));
    }
    return arr.map((p: any) => ({ dia: p.dia || p.label, valor: p.valor || p.total || 0 }));
  })();


  // Pasos por hora
  const pasosData: {hora: string; valor: number; highlight: boolean}[] = (() => {
    const raw = patterns?.diario?.pasos || patterns?.pasos;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const max = Math.max(...raw.map((p:any) => p.valor || 0));
    return raw.map((p:any) => ({ hora: p.hora || p.label, valor: p.valor || 0, highlight: max > 0 && (p.valor||0) === max }));
  })();

  // BPM por hora — Recharts LineChart
  const bpmData: {hora: string; bpm: number}[] = (() => {
    const raw = patterns?.diario?.ritmoCardiaco || patterns?.ritmoCardiaco;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    return raw.map((p:any) => ({ hora: p.hora || p.label, bpm: p.valor || 0 }));
  })();
  const latestBpm = bpmData[bpmData.length - 1]?.bpm || 0;

  // Tiempo Sala por hora
  const salaData: {hora: string; valor: number; highlight: boolean}[] = (() => {
    const raw = patterns?.diario?.tiempoSala || patterns?.tiempoSala;
    if (!Array.isArray(raw) || raw.length === 0) return [];
    const min = Math.min(...raw.map((p:any) => p.valor || 0));
    return raw.map((p:any) => ({ hora: p.hora || p.label, valor: p.valor || 0, highlight: (p.valor||0) === min }));
  })();
  const totalSala = salaData.reduce((s, p) => s + p.valor, 0);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-[24px] font-semibold text-[#111] mb-1">Actividad de {elderName}</h1>
      <p className="text-[14px] text-[#8e8e93] mb-5">Hoy</p>

      {loading ? (
        <p className="text-center text-[#8e8e93] py-12">Cargando datos...</p>
      ) : (
        <div className="space-y-4">

          {/* Resumen Semanal — Recharts AreaChart */}
          <div className="bg-white rounded-[16px] border border-[#d8d8de] shadow-sm p-4">
            <p className="text-[16px] font-semibold text-[#c97b6b] mb-3">Resumen Semanal</p>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={weeklyData} margin={{top:6,right:6,left:-30,bottom:0}}>
                <defs>
                  <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c97b6b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c97b6b" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="dia" tick={{fontSize:11,fill:'#8e8e93'}} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip contentStyle={{fontSize:12,borderRadius:8,border:'1px solid #d8d8de'}} formatter={(v:any)=>[v,'pasos']}/>
                <Area type="monotone" dataKey="valor" stroke="#c97b6b" strokeWidth={2.5} fill="url(#wGrad)"
                  dot={{r:3,fill:'#c97b6b',stroke:'white',strokeWidth:2}}
                  activeDot={{r:5,fill:'#c97b6b',stroke:'white',strokeWidth:2}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Grid: Pasos + Frecuencia Cardiaca */}
          <div className="grid grid-cols-2 gap-3">
            {/* Pasos */}
            <div className="bg-white rounded-[16px] border border-[#d8d8de] shadow-sm p-4">
              <p className="text-[14px] font-semibold text-[#c97b6b] mb-1">Pasos</p>
              <p className="text-[22px] font-bold text-[#111] mb-3">{pasosData.reduce((s,p)=>s+p.valor,0).toLocaleString()}</p>
              <div className="flex items-end justify-between gap-1 h-[44px]">
                {pasosData.map((p, i) => {
                  const pct = Math.max(20, (p.valor / Math.max(...pasosData.map(x=>x.valor), 1)) * 100);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                      <div
                        className={`w-full rounded-full transition-colors duration-200 ${p.highlight ? 'bg-[#8faf74] group-hover:bg-[#7a9a63]' : 'bg-[#d9d9d9] group-hover:bg-[#c9c9c9]'}`}
                        style={{height:`${pct}%`}}
                      />
                      {/* Custom Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#d8d8de] rounded-[8px] p-1.5 px-2 text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-md whitespace-nowrap">
                        <p className="text-[11px] font-medium text-[#c97b6b]">{p.valor} pasos</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1">
                {pasosData.map((p,i) => (
                  <span key={i} className="text-[9px] text-[#8e8e93] flex-1 text-center leading-tight">{p.hora}</span>
                ))}
              </div>
            </div>

            {/* Frecuencia Cardiaca — Recharts LineChart */}
            <div className="bg-white rounded-[16px] border border-[#d8d8de] shadow-sm p-4">
              <p className="text-[14px] font-semibold text-[#c97b6b] mb-1">Frec. Cardíaca</p>
              <p className="text-[22px] font-bold text-[#111] mb-2">{latestBpm} <span className="text-[14px] font-medium text-[#8e8e93]">bpm</span></p>
              <ResponsiveContainer width="100%" height={56}>
                <LineChart data={bpmData} margin={{top:4,right:4,left:-40,bottom:0}}>
                  <XAxis dataKey="hora" hide/>
                  <YAxis hide domain={['auto','auto']}/>
                  <Tooltip contentStyle={{fontSize:11,borderRadius:8,border:'1px solid #d8d8de'}} formatter={(v:any)=>[`${v} bpm`,'']}/>
                  <Line type="monotone" dataKey="bpm" stroke="#c97b6b" strokeWidth={2}
                    dot={false} activeDot={{r:4,fill:'#c97b6b'}}/>
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between mt-1">
                {bpmData.map((p,i) => (
                  <span key={i} className="text-[9px] text-[#8e8e93] flex-1 text-center leading-tight">{p.hora}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Tiempo Sala */}
          <div className="bg-white rounded-[16px] border border-[#d8d8de] shadow-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[14px] font-semibold text-[#c97b6b]">Tiempo en Sala</p>
              <p className="text-[14px] font-bold text-[#111]">{totalSala} min</p>
            </div>
            <div className="flex items-end justify-between gap-1.5 h-[44px] mb-1">
              {salaData.map((p, i) => {
                const maxV = Math.max(...salaData.map(x=>x.valor), 1);
                const pct = Math.max(20, (p.valor / maxV) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group">
                    <div
                      className={`w-full rounded-full transition-colors duration-200 ${p.highlight ? 'bg-[#8faf74] group-hover:bg-[#7a9a63]' : 'bg-[#d9d9d9] group-hover:bg-[#c9c9c9]'}`}
                      style={{height:`${pct}%`}}
                    />
                    {/* Custom Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white border border-[#d8d8de] rounded-[8px] p-1.5 px-2 text-center opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-md whitespace-nowrap">
                      <p className="text-[11px] font-medium text-[#c97b6b]">{p.valor} min</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between">
              {salaData.map((p,i) => (
                <span key={i} className="text-[9px] text-[#8e8e93] flex-1 text-center leading-tight">{p.hora}</span>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

function ActivityMetricCard({ title, value, unit, type }: any) {
  return (
    <div className="bg-white rounded-[20px] border border-[#d8d8de] shadow p-4">
      <p className="text-[20px] font-semibold text-[#c97b6b] mb-2">{title}</p>
      <div className="flex items-baseline gap-1 mb-3">
        <p className="text-[20px] font-semibold text-black">{value}</p>
        {unit && <p className="text-[16px] font-medium text-black">{unit}</p>}
      </div>
      {/* Chart based on type */}
      {type === 'bars' && (
        <div className="flex items-end justify-between gap-1.5 h-[40px]">
          {[
            { height: 50, filled: true },
            { height: 75, filled: false },
            { height: 60, filled: true },
            { height: 85, filled: true },
            { height: 40, filled: false },
            { height: 70, filled: true },
            { height: 55, filled: false }
          ].map((bar, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full ${bar.filled ? 'bg-[#8faf74]' : 'bg-[#d9d9d9]'}`}
              style={{ height: `${bar.height}%` }}
            ></div>
          ))}
        </div>
      )}
      {type === 'wave' && (
        <div className="h-[40px] w-full">
          <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
            <path
              d="M0 25 Q10 15, 20 20 T40 20 T60 20 T80 20 T100 20 T120 20"
              stroke="#8faf74"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
      {type === 'pulse' && (
        <div className="h-[40px] w-full">
          <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
            <path
              d="M0 20 L15 20 L20 10 L25 30 L30 20 L45 20 L50 15 L55 25 L60 20 L75 20 L80 12 L85 28 L90 20 L120 20"
              stroke="#c97b6b"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function ActivityCard({ icon, title, progress }: any) {
  return (
    <div className="bg-white rounded-[10px] border border-[#d8d8de] shadow-lg p-4 mb-4 flex items-center gap-4">
      <div className="w-[50px] h-[50px] rounded-full bg-[#c97b6b] flex items-center justify-center text-2xl">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-[20px] font-semibold text-[#c97b6b] mb-2">{title}</p>
        <div className="w-full h-3 bg-[#dddfdd] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#8faf74] rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function AlertasScreen() {
  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-[28px] font-semibold text-[#111] mb-6">Alertas</h1>

      <AlertSection title="Hoy" alerts={[
        {
          title: 'Rutina estable',
          message: 'Sin cambios relevantes detectados en el sistema.',
          time: 'Hoy, 10:30 a. m.'
        }
      ]} />

      <AlertSection title="Ayer" alerts={[
        {
          title: 'Medicación completada',
          message: 'Cumplimiento de dosis sin incidencias.',
          time: 'Ayer, 8:00 a. m.'
        }
      ]} />
    </div>
  );
}

function AlertSection({ title, alerts }: any) {
  return (
    <div className="mb-8">
      <h2 className="text-[20px] font-semibold text-[#c97b6b] mb-4">{title}</h2>
      {alerts.map((alert: any, i: number) => (
        <div key={i} className="mb-4">
          <p className="text-[20px] font-semibold text-black mb-1">{alert.title}</p>
          <p className="text-[16px] font-medium text-black mb-1">{alert.message}</p>
          <p className="text-[14px] text-[#8e8e93]">{alert.time}</p>
        </div>
      ))}
    </div>
  );
}

function AjustesScreen({ user }: any) {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Items no clickeables
  const DISABLED = ['Información', 'Privacidad', 'Contacto', 'Soporte'];
  // Items con panel genérico
  const GENERIC = ['Alertas', 'Notificaciones', 'Rutina y seguimiento'];

  const settingsMenu = [
    'Perfil y Cuenta',
    'Alertas',
    'Información',
    'Privacidad',
    'Notificaciones',
    'Rutina y seguimiento',
    'Contacto',
    'Sistema',
    'Soporte'
  ];

  const handleClick = (setting: string) => {
    if (DISABLED.includes(setting)) return;
    if (setting === 'Perfil y Cuenta') {
      setOpenPanel('Perfil y Cuenta');
      if (!profileData && user?.email) {
        setProfileLoading(true);
        fetchUserByEmail(user.email)
          .then(res => setProfileData(res))
          .catch(() => setProfileData(null))
          .finally(() => setProfileLoading(false));
      }
      return;
    }
    if (GENERIC.includes(setting)) {
      setOpenPanel(setting);
      return;
    }
    // Sistema: se despliega inline (ver abajo)
  };

  return (
    <div className="px-4 pt-4 pb-6 bg-white">
      <h1 className="text-[28px] font-semibold text-[#111] mb-8">Ajustes</h1>

      <div className="bg-white">
        {settingsMenu.map((setting, i) => {
          const disabled = DISABLED.includes(setting);
          const isSistema = setting === 'Sistema';

          return (
            <div key={i}>
              {/* Row */}
              <div
                className={`w-full flex items-center justify-between py-4 border-b border-[#d8d8de] ${
                  disabled ? 'opacity-40 cursor-default' : 'hover:bg-[#fdfcfb] cursor-pointer'
                } transition-colors`}
                onClick={() => handleClick(setting)}
              >
                <span className="text-[18px] text-[#c97b6b] font-normal">{setting}</span>
                {!disabled && <ChevronRight size={20} className="text-[#c97b6b]" />}
              </div>

              {/* Sistema: contenido inline expandido */}
              {isSistema && (
                <div className="py-4 border-b border-[#d8d8de] bg-white space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-[#f0f7eb] rounded-xl border border-[#8faf74]/30">
                    <div className="w-3 h-3 rounded-full bg-[#8faf74] flex-shrink-0"></div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#111]">Tótem conectado</p>
                      <p className="text-[13px] text-[#6e6e73]">Pin: {user?.pin_vinculacion || 'CASA10'} — Activo y transmitiendo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#d8d8de]">
                    <div className="w-8 h-8 rounded-xl bg-[#ebebf0] flex items-center justify-center flex-shrink-0">
                      <Settings size={16} className="text-[#6e6e73]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#111]">Firmware</p>
                      <p className="text-[13px] text-[#8e8e93]">Versión estable — Sin actualizaciones pendientes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#d8d8de]">
                    <div className="w-8 h-8 rounded-xl bg-[#ebebf0] flex items-center justify-center flex-shrink-0">
                      <Wifi size={16} className="text-[#6e6e73]" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#111]">Conectividad</p>
                      <p className="text-[13px] text-[#8e8e93]">Bluetooth activo — Señal estable</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel lateral: Perfil y Cuenta */}
      {openPanel === 'Perfil y Cuenta' && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpenPanel(null)}>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] desktop:w-[420px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[#d8d8de]">
                <h2 className="text-[20px] font-semibold text-[#111]">Perfil y Cuenta</h2>
                <button onClick={() => setOpenPanel(null)}
                  className="w-8 h-8 rounded-full bg-[#ebebf0] flex items-center justify-center hover:bg-[#d8d8de] transition-colors">
                  <X size={18} className="text-[#111]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {profileLoading ? (
                  <p className="text-[#8e8e93] text-center py-8">Cargando perfil...</p>
                ) : profileData ? (
                  <div className="space-y-4">
                    {/* Avatar */}
                    <div className="flex flex-col items-center py-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c97b6b] to-[#b86a5a] flex items-center justify-center mb-3 shadow-lg">
                        <span className="text-white text-[32px] font-bold">
                          {(profileData.nombre || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[20px] font-semibold text-[#111]">{profileData.nombre}</p>
                      <p className="text-[14px] text-[#8e8e93]">{profileData.rol}</p>
                    </div>

                    {/* Datos */}
                    {[
                      { label: 'Correo electrónico', value: profileData.email },
                      { label: 'Pin de vinculación', value: profileData.pin_vinculacion },
                      { label: 'Persona a cuidar', value: profileData.nombre_persona_a_cuidar },
                      { label: 'Rol', value: profileData.rol },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[#fdfcfb] rounded-xl border border-[#d8d8de] px-4 py-3">
                        <p className="text-[12px] text-[#8e8e93] mb-0.5">{label}</p>
                        <p className="text-[15px] font-medium text-[#111]">{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[14px] text-[#8e8e93] text-center py-8">No se pudo cargar el perfil.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Panel lateral: genérico (Alertas, Notificaciones, Rutina) */}
      {openPanel && !['Perfil y Cuenta'].includes(openPanel) && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpenPanel(null)}>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] desktop:w-[420px] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-[#d8d8de]">
                <h2 className="text-[20px] font-semibold text-[#111]">{openPanel}</h2>
                <button onClick={() => setOpenPanel(null)}
                  className="w-8 h-8 rounded-full bg-[#ebebf0] flex items-center justify-center hover:bg-[#d8d8de] transition-colors">
                  <X size={18} className="text-[#111]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-[#fdfcfb] rounded-xl border border-[#d8d8de] p-4">
                  <p className="text-[14px] text-[#8e8e93]">
                    Las opciones de configuración para {openPanel.toLowerCase()} aparecerán aquí.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

