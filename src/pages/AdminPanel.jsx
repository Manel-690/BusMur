import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Badge from "../components/Badge";
import MapView from "../components/MapView";
import toast from "react-hot-toast";

// Ícones SVG modernos
const Ic = {
  pending: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  approved: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  rejected: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  lines: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  driver: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  bus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M7 19v2M17 19v2"/></svg>,
  eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  edit: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  xmark: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  map: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>,
};

export default function AdminPanel() {
  const [tab, setTab] = useState("motoristas");
  const [pendentes, setPendentes] = useState([]);
  const [aprovados, setAprovados] = useState([]);
  const [rejeitados, setRejeitados] = useState([]);
  const [linhas, setLinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cnhModal, setCnhModal] = useState(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: pending } = await supabase.from("profiles").select("*").eq("role", "driver").eq("driver_status", "pending");
    const { data: approved } = await supabase.from("profiles").select("*").eq("role", "driver").eq("driver_status", "approved");
    const { data: rejected } = await supabase.from("profiles").select("*").eq("role", "driver").eq("driver_status", "rejected");
    const { data: lines } = await supabase.from("lines").select("*");
    setPendentes(pending || []);
    setAprovados(approved || []);
    setRejeitados(rejected || []);
    setLinhas(lines || []);
    setLoading(false);
  }

  async function aprovar(id) {
    await supabase.from("profiles").update({ driver_status: "approved" }).eq("id", id);
    toast.success("Motorista aprovado!");
    fetchData();
  }

  async function rejeitar(id) {
    await supabase.from("profiles").update({ driver_status: "rejected" }).eq("id", id);
    toast.error("Motorista rejeitado.");
    fetchData();
  }

  const getCnhUrl = (fileName) => {
    if (!fileName) return "";
    if (fileName.startsWith("http")) return fileName;
    return supabase.storage.from("driver-docs").getPublicUrl(fileName).data.publicUrl;
  };

  const stats = [
    { label: "Pendentes", value: pendentes.length, icon: Ic.pending, color: "#d97706", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Aprovados", value: aprovados.length, icon: Ic.approved, color: "#059669", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Rejeitados", value: rejeitados.length, icon: Ic.rejected, color: "#dc2626", bg: "bg-red-50 dark:bg-red-900/20" },
    { label: "Linhas", value: linhas.length, icon: Ic.lines, color: "#1d4ed8", bg: "bg-blue-50 dark:bg-blue-900/20" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center animate-pulse">{Ic.shield}</div>
          <p className="text-sm text-gray-400">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>{Ic.shield}</div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Painel Administrativo</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gerenciamento do sistema BusMur</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>Atualizado agora</div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`card p-5 ${s.bg} border-0`}>
            <div className="flex items-center justify-between">
              <span className="text-3xl" style={{ color: s.color }}>{s.icon}</span>
              <div className="text-right"><p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p><p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{s.label}</p></div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit">
        {[
          { id: "motoristas", label: "Motoristas", icon: Ic.driver },
          { id: "linhas", label: "Linhas", icon: Ic.lines },
          { id: "mapa", label: "Mapa ao vivo", icon: Ic.map },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-md" : "text-gray-500 dark:text-gray-400"}`}>
            {t.icon}{t.label}
            {t.id === "motoristas" && pendentes.length > 0 && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{pendentes.length}</span>}
          </button>
        ))}
      </div>

      {tab === "motoristas" && (
        <div className="space-y-6">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4"><span className="w-2 h-2 rounded-full bg-amber-500"/>Aguardando aprovação ({pendentes.length})</h2>
            {pendentes.length === 0 ? (
              <div className="card p-10 text-center border-dashed"><div className="text-4xl mb-3" style={{ color: "#059669" }}>{Ic.approved}</div><p className="font-semibold text-gray-600 dark:text-gray-400">Nenhum motorista pendente</p></div>
            ) : (
              <div className="grid gap-4">
                {pendentes.map((m) => (
                  <div key={m.id} className="card p-5 border-l-4 border-amber-400 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center" style={{ color: "#d97706" }}>{Ic.driver}</div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white text-lg">{m.name}</p>
                          <div className="flex items-center gap-3 mt-1"><span className="text-sm text-gray-500">{m.email}</span><span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">CPF: {m.cpf}</span></div>
                          <div className="flex items-center gap-2 mt-2">
                            {m.cnh_image && <button onClick={() => setCnhModal(m.cnh_image)} className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600">{Ic.eye} Visualizar CNH</button>}
                            <Badge type="pending">pendente</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => aprovar(m.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25">{Ic.check} Aprovar</button>
                        <button onClick={() => rejeitar(m.id)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25">{Ic.xmark} Rejeitar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {aprovados.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4"><span className="w-2 h-2 rounded-full bg-emerald-500"/>Aprovados ({aprovados.length})</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {aprovados.map((m) => (
                  <div key={m.id} className="card p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center" style={{ color: "#059669" }}>{Ic.bus}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-800 dark:text-white truncate">{m.name}</p><p className="text-xs text-gray-500 truncate">{m.email}</p></div>
                    <Badge type="approved">aprovado</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {rejeitados.length > 0 && (
            <div>
              <h2 className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4"><span className="w-2 h-2 rounded-full bg-red-500"/>Rejeitados ({rejeitados.length})</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {rejeitados.map((m) => (
                  <div key={m.id} className="card p-4 flex items-center gap-3 opacity-60">
                    <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center" style={{ color: "#dc2626" }}>{Ic.xmark}</div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-800 dark:text-white truncate">{m.name}</p><p className="text-xs text-gray-500 truncate">{m.email}</p></div>
                    <Badge type="rejected">rejeitado</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "linhas" && (
        <div>
          <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Linhas cadastradas</h2><button className="btn-primary text-sm py-2 px-4">+ Nova linha</button></div>
          <div className="grid gap-3">
            {linhas.length === 0 && <div className="card p-10 text-center border-dashed"><div className="text-4xl mb-3" style={{ color: "#1d4ed8" }}>{Ic.lines}</div><p className="font-semibold text-gray-600 dark:text-gray-400">Nenhuma linha cadastrada</p></div>}
            {linhas.map((l) => (
              <div key={l.id} className="card p-5 flex items-center gap-4 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black mono shadow-lg" style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}>{l.code}</div>
                <div className="flex-1 min-w-0"><p className="font-bold text-gray-800 dark:text-white">{l.name}</p><p className="text-xs text-gray-500">{l.schedule || "Horários não definidos"}</p></div>
                <Badge type={l.status}>{l.status || "ativa"}</Badge>
                <button className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">{Ic.edit}</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "mapa" && (
        <div>
          <h2 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">Monitoramento em tempo real</h2>
          <div className="card overflow-hidden rounded-2xl" style={{ height: "500px" }}><MapView adminMode={true}/></div>
        </div>
      )}

      {cnhModal && (
        <div onClick={() => setCnhModal(null)} className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"><h3 className="font-bold text-gray-800 dark:text-white">CNH do Motorista</h3><button onClick={() => setCnhModal(null)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">{Ic.xmark}</button></div>
            <div className="p-4 flex justify-center bg-gray-50 dark:bg-gray-800/50"><img src={getCnhUrl(cnhModal)} alt="CNH" className="w-full h-auto object-contain max-h-[70vh] rounded-xl shadow-sm"/></div>
          </div>
        </div>
      )}
    </div>
  );
}