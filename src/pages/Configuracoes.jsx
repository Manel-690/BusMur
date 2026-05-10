import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useProfile } from "../hooks/useProfile";
import toast from "react-hot-toast";

export default function Configuracoes() {
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [dadosOriginais, setDadosOriginais] = useState({});

  const { updateProfile, loading } = useProfile(user);

  useEffect(() => {
    async function getInitialData() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profile) {
          const info = {
            name: profile.name || "",
            phone: profile.phone || "",
            email: authUser.email || "",
            cpf: profile.cpf || "Não informado",
            role: profile.role || "passenger",
            avatar_url: profile.avatar_url || ""
          };
          setNome(info.name);
          setTelefone(info.phone);
          setEmail(info.email);
          setCpf(info.cpf);
          setRole(info.role);
          setAvatarUrl(info.avatar_url);
          setDadosOriginais(info);
        }
      }
    }
    getInitialData();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleSalvar = async () => {
    const mudouNome = nome !== dadosOriginais.name;
    const mudouTelefone = telefone !== dadosOriginais.phone;
    const mudouFoto = avatarFile !== null;

    if (!mudouNome && !mudouTelefone && !mudouFoto) {
      return toast.error("Nada foi alterado!");
    }

    try {
      await updateProfile({ name: nome, phone: telefone, avatarFile: avatarFile });
      window.location.reload(); 
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return <div className="p-8 text-white">Carregando...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Configurações</h1>
          <p className="text-gray-400 text-sm">Seus dados pessoais</p>
        </div>
      </div>

      <div className="bg-[#1a1f2e] border border-gray-800 rounded-2xl p-8 shadow-xl">
        {/* Seção do Avatar com Cargo Correto */}
        <div className="flex items-center gap-6 mb-8 p-4 bg-[#111827]/50 rounded-xl">
          <div className="relative">
            <img 
              src={avatarUrl || `https://ui-avatars.com/api/?name=${nome}&background=6366f1&color=fff`} 
              alt="Avatar" 
              className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-500/30 shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{nome || "Usuário"}</h2>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md uppercase tracking-wider">
              {role === 'admin' ? 'Administrador' : role === 'driver' ? 'Motorista' : 'Passageiro'}
            </span>
            <label className="flex items-center gap-2 mt-3 text-sm text-indigo-400 hover:text-indigo-300 cursor-pointer transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Alterar foto
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        {/* Formulário com todos os campos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Nome completo</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)}
              className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">E-mail</label>
            <input type="text" value={email} disabled
              className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 opacity-50 cursor-not-allowed" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">CPF</label>
            <input type="text" value={cpf} disabled
              className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 opacity-50 cursor-not-allowed" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-2">Telefone</label>
            <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)}
              className="w-full bg-[#111827] border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all" />
          </div>
        </div>

        <button onClick={handleSalvar} disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]">
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}