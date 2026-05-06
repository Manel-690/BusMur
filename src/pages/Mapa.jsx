import { useState } from "react";
import { LINHAS, MOTORISTAS_APROVADOS } from "../lib/mockData";
import MapView from "../components/MapView";
import Badge from "../components/Badge";

export default function Mapa() {
  const [selectedLinha, setSelectedLinha] = useState(null);

  const linhasAtivas = LINHAS.filter((l) => l.status !== "inativa");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Mapa em Tempo Real</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Acompanhe os ônibus ao vivo em Muriaé</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Sidebar de filtros */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Filtrar linha</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedLinha(null)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${!selectedLinha ? "text-white" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                style={!selectedLinha ? { background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" } : {}}
              >
                🚌 Todas as linhas
              </button>
              {linhasAtivas.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLinha(l.numero)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${selectedLinha === l.numero ? "text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  style={selectedLinha === l.numero ? { background: l.cor } : {}}
                >
                  <div className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black mono shrink-0" style={{ background: l.cor + (selectedLinha === l.numero ? "00" : "cc") }}>
                    {l.numero}
                  </div>
                  <span className="truncate text-xs">{l.nome}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Motoristas ativos */}
          <div className="card p-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Motoristas ativos</h3>
            <div className="space-y-3">
              {MOTORISTAS_APROVADOS.filter((m) => !selectedLinha || m.linha === selectedLinha).map((m) => {
                const linha = LINHAS.find((l) => l.numero === m.linha);
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ background: linha?.cor || "#1d4ed8" }}>
                      {m.name[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{m.name}</p>
                      <p className="text-[10px] text-gray-400">Linha {m.linha}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"/>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mapa principal */}
        <div className="lg:col-span-3 card overflow-hidden" style={{ height: "520px" }}>
          <MapView adminMode={false} selectedLinha={selectedLinha}/>
        </div>
      </div>
    </div>
  );
}
