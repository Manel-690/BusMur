import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

const roles = [
  { id: "passenger", label: "Passageiro", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  )},
  { id: "driver", label: "Motorista", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
      <line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/>
    </svg>
  )},
  { id: "admin", label: "Administrador", icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )},
];

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { level: 1, label: "Fraca", color: "bg-red-500" };
  if (score <= 2) return { level: 2, label: "Média", color: "bg-amber-500" };
  if (score <= 3) return { level: 3, label: "Boa", color: "bg-blue-500" };
  return { level: 4, label: "Forte", color: "bg-emerald-500" };
}

export default function Login() {
  const { login, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("passenger");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(password);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, selectedRole);
      toast.success("Bem-vindo ao BusMur!");
      const paths = { passenger: "/linhas", driver: "/motorista", admin: "/admin" };
      navigate(paths[selectedRole]);
    } catch (err) {
      console.error("Erro login:", err);
      toast.error(err.message || "E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#080c14] transition-colors relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #1d4ed8, transparent)" }}/>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #0ea5e9, transparent)" }}/>
        <div className="absolute inset-0 map-bg opacity-40"/>
      </div>

      <button onClick={toggleTheme} className="absolute top-6 right-6 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 shadow-sm hover:shadow-md transition-all">
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="5"/></svg>
        )}
      </button>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-white shadow-xl mb-4" style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-7 h-7">
              <rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M7 19v2M17 19v2"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Bus<span className="text-blue-500">Mur</span></h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Transporte público de Muriaé</p>
        </div>

        <div className="card p-7 shadow-xl">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5">Entrar no sistema</h2>

          {/* Botões de perfil */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-center transition-all ${
                  selectedRole === r.id
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {r.icon}
                <span className={`text-[11px] font-bold ${selectedRole === r.id ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"}`}>
                  {r.label}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">E-mail</label>
              <input type="email" className="input-field" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Senha</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} className="input-field pr-10" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (<div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : "bg-gray-200 dark:bg-gray-700"}`} />))}
                  </div>
                  <p className={`text-[10px] font-semibold ${strength.level <= 1 ? "text-red-500" : strength.level <= 2 ? "text-amber-500" : strength.level <= 3 ? "text-blue-500" : "text-emerald-500"}`}>Senha {strength.label}</p>
                </div>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">{loading ? "Entrando..." : "Entrar"}</button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 text-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Não tem conta? <Link to="/cadastro-usuario" className="text-blue-500 font-semibold hover:text-blue-600">Cadastre-se</Link></p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Motorista? <Link to="/cadastro-motorista" className="text-blue-500 font-semibold hover:text-blue-600">Solicite seu cadastro</Link></p>
          </div>

          {/* NOVO BOTÃO DE INSTALAÇÃO NO LOGIN */}
          <div className="mt-4 px-2">
            <Link to="/instalar" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-300 transition-all group">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400 group-hover:text-blue-500">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400 group-hover:text-blue-600">Instalar App BusMur no Celular</span>
            </Link>
          </div>

        </div>
        <p className="text-center text-xs text-gray-400 mt-6">© {new Date().getFullYear()} BusMur — Prefeitura de Muriaé</p>
      </div>
    </div>
  );
}