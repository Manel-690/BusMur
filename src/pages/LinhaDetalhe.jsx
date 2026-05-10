import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LINHAS } from "../lib/mockData";
import Badge from "../components/Badge";
import MapView from "../components/MapView";

const Ic = {
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  warning: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  calendar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  refresh: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  bus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20M7 19v2M17 19v2"/></svg>,
};

export default function LinhaDetalhe() {
  const { id } = useParams();
  const linha = LINHAS.find((l) => l.id === id);
  const [tab, setTab] = useState("horarios");
  const [diaUtil, setDiaUtil] = useState(true);

  if (!linha) return (
    <div className="text-center py-20">
      <div className="text-4xl mb-3 flex justify-center" style={{ color: "#1d4ed8" }}>{Ic.bus}</div>
      <p className="font-bold text-gray-700 dark:text-gray-300">Linha não encontrada</p>
      <Link to="/linhas" className="text-blue-500 text-sm mt-2 block hover:underline">Voltar às linhas</Link>
    </div>
  );

  const horariosAtivos = diaUtil ? linha.horarios : linha.horariosFimDeSemana;
  const agora = new Date();
  const proximosHorarios = horariosAtivos
    .map((h) => {
      const [hh, mm] = h.split(":").map(Number);
      const t = new Date(); t.setHours(hh, mm, 0);
      return { hora: h, diff: Math.round((t - agora) / 60000) };
    })
    .filter((h) => h.diff > 0)
    .slice(0, 4);

  return (
    <div>
      <Link to="/linhas" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors mb-6">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>
        Voltar
      </Link>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-lg mono shrink-0" style={{ background: linha.cor }}>{linha.numero}</div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-black text-gray-900 dark:text-white">{linha.nome}</h1>
            <Badge type={linha.status}>{linha.status}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {linha.paradas.length} paradas · Frequência: {linha.frequencia}
            {linha.motorista && <span> · Motorista: <strong className="text-gray-700 dark:text-gray-300">{linha.motorista}</strong></span>}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {linha.funcionaFimDeSemana && <span className="text-xs text-purple-600 font-semibold flex items-center gap-1">{Ic.calendar} Funciona fim de semana</span>}
            {linha.trocaMotorista && <span className="text-xs text-gray-500 flex items-center gap-1">{Ic.refresh} Troca de motorista: {linha.trocaMotorista}</span>}
          </div>
        </div>
      </div>

      {linha.status !== "inativa" && proximosHorarios.length > 0 && (
        <div className="card p-5 mb-5 border-l-4 rounded-r-xl bg-white dark:bg-gray-900 shadow-sm" style={{ borderLeftColor: linha.cor }}>
          <div className="flex items-center gap-3 mb-4">
            <div style={{ color: linha.cor }}>{Ic.clock}</div>
            <h2 className="font-bold text-gray-800 dark:text-white">Previsão de chegada</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {proximosHorarios.map((h, i) => (
              <div key={h.hora} className={`text-center p-3 rounded-xl ${i === 0 ? "text-white shadow-md" : "bg-gray-50 dark:bg-gray-800/50"}`}
                style={i === 0 ? { background: linha.cor } : {}}>
                <p className={`text-xl font-black mono ${i === 0 ? "text-white" : "text-gray-800 dark:text-white"}`}>{h.diff}m</p>
                <p className={`text-xs font-semibold mt-0.5 ${i === 0 ? "text-white/80" : "text-gray-500"}`}>{h.hora}</p>
                {i === 0 && <p className="text-[10px] text-white/70 mt-0.5 uppercase tracking-wide">próximo</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {linha.status === "atrasada" && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-5 flex items-start gap-3">
          <div className="text-amber-500 shrink-0">{Ic.warning}</div>
          <div>
            <p className="font-bold text-amber-800 dark:text-amber-400 text-sm">Linha com atraso</p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">{linha.motivo_atraso}</p>
          </div>
        </div>
      )}

      <div className="flex gap-1 mb-5 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-xl w-fit">
        {["horarios", "paradas", "mapa"].map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${tab === t ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {t === "horarios" ? "Horários" : t === "paradas" ? "Paradas" : "Mapa"}
          </button>
        ))}
      </div>

      {tab === "horarios" && (
        <div className="card p-5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 dark:text-white">Grade de horários</h2>
            <div className="flex gap-2">
              <button onClick={() => setDiaUtil(true)} className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${diaUtil ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>Dia útil</button>
              {linha.funcionaFimDeSemana && (
                <button onClick={() => setDiaUtil(false)} className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${!diaUtil ? "bg-purple-500 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>Fim de semana</button>
              )}
            </div>
          </div>
          {!diaUtil && (!linha.horariosFimDeSemana || linha.horariosFimDeSemana.length === 0) ? (
            <p className="text-sm text-gray-400 py-4 text-center">Esta linha não opera aos fins de semana.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {horariosAtivos.map((h) => {
                const [hh, mm] = h.split(":").map(Number);
                const t = new Date(); t.setHours(hh, mm, 0);
                const passou = t < new Date();
                return (
                  <div key={h} className={`text-center py-2 px-3 rounded-xl mono text-sm font-bold ${passou ? "bg-gray-100 dark:bg-gray-800 text-gray-400" : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"}`}>{h}</div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {tab === "paradas" && (
        <div className="card p-5 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
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
                  <p className={`text-sm font-semibold ${i === 0 ? "text-emerald-600" : i === linha.paradas.length - 1 ? "text-red-600" : "text-gray-700 dark:text-gray-300"}`}>{parada}</p>
                  {(i === 0 || i === linha.paradas.length - 1) && <span className="text-[10px] font-bold uppercase text-gray-400">{i === 0 ? "Origem" : "Destino"}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {tab === "mapa" && (
        <div className="card overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm" style={{ height: "420px" }}>
          <MapView selectedLinha={linha.numero}/>
        </div>
      )}
    </div>
  );
D}