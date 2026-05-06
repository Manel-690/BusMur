import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useProfile } from "../hooks/useProfile";
import toast from "react-hot-toast";

export default function Configuracoes() {
  const { user } = useAuth();
  const { updateProfile, uploadAvatar, loading } = useProfile(user);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);

  const formatPhone = (value) => {
    const nums = value.replace(/\D/g, "").slice(0, 11);
    if (nums.length <= 2) return nums.length ? `(${nums}` : "";
    if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
    return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  };

  async function handleSave() {
    try {
      let avatarUrl = null;

      if (fileRef.current?.files[0]) {
        avatarUrl = await uploadAvatar(fileRef.current.files[0]);
      }

      await updateProfile({
        name,
        phone: phone.replace(/\D/g, ""),
        avatar_url: avatarUrl,
      });

      toast.success("Perfil atualizado!");
    } catch (err) {
      toast.error("Erro ao salvar.");
    }
  }

  const roleLabels = { passenger: "Passageiro", driver: "Motorista", admin: "Administrador" };
  const roleColors = { passenger: "#1d4ed8", driver: "#059669", admin: "#7c3aed" };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Configurações</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Seus dados pessoais</p>
          </div>
        </div>
      </div>

      <div className="card p-6 space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold" style={{ background: roleColors[user?.role] || "#1d4ed8" }}>
                {user?.name?.[0] || "?"}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-800 dark:text-white text-lg">{user?.name}</p>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: roleColors[user?.role] + "22", color: roleColors[user?.role] }}>
              {roleLabels[user?.role]}
            </span>
            <br />
            <label className="inline-block mt-2 text-xs font-semibold text-blue-500 hover:text-blue-600 cursor-pointer">
              📷 Alterar foto
              <input type="file" accept="image/*" ref={fileRef} onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Dados */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Nome completo</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">E-mail</label>
            <input className="input-field bg-gray-50 dark:bg-gray-800/40" value={user?.email || ""} disabled />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">CPF</label>
            <input className="input-field bg-gray-50 dark:bg-gray-800/40" value={user?.cpf || "Não informado"} disabled />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Telefone</label>
            <input className="input-field" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} maxLength={15} placeholder="(32) 99999-9999" />
          </div>
          {user?.role === "driver" && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Status: {user?.driver_status === "approved" ? "Aprovado" : user?.driver_status === "pending" ? "Pendente" : "Rejeitado"}
              </p>
            </div>
          )}
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary w-full">
          {loading ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </div>
  );
}