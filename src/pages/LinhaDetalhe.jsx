import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LINHAS } from "../lib/mockData";
import Badge from "../components/Badge";
import MapView from "../components/MapView";

export default function LinhaDetalhe() {
  const { id } = useParams();
  const linha = LINHAS.find((l) => l.id === id);
  const [tab, setTab] = useState("horarios");

  if (!linha) return (
    <div className="text-center py-20">
      <p className="text-4xl mb-3">🚌</p>
      <p className="font-bold text-gray-700 dark:text-gray-300">Linha não encontrada</p>
      <Link to="/linhas" className="text-blue-500 text-sm mt-2 block">Voltar às linhas</Link>
    </div>
  );

  // Simula previsão de chegada
  const agora = new Date();
  const proximosHorarios = linha.horarios
    .map((h) => {
      const [hh, mm] = h.split(":").map(Number);
      const t = new Date(); t.setHours(hh, mm, 0);
      return { hora: h, diff: Math.round((t - agora) / 60000) };
    })
    .filter((h) => h.diff > 0)
    .slice(0, 4);

  return (
    <div>
      {/* Back */}
      <Link to="/linhas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Voltar
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg mono" style={{ background: linha.cor }}>
          {linha.numero}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black text-gray-900 dark:text-white">{linha.nome}</h1>
            <Badge type={linha.status}>{linha.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {linha.paradas.length} paradas · Frequência: {linha.frequencia}
            {linha.motorista && <span> · Motorista: <strong className="text-gray-700 dark:text-gray-300">{linha.motorista}</strong></span>}
          </p>
        </div>
      </div>

      {/* Previsão de chegada */}
      {linha.status !== "inativa" && proximosHorarios.length > 0 && (
        <div className="card p-5 mb-5 border-l-4" style={{ borderLeftColor: linha.cor }}>
          <div className="flex items-center gap-3 mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" style={{ color: linha.cor }}>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <h2 className="font-bold text-gray-800 dark:text-white">Previsão de chegada</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {proximosHorarios.map((h, i) => (
              <div key={h.hora} className={`text-center p-3 rounded-xl ${i === 0 ? "text-white shadow-md" : "bg-gray-50 dark:bg-gray-800/50"}`}
                style={i === 0 ? { background: linha.cor } : {}}>
                <p className={`text-xl font-black mono ${i === 0 ? "text-white" : "text-gray-800 dark:text-white"}`}>
                  {h.diff}m
                </p>
                <p className={`text-xs font-semibold mt-0.5 ${i === 0 ? "text-white/80" : "text-gray-500 dark:text-gray-400"}`}>
                  {h.hora}
                </p>
                {i === 0 && <p className="text-[10px] text-white/70 mt-0.5">próximo</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atraso warning */}
      {linha.status === "atrasada" && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-5 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold text-amber-800 dark:text-amber-400 text-sm">Linha com atraso</p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">{linha.motivo_atraso}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl w-fit">
        {["horarios", "paradas", "mapa"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            {t === "horarios" ? "Horários" : t === "paradas" ? "Paradas" : "Mapa"}
          </button>
        ))}
      </div>

      {/* Tab: Horários */}
      {tab === "horarios" && (
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">Grade de horários completa</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {linha.horarios.map((h) => {
              const [hh, mm] = h.split(":").map(Number);
              const t = new Date(); t.setHours(hh, mm, 0);
              const passou = t < new Date();
              return (
                <div key={h} className={`text-center py-2 px-3 rounded-xl mono text-sm font-bold transition-all ${passou ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600" : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"}`}>
                  {h}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">* Horários em cinza já passaram</p>
        </div>
      )}

      {/* Tab: Paradas */}
      {tab === "paradas" && (
        <div className="card p-5">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">Trajeto completo</h2>
          <div className="space-y-0">
            {linha.paradas.map((parada, i) => (
              <div key={parada} className="flex items-start gap-4">
                <div className="flex flex-col items-center shrink-0">
                  <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 shadow ${i === 0 || i === linha.paradas.length - 1 ? "w-5 h-5" : ""}`}
                    style={{ background: i === 0 ? "#059669" : i === linha.paradas.length - 1 ? "#dc2626" : linha.cor }}/>
                  {i < linha.paradas.length - 1 && <div className="w-0.5 h-8 mt-1" style={{ background: linha.cor + "50" }}/>}
                </div>
                <div className="pb-8 flex-1">
                  <p className={`text-sm font-semibold ${i === 0 ? "text-emerald-600 dark:text-emerald-400" : i === linha.paradas.length - 1 ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"}`}>
                    {parada}
                  </p>
                  {(i === 0 || i === linha.paradas.length - 1) && (
                    <span className="text-[10px] font-bold uppercase text-gray-400">{i === 0 ? "Origem" : "Destino"}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Mapa */}
      {tab === "mapa" && (
        <div className="card overflow-hidden" style={{ height: "420px" }}>
          <MapView selectedLinha={linha.numero}/>
        </div>
      )}
    </div>
  );
}
