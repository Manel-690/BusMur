import { useState } from "react";
import { Link } from "react-router-dom";
import { LINHAS } from "../lib/mockData";
import Badge from "../components/Badge";

function LotacaoBar({ lotacao }) {
  const map = { baixa: { w: "33%", color: "#059669" }, média: { w: "66%", color: "#d97706" }, alta: { w: "100%", color: "#dc2626" } };
  const { w, color } = map[lotacao] || { w: "0%", color: "#gray" };
  return (
    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: w, background: color }}/>
    </div>
  );
}

export default function Linhas() {
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todas");

  const filtered = LINHAS.filter((l) => {
    const matchSearch = l.nome.toLowerCase().includes(search.toLowerCase()) || l.numero.includes(search);
    const matchStatus = filtroStatus === "todas" || l.status === filtroStatus;
    return matchSearch && matchStatus;
  });

  const counts = { ativas: LINHAS.filter((l) => l.status === "ativa").length, atrasadas: LINHAS.filter((l) => l.status === "atrasada").length };

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Linhas de Ônibus</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Muriaé — {LINHAS.length} linhas cadastradas</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total de linhas", value: LINHAS.length, icon: "🚌", color: "#1d4ed8" },
          { label: "Operando agora", value: counts.ativas, icon: "✅", color: "#059669" },
          { label: "Com atraso", value: counts.atrasadas, icon: "⚠️", color: "#d97706" },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                <p className="text-2xl font-black mt-1" style={{ color: s.color }}>{s.value}</p>
              </div>
              <span className="text-2xl">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="input-field pl-10"
            placeholder="Buscar linha por nome ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["todas", "ativa", "atrasada", "inativa"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltroStatus(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filtroStatus === f ? "text-white shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
              style={filtroStatus === f ? { background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" } : {}}
            >
              {f === "todas" ? "Todas" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de linhas */}
      <div className="space-y-3">
        {filtered.map((linha) => (
          <Link key={linha.id} to={`/linhas/${linha.id}`} className="card p-5 block card-hover group cursor-pointer">
            <div className="flex items-start gap-4">
              {/* Número da linha */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md mono" style={{ background: linha.cor }}>
                {linha.numero}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {linha.nome}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {linha.paradas.length} paradas · {linha.frequencia} de frequência
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge type={linha.status}>{linha.status}</Badge>
                  </div>
                </div>

                {linha.status !== "inativa" && (
                  <div className="mt-3 flex items-center gap-4">
                    {/* Tempo espera */}
                    <div className="flex items-center gap-1.5">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-blue-500">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mono">{linha.tempo_espera}</span>
                    </div>

                    {/* Lotação */}
                    {linha.lotacao && (
                      <div className="flex items-center gap-2 flex-1 max-w-32">
                        <LotacaoBar lotacao={linha.lotacao}/>
                        <span className="text-[11px] text-gray-500 dark:text-gray-400 shrink-0">{linha.lotacao}</span>
                      </div>
                    )}

                    {/* Passageiros */}
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      {linha.passageiros}
                    </div>
                  </div>
                )}

                {/* Alerta de atraso */}
                {linha.status === "atrasada" && linha.motivo_atraso && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                    <span>⚠️</span>
                    <span>{linha.motivo_atraso}</span>
                  </div>
                )}
              </div>

              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-300 dark:text-gray-700 group-hover:text-blue-400 transition-colors shrink-0 mt-1">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-semibold">Nenhuma linha encontrada</p>
            <p className="text-sm mt-1">Tente outro termo de busca</p>
          </div>
        )}
      </div>
    </div>
  );
}
