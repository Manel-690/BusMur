import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";

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

export default function CadastroUsuario() {
  const { registerPassenger } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const formatPhone = (value) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return nums.length ? `(${nums}` : "";
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  const formatCPF = (value) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error("Digite seu nome completo.");
    if (!cpf || cpf.replace(/\D/g, "").length !== 11) return toast.error("CPF inválido.");
    if (!phone || phone.replace(/\D/g, "").length < 10) return toast.error("Telefone inválido.");
    if (password.length < 6) return toast.error("Senha deve ter no mínimo 6 caracteres.");
    if (password !== confirmPassword) return toast.error("Senhas não conferem.");

    setLoading(true);
    try {
      await registerPassenger({ name, email, password, phone: phone.replace(/\D/g, ""), cpf: cpf.replace(/\D/g, "") });
      toast.success("Cadastro realizado! Faça login.");
      navigate("/login");
    } catch (err) {
      toast.error("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
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
              <rect x="2" y="5" width="20" height="14" rx="3"/>
              <path d="M2 10h20M7 19v2M17 19v2M6 14h.01M18 14h.01"/>
            </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Bus<span className="text-blue-500">Mur</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Criar conta de passageiro</p>
        </div>

        <div className="card p-7 shadow-xl">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-5">Cadastro</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Nome completo</label>
              <input type="text" className="input-field" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">CPF</label>
              <input type="text" className="input-field" placeholder="000.000.000-00" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} maxLength={14} required />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Telefone / WhatsApp</label>
              <input type="text" className="input-field" placeholder="(00) 00000-0000" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} maxLength={15} required />
            </div>
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
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
            <div>
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Confirmar senha</label>
              <input type="password" className="input-field" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>
          </form>
          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Já tem conta? <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600">Fazer login</Link></p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">© {new Date().getFullYear()} BusMur — Prefeitura de Muriaé</p>
      </div>
    </div>
  );
}