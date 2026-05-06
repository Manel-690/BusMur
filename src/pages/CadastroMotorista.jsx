import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";

export default function CadastroMotorista() {
  const navigate = useNavigate();
  const { registerDriver } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: "", email: "", cpf: "", telefone: "", senha: "",
    cnh_arquivo: null, cnh_preview: null
  });

  const formatCPF = (value) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `${nums.slice(0, 3)}.${nums.slice(3)}`;
    if (nums.length <= 9) return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6)}`;
    return `${nums.slice(0, 3)}.${nums.slice(3, 6)}.${nums.slice(6, 9)}-${nums.slice(9)}`;
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm((f) => ({ ...f, cnh_arquivo: file, cnh_preview: url }));
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.email || !form.cpf || !form.senha || !form.cnh_arquivo) {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);
    try {
      await registerDriver({
        name: form.nome,
        email: form.email,
        password: form.senha,
        cpf: form.cpf.replace(/\D/g, ""),
        cnhFile: form.cnh_arquivo 
      });
      setStep(3);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#080c14] flex items-center justify-center transition-colors relative overflow-hidden">
      <div className="absolute inset-0 map-bg opacity-30 pointer-events-none"/>

      <div className="relative z-10 w-full max-w-lg mx-4">
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Voltar ao login
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg" style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                <line x1="12" y1="2" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="22"/>
                <line x1="2" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="22" y2="12"/>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">Cadastro de Motorista</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Seu cadastro será analisado pelo administrador</p>
        </div>

        {step < 3 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400"}`}
                  style={step >= s ? { background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" } : {}}>
                  {s}
                </div>
                {s < 2 && <div className={`w-16 h-1 rounded-full ${step > s ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`}/>}
              </div>
            ))}
          </div>
        )}

        <div className="card p-7 shadow-xl">
          {step === 1 && (
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white mb-5">Dados Pessoais</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Nome completo</label>
                  <input className="input-field" placeholder="Seu nome completo" value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">CPF</label>
                    <input className="input-field" placeholder="000.000.000-00" value={form.cpf} onChange={(e) => setForm((f) => ({ ...f, cpf: formatCPF(e.target.value) }))} maxLength={14}/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Telefone</label>
                    <input className="input-field" placeholder="(32) 99999-9999" value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))}/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">E-mail</label>
                  <input type="email" className="input-field" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Senha</label>
                  <input type="password" className="input-field" placeholder="Crie uma senha segura" value={form.senha} onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}/>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full mt-2">Próximo — Enviar CNH</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-bold text-gray-800 dark:text-white mb-2">Imagem da CNH</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Envie uma foto clara e legível da sua CNH</p>
              <label className={`flex flex-col items-center justify-center gap-3 w-full h-52 rounded-xl border-2 border-dashed cursor-pointer transition-all ${form.cnh_preview ? "border-blue-400" : "border-gray-300 dark:border-gray-600 hover:border-blue-400"}`}>
                {form.cnh_preview ? (
                  <img src={form.cnh_preview} alt="CNH" className="h-full w-full object-cover rounded-xl"/>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10">
                      <rect x="3" y="3" width="18" height="14" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/><path d="M3 17l5-5 3 3"/>
                    </svg>
                    <p className="text-sm font-semibold">Clique para selecionar imagem</p>
                    <p className="text-xs">JPG, PNG — máx 5MB</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile}/>
              </label>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Voltar</button>
                <button onClick={handleSubmit} disabled={loading || !form.cnh_arquivo} className="btn-primary flex-1">
                  {loading ? "Enviando..." : "Enviar cadastro"}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-amber-100 dark:bg-amber-900/30">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-amber-500">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">Cadastro enviado!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Aguardando <strong className="text-amber-600">aprovação</strong> do administrador.
              </p>
              <Link to="/login" className="btn-primary justify-center inline-flex">Voltar ao login</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}