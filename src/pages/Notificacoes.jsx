import { useState } from "react";
import { NOTIFICACOES } from "../lib/mockData";

export default function Notificacoes() {
  const [notifs, setNotifs] = useState(NOTIFICACOES);

  const marcarLida = (id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, lida: true } : n));
  const marcarTodas = () => setNotifs((prev) => prev.map((n) => ({ ...n, lida: true })));

  const naoLidas = notifs.filter((n) => !n.lida).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Notificações</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {naoLidas > 0 ? <span><strong className="text-blue-500">{naoLidas}</strong> não lidas</span> : "Tudo em dia!"}
          </p>
        </div>
        {naoLidas > 0 && (
          <button onClick={marcarTodas} className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors">
            Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifs.map((n) => (
          <div
            key={n.id}
            className={`card p-5 flex items-start gap-4 transition-all ${!n.lida ? "border-l-4 border-blue-500" : "opacity-70"}`}
          >
            {/* Ícone */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${n.tipo === "atraso" ? "bg-amber-100 dark:bg-amber-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}>
              {n.tipo === "atraso" ? "⚠️" : "ℹ️"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-bold ${!n.lida ? "text-gray-800 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                    {n.mensagem}
                  </p>
                  {n.motivo && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Motivo: {n.motivo}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      Linha {n.linha}
                    </span>
                    <span className="text-[11px] text-gray-400">{n.time}</span>
                  </div>
                </div>

                {!n.lida && (
                  <button onClick={() => marcarLida(n.id)} className="text-xs text-gray-400 hover:text-blue-500 transition-colors shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {notifs.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔔</p>
            <p className="font-semibold">Nenhuma notificação</p>
          </div>
        )}
      </div>
    </div>
  );
}
