import { useState, useEffect, useRef } from "react";
import { LINHAS } from "../lib/mockData";
import { useAuth } from "../contexts/AuthContext";
import MapView from "../components/MapView";

// Coordenadas reais aproximadas das paradas em Muriaé
const PARADAS_COORDS = {
  "Terminal Central": [-21.1345, -42.3690],
  "Praça Antônio Carlos": [-21.1330, -42.3710],
  "Rua XV de Novembro": [-21.1320, -42.3730],
  "Shopping Muriaé": [-21.1310, -42.3750],
  "UPA Muriaé": [-21.1300, -42.3770],
  "Hospital Regional": [-21.1400, -42.3770],
  "Bairro São Paulo": [-21.1280, -42.3580],
  "Av. Expedicionário": [-21.1290, -42.3610],
  "Mercado Municipal": [-21.1310, -42.3640],
  "Praça Central": [-21.1330, -42.3670],
  "Laranjal": [-21.1200, -42.3800],
  "Bairro Industrial": [-21.1240, -42.3750],
  "SENAI": [-21.1270, -42.3700],
  "BR-116": [-21.1300, -42.3650],
  "UFJF Campus Muriaé": [-21.1280, -42.3620],
  "Santa Terezinha": [-21.1380, -42.3600],
  "Vila Nova": [-21.1360, -42.3630],
  "Av. Presidente Vargas": [-21.1340, -42.3650],
  "Rua Frei Rosário": [-21.1350, -42.3670],
  "Centro": [-21.1340, -42.3680],
  "Aeroporto Reg. Muriaé": [-21.1250, -42.3900],
  "BR-116 Norte": [-21.1280, -42.3850],
  "Bairro Aeroporto": [-21.1300, -42.3820],
};

export default function PainelMotorista() {
  const { user } = useAuth();
  const [linhaSelecionada, setLinhaSelecionada] = useState("");
  const [compartilhando, setCompartilhando] = useState(false);
  const [iniciado, setIniciado] = useState(false);
  const [tempo, setTempo] = useState(0);
  const intervalRef = useRef(null);

  const linhasDisponiveis = LINHAS.filter((l) => l.status !== "inativa");
  const linhaAtual = LINHAS.find((l) => l.numero === linhaSelecionada);

  // Coordenadas das paradas da linha selecionada
  const paradasCoords = linhaAtual
    ? linhaAtual.paradas
        .filter((p) => PARADAS_COORDS[p])
        .map((p) => ({ nome: p, coord: PARADAS_COORDS[p] }))
    : [];

  // Centro do mapa baseado na linha selecionada
  const centroMapa = paradasCoords.length > 0
    ? paradasCoords[Math.floor(paradasCoords.length / 2)].coord
    : [-21.13, -42.366];

  const iniciarRota = () => {
    if (!linhaSelecionada) return;
    setCompartilhando(true);
    setIniciado(true);
    setTempo(0);
    intervalRef.current = setInterval(() => setTempo((t) => t + 1), 1000);
  };

  const pararRota = () => {
    setCompartilhando(false);
    setIniciado(false);
    setTempo(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTempo = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="mb-7">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Painel do Motorista</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Olá, {user?.name}! Selecione sua rota para começar</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Status card */}
        <div className={`card p-6 border-2 ${compartilhando ? "border-emerald-400 dark:border-emerald-600" : "border-gray-100 dark:border-gray-800"}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 dark:text-white">Status</h2>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${compartilhando ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}>
              <div className={`w-2 h-2 rounded-full ${compartilhando ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}/>
              {compartilhando ? "Online" : "Offline"}
            </div>
          </div>

          {compartilhando ? (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-1">Tempo em rota</p>
                <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 mono">{formatTempo(tempo)}</p>
              </div>
              {linhaAtual && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black mono" style={{ background: linhaAtual.cor }}>
                    {linhaAtual.numero}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{linhaAtual.nome}</p>
                    <p className="text-xs text-gray-500">{linhaAtual.paradas.length} paradas</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg px-3 py-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4"/>
                </svg>
                Localização sendo compartilhada
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8 text-gray-400">
                  <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Selecione a linha e inicie a rota</p>
            </div>
          )}
        </div>

        {/* Controles */}
        <div className="card p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-5">Controles</h2>

          {!iniciado ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 block">Selecionar linha</label>
                <select className="input-field" value={linhaSelecionada} onChange={(e) => setLinhaSelecionada(e.target.value)}>
                  <option value="">-- Selecione a linha --</option>
                  {linhasDisponiveis.map((l) => (
                    <option key={l.id} value={l.numero}>Linha {l.numero} — {l.nome}</option>
                  ))}
                </select>
              </div>

              {linhaSelecionada && linhaAtual && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-1">Linha selecionada</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white">{linhaAtual.nome}</p>
                  <p className="text-xs text-gray-500 mt-1">{linhaAtual.paradas[0]} → {linhaAtual.paradas[linhaAtual.paradas.length - 1]}</p>
                </div>
              )}

              <button onClick={iniciarRota} disabled={!linhaSelecionada}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white transition-all disabled:opacity-50"
                style={{ background: linhaSelecionada ? "linear-gradient(135deg, #059669, #10b981)" : undefined }}>
                ▶ Iniciar rota
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-1">Rota em andamento</p>
                <p className="text-sm font-bold text-gray-800 dark:text-white">Linha {linhaSelecionada}</p>
              </div>
              <button onClick={pararRota} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all">
                ⏹ Parar rota
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MAPA COM ROTA DESTACADA */}
      <div>
        <h2 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
          {linhaSelecionada ? `Mapa — Linha ${linhaSelecionada}` : "Mapa da rota"}
        </h2>
        <div className="card overflow-hidden rounded-2xl" style={{ height: "450px" }}>
          <MapView 
            selectedLinha={linhaSelecionada || null} 
            centro={centroMapa}
            paradas={paradasCoords}
          />
        </div>
      </div>

      {/* Paradas da linha */}
      {linhaSelecionada && linhaAtual && (
        <div className="card p-6">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">Paradas da rota</h2>
          <div className="flex flex-wrap gap-2">
            {linhaAtual.paradas.map((p, i) => (
              <div key={p} className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-xl">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white mono" style={{ background: linhaAtual.cor }}>{i + 1}</div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{p}</span>
                </div>
                {i < linhaAtual.paradas.length - 1 && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3 text-gray-300"><polyline points="9 18 15 12 9 6"/></svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}