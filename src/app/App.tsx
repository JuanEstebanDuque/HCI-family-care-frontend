import { useState, useEffect } from 'react';
import { Home, Heart, Bell, Settings, Eye, EyeOff, Wifi, Check, ChevronRight, X } from 'lucide-react';
import { fetchDashboard, fetchTimeline, fetchPatterns, fetchMedications, addMedication, fetchSettings } from './api';

export default function App() {
  const [authStep, setAuthStep] = useState<'login' | 'hardware' | 'dashboard'>('login');
  const [activeTab, setActiveTab] = useState('resumen');
  const [isLogin, setIsLogin] = useState(true);

  if (authStep === 'login') {
    return <LoginScreen onComplete={() => setAuthStep('hardware')} isLogin={isLogin} setIsLogin={setIsLogin} />;
  }

  if (authStep === 'hardware') {
    return <HardwareSetupScreen onComplete={() => setAuthStep('dashboard')} />;
  }

  return (
    <div className="bg-white h-screen w-full max-w-[390px] mx-auto relative flex flex-col">
      {/* Status Bar */}
      <div className="h-[47px] flex items-center justify-between px-4 pt-3">
        <span className="font-semibold text-[20px]">9:41</span>
        <div className="flex gap-1.5">
          <div className="w-[15px] h-[11px] bg-black rounded-sm"></div>
          <div className="w-[15px] h-[11px] bg-black rounded-sm"></div>
          <div className="w-[25px] h-[11px] bg-black rounded-sm"></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-[84px]">
        {activeTab === 'resumen' && <DashboardScreen setActiveTab={setActiveTab} />}
        {activeTab === 'rutina' && <TimelineScreen />}
        {activeTab === 'medicacion' && <MedicacionScreen />}
        {activeTab === 'actividad' && <ActividadScreen />}
        {activeTab === 'alertas' && <AlertasScreen />}
        {activeTab === 'ajustes' && <AjustesScreen />}
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-[84px] bg-white border-t border-[#d8d8de] flex items-center justify-around px-5">
        <NavItem
          icon={<Home size={20} />}
          label="Resumen"
          active={activeTab === 'resumen'}
          onClick={() => setActiveTab('resumen')}
        />
        <NavItem
          icon={<Heart size={20} />}
          label="Rutina"
          active={activeTab === 'rutina'}
          onClick={() => setActiveTab('rutina')}
        />
        <NavItem
          icon={<Bell size={20} />}
          label="Alertas"
          active={activeTab === 'alertas'}
          onClick={() => setActiveTab('alertas')}
        />
        <NavItem
          icon={<Settings size={20} />}
          label="Ajustes"
          active={activeTab === 'ajustes'}
          onClick={() => setActiveTab('ajustes')}
        />
      </div>
    </div>
  );
}

function LoginScreen({ onComplete, isLogin, setIsLogin }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete();
  };

  return (
    <div className="bg-[#fdfcfb] min-h-screen w-full max-w-[390px] mx-auto flex flex-col">
      {/* Status Bar */}
      <div className="h-[47px] flex items-center justify-between px-4 pt-3">
        <span className="font-semibold text-[20px]">9:41</span>
        <div className="flex gap-1.5">
          <div className="w-[15px] h-[11px] bg-black rounded-sm"></div>
          <div className="w-[15px] h-[11px] bg-black rounded-sm"></div>
          <div className="w-[25px] h-[11px] bg-black rounded-sm"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Logo/Icon Area */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#c97b6b] to-[#b86a5a] flex items-center justify-center mb-8 shadow-lg">
          <Heart size={40} className="text-white" strokeWidth={2} />
        </div>

        {/* Title */}
        <h1 className="text-[32px] font-bold text-[#111] mb-2 text-center">
          {isLogin ? 'Bienvenido' : 'Crear cuenta'}
        </h1>
        <p className="text-[16px] text-[#6e6e73] mb-8 text-center max-w-[280px]">
          {isLogin
            ? 'Cuida de tu ser querido con tranquilidad'
            : 'Comienza a cuidar de quien más importa'
          }
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-[340px] space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-[14px] font-medium text-[#111] mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-[52px] px-4 bg-white border border-[#d8d8de] rounded-2xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[14px] font-medium text-[#111] mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] px-4 bg-white border border-[#d8d8de] rounded-2xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[#111] mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[52px] px-4 pr-12 bg-white border border-[#d8d8de] rounded-2xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8e8e93] hover:text-[#111] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex justify-end">
              <button
                type="button"
                className="text-[14px] text-[#c97b6b] font-medium hover:text-[#b86a5a] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-[56px] bg-[#c97b6b] hover:bg-[#b86a5a] text-white text-[16px] font-semibold rounded-2xl transition-all shadow-lg shadow-[#c97b6b]/20 hover:shadow-xl hover:shadow-[#c97b6b]/30 mt-6"
          >
            {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>
        </form>

        {/* Toggle Login/Register */}
        <div className="mt-6 flex items-center gap-2">
          <p className="text-[14px] text-[#6e6e73]">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[14px] text-[#c97b6b] font-semibold hover:text-[#b86a5a] transition-colors"
          >
            {isLogin ? 'Registrarse' : 'Iniciar sesión'}
          </button>
        </div>

        {/* Privacy Note */}
        <p className="text-[12px] text-[#8e8e93] text-center mt-8 max-w-[300px] leading-relaxed">
          Al continuar, aceptas nuestros términos de servicio y política de privacidad médica.
        </p>
      </div>
    </div>
  );
}

function HardwareSetupScreen({ onComplete }: any) {
  const [step, setStep] = useState<'intro' | 'token' | 'ready'>('intro');

  if (step === 'intro') {
    return (
      <div className="bg-[#fdfcfb] min-h-screen w-full max-w-[390px] mx-auto flex flex-col">
        {/* Status Bar */}
        <div className="h-[47px] flex items-center justify-between px-4 pt-3">
          <span className="font-semibold text-[20px]">9:41</span>
          <div className="flex gap-1.5">
            <div className="w-[15px] h-[11px] bg-black rounded-sm"></div>
            <div className="w-[15px] h-[11px] bg-black rounded-sm"></div>
            <div className="w-[25px] h-[11px] bg-black rounded-sm"></div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
          {/* Icon */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#8faf74] to-[#7a9a63] flex items-center justify-center mb-8 shadow-xl">
            <Wifi size={48} className="text-white" strokeWidth={2} />
          </div>

          <h1 className="text-[28px] font-bold text-[#111] mb-4 text-center">
            Configuración de Dispositivo
          </h1>
          <p className="text-[16px] text-[#6e6e73] text-center max-w-[320px] mb-12 leading-relaxed">
            Vamos a vincular el Tótem con tu cuenta para que puedas comenzar a monitorear el bienestar de tu ser querido.
          </p>

          {/* Steps */}
          <div className="w-full max-w-[340px] space-y-4 mb-12">
            <StepItem
              number={1}
              title="Verificar código de enlace"
              description="El Tótem tiene un código único preconfigurado"
            />
            <StepItem
              number={2}
              title="Enchufar el Tótem"
              description="Tu ser querido solo necesita conectarlo a la corriente"
            />
            <StepItem
              number={3}
              title="Listo para usar"
              description="El sistema comenzará a funcionar automáticamente"
            />
          </div>

          <button
            onClick={() => setStep('token')}
            className="w-full max-w-[340px] h-[56px] bg-[#c97b6b] hover:bg-[#b86a5a] text-white text-[16px] font-semibold rounded-2xl transition-all shadow-lg shadow-[#c97b6b]/20"
          >
            Continuar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fdfcfb] min-h-screen w-full max-w-[390px] mx-auto flex flex-col">
      {/* Status Bar */}
      <div className="h-[47px] flex items-center justify-between px-4 pt-3">
        <span className="font-semibold text-[20px]">9:41</span>
        <div className="flex gap-1.5">
          <div className="w-[15px] h-[11px] bg-black rounded-sm"></div>
          <div className="w-[15px] h-[11px] bg-black rounded-sm"></div>
          <div className="w-[25px] h-[11px] bg-black rounded-sm"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-8 pb-12">
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

function DashboardScreen({ setActiveTab }: any) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard('CASA10')
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="px-4 pt-4 pb-6">Cargando resumen...</div>;
  if (!data) return <div className="px-4 pt-4 pb-6 text-red-500">Error cargando resumen</div>;

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-[28px] font-semibold text-[#111] mb-1">
        Cuidado de Manuel
      </h1>
      <p className="text-[16px] text-[#8e8e93] mb-6">
        Hoy
      </p>

      {/* Hero Status Card */}
      <div className="bg-white rounded-[20px] border border-[#d8d8de] shadow-lg p-5 flex flex-col items-center gap-3 mb-6">
        <div className="w-3 h-3 rounded-full bg-[#8faf74]"></div>
        <p className="text-[12px] text-[#8e8e93]">Estado actual</p>
        <h2 className="text-[36px] font-bold text-[#111]">Todo normal hoy</h2>
        <p className="text-[16px] text-[#6e6e73] text-center">
          La rutina de Manuel se mantiene dentro de lo esperado.
        </p>
        <p className="text-[12px] text-[#8e8e93]">Última actualización reciente</p>
      </div>

      <h3 className="text-[16px] font-medium text-black mb-4">Resumen de hoy</h3>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button onClick={() => setActiveTab('medicacion')} className="text-left w-full">
          <StatCard
            icon={<div className="w-3 h-3 rounded-full bg-[#c97b6b]"></div>}
            title="Medicación"
            value="Pendiente revisar"
            time=""
          />
        </button>
        <button onClick={() => setActiveTab('actividad')} className="text-left w-full">
          <StatCard
            icon={<Heart size={16} className="text-[#8faf74]" />}
            title="Actividad"
            value={`${data.pasosHoy || 0} pasos`}
            time={`${data.tiempoSala || '0h'}`}
          />
        </button>
      </div>

      {/* System Card */}
      <div className="bg-white rounded-[10px] border border-[#d8d8de] shadow-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#ebebf0] border border-[#d8d8de] flex items-center justify-center">
            <Settings size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[16px] font-medium text-[#111] mb-1">
              Lectura del sistema
            </p>
            <p className="text-[14px] text-[#8e8e93]">
              No se detectan anomalias relevantes
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <button className="w-full h-[56px] bg-[#1c1c1e] rounded-2xl text-white text-[16px] font-medium">
        Contactar a Manuel
      </button>
    </div>
  );
}

function StatCard({ icon, title, value, time }: any) {
  return (
    <div className="bg-white rounded-[20px] border border-[#d8d8de] p-4 flex flex-col items-center gap-2">
      {icon}
      <p className="text-[20px] font-semibold text-[#8e8e93]">{title}</p>
      <p className="text-[16px] font-medium text-[#111] text-center">{value}</p>
      <p className="text-[12px] text-[#6e6e73]">{time}</p>
    </div>
  );
}

function TimelineScreen() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline('CASA10')
      .then(res => {
        setEvents(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="px-4 pt-4 pb-6">
      <h1 className="text-[28px] font-semibold text-[#111] mb-1">
        El plan de hoy
      </h1>
      <p className="text-[16px] text-[#8e8e93] mb-6">
        Hoy
      </p>

      {/* Timeline - Hoy */}
      <div className="bg-white rounded-[10px] border border-[#d8d8de] shadow-lg p-4 mb-4">
        {loading ? (
          <p className="text-center py-4 text-[#8e8e93]">Cargando rutina...</p>
        ) : events.length === 0 ? (
          <p className="text-center py-4 text-[#8e8e93]">No hay eventos registrados hoy</p>
        ) : (
          events.map((event, index) => (
            <TimelineItem
              key={event.id || index}
              time={event.hora}
              title={event.titulo}
              subtitle={event.subtitulo}
              isLast={index === events.length - 1}
            />
          ))
        )}
      </div>

      {/* Activity Cards */}
      <ActivityCard
        icon="💧"
        title="Hidratacion"
        progress={60}
      />
      <ActivityCard
        icon="👣"
        title="Pasos"
        progress={40}
      />
      <ActivityCard
        icon="🍽️"
        title="Comida"
        progress={80}
      />
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
  const [formData, setFormData] = useState({
    nombre: '',
    dosis: '',
    horario: ''
  });

  const loadMedications = () => {
    setLoading(true);
    fetchMedications('CASA10')
      .then(res => {
        setMedications(res);
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
    addMedication({
      elder_id: 'CASA10',
      name: formData.nombre,
      dose: formData.dosis,
      schedule: formData.horario
    }).then(() => {
      setFormData({ nombre: '', dosis: '', horario: '' });
      setShowModal(false);
      loadMedications();
    }).catch(err => {
      console.error(err);
      alert('Error al guardar medicamento');
    });
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
              name={med.name}
              dose={med.dose}
              instructions=""
              time={med.schedule}
            />
          ))
        )}
      </div>

      {/* Add New Button */}
      <button
        onClick={() => setShowModal(true)}
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
              <h2 className="text-[24px] font-bold text-[#111]">Nuevo Medicamento</h2>
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
                  Horario
                </label>
                <input
                  type="text"
                  value={formData.horario}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                  className="w-full h-[48px] px-4 bg-white border border-[#d8d8de] rounded-xl text-[16px] focus:outline-none focus:border-[#c97b6b] focus:ring-2 focus:ring-[#c97b6b]/20 transition-all"
                  placeholder="Ej: 08:00"
                />
              </div>
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

function MedicationCard({ name, dose, instructions, time }: any) {
  return (
    <div className="bg-white rounded-[10px] border border-[#d8d8de] shadow-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <p className="text-[16px] font-medium text-[#c97b6b] mb-1">{name}</p>
          <p className="text-[14px] text-[#8e8e93]">{dose}</p>
        </div>
        <div className="w-2.5 h-2.5 rounded-full bg-[#c97b6b] mt-1.5"></div>
      </div>
      <div className="flex items-center justify-between text-[14px] text-[#c97b6b]">
        <span>{instructions}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}

function ActividadScreen() {
  const [patterns, setPatterns] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatterns('CASA10')
      .then(res => {
        setPatterns(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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

      {/* Resumen Card - Filled Area Chart */}
      <div className="bg-white rounded-[10px] border border-[#d8d8de] shadow-lg p-5 mb-6">
        <h3 className="text-[20px] font-semibold text-[#c97b6b] mb-4">Resumen Semanal</h3>
        <div className="h-[80px] w-full relative">
          <svg className="w-full h-full" viewBox="0 0 353 80" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c97b6b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#c97b6b" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d="M0 50 L50 30 L100 45 L150 20 L200 35 L250 25 L300 40 L353 15 L353 80 L0 80 Z"
              fill="url(#areaGradient)"
            />
            <path
              d="M0 50 L50 30 L100 45 L150 20 L200 35 L250 25 L300 40 L353 15"
              stroke="#C97B6B"
              strokeWidth="2.5"
              fill="none"
            />
            {[0, 50, 100, 150, 200, 250, 300, 353].map((x, i) => {
              const y = [50, 30, 45, 20, 35, 25, 40, 15][i];
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#C97B6B"
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {loading ? (
          <div className="col-span-2 text-center text-[#8e8e93]">Cargando patrones...</div>
        ) : !patterns ? (
          <div className="col-span-2 text-center text-red-500">Error cargando patrones</div>
        ) : (
          <>
            <ActivityMetricCard title="Pasos" value={patterns.pasos?.[0]?.valor || 0} type="bars" />
            <ActivityMetricCard title="Movimiento" value={patterns.movimiento?.[0]?.valor || 0} type="wave" />
            <ActivityMetricCard title="Frecuencia Cardiaca" value={patterns.ritmoCardiaco?.[0]?.valor || 0} unit="bpm" type="pulse" />
            <ActivityMetricCard title="Tiempo Sala" value={patterns.tiempoSala?.[0]?.valor || 0} unit="min" type="bars" />
          </>
        )}
      </div>
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
      <h1 className="text-[28px] font-semibold text-[#c97b6b] mb-6">Hoy</h1>

      <AlertSection title="Ayer" alerts={[
        {
          title: 'Rutina estable',
          message: 'Sin cambios relevantes',
          time: 'Ayer, 18:30'
        },
        {
          title: 'Movimiento detectado',
          message: 'Actividad dentro de lo normal',
          time: 'Ayer, 15:10'
        }
      ]} />

      <AlertSection title="Ultimos 7 dias" alerts={[
        {
          title: 'Medicación completada',
          message: 'Cumplimiento sin incidencias',
          time: 'Lunes'
        },
        {
          title: 'Variación leve en rutina',
          message: 'Cambio en horario habitual',
          time: 'Domingo'
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

function AjustesScreen() {
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings('CASA10')
      .then(res => {
        setUserSettings(res);
      })
      .catch(err => console.error('Error fetching settings', err));
  }, []);

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

  return (
    <div className="px-4 pt-4 pb-6 bg-white">
      <h1 className="text-[28px] font-semibold text-[#111] mb-8">Ajustes</h1>

      <div className="bg-white">
        {settingsMenu.map((setting, i) => (
          <button
            key={i}
            onClick={() => setOpenPanel(setting)}
            className="w-full flex items-center justify-between py-4 border-b border-[#d8d8de] hover:bg-[#fdfcfb] transition-colors"
          >
            <span className="text-[18px] text-[#c97b6b] font-normal">{setting}</span>
            <ChevronRight size={20} className="text-[#c97b6b]" />
          </button>
        ))}
      </div>

      {/* Settings Panel */}
      {openPanel && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setOpenPanel(null)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-[85%] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#d8d8de]">
                <h2 className="text-[20px] font-semibold text-[#111]">{openPanel}</h2>
                <button
                  onClick={() => setOpenPanel(null)}
                  className="w-8 h-8 rounded-full bg-[#ebebf0] flex items-center justify-center hover:bg-[#d8d8de] transition-colors"
                >
                  <X size={18} className="text-[#111]" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <p className="text-[16px] text-[#6e6e73] mb-4">
                  Configuración de {openPanel.toLowerCase()}
                </p>
                <div className="space-y-3">
                  <div className="bg-[#fdfcfb] rounded-lg p-4 border border-[#d8d8de]">
                    <p className="text-[14px] text-[#8e8e93]">
                      {(openPanel === 'Notificaciones' && userSettings?.notificaciones) ? 'Las notificaciones están activadas.' : 
                       (openPanel === 'Alertas' && userSettings?.alertas) ? 'Las alertas están activadas.' : 
                       'Las opciones de configuración para esta sección aparecerán aquí.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
