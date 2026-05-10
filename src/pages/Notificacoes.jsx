import { useState } from "react";
import { NOTIFICACOES } from "../lib/mockData";

const Ic = {
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  bell: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

export default function Notificacoes() {
  const [notifs, setNotifs] = useState(NOTIFICACOES || []);
  
  const marcarLida = (id) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, lida: true } : n));
  const marcarTodas = () => setNotifs((prev) => prev.map((n) => ({ ...n, lida: true })));
  
  const naoLidas = notifs.filter((n) => !n.lida).length;

  return (
    <div>
      <div className="flex items-start justify-between mb-7">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Notificações</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {naoLidas > 0 ? (
              <span>
                Você tem <strong className="text-blue-500">{naoLidas}</strong> {naoLidas === 1 ? 'mensagem não lida' : 'mensagens não lidas'}
              </span>
            ) : (
              "Todas as notificações lidas"
            )}
          </p>
        </div>
        
        {naoLidas > 0 && (
          <button 
            onClick={marcarTodas}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span className="text-blue-500">{Ic.check}</span> Marcar todas como lidas
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifs.length === 0 ? (
          <div className="text-center py-16 text-gray-500 flex flex-col items-center">
            <div className="text-gray-300 dark:text-gray-700 mb-3">{Ic.bell}</div>
            <p>Nenhuma notificação no momento.</p>
          </div>
        ) : (
          notifs.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 rounded-xl border flex gap-4 transition-all ${
                notif.lida 
                  ? 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 opacity-70' 
                  : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 shadow-sm'
              }`}
            >
              <div className={`mt-1 shrink-0 ${notif.tipo === 'alerta' ? 'text-amber-500' : 'text-blue-500'}`}>
                {notif.tipo === 'alerta' ? Ic.warning : Ic.info}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <h3 className={`font-bold text-sm ${notif.lida ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                    {notif.titulo}
                  </h3>
                  <span className="text-xs font-medium text-gray-400 whitespace-nowrap">{notif.tempo}</span>
                </div>
                
                <p className={`text-sm ${notif.lida ? 'text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                  {notif.mensagem}
                </p>
                
                {!notif.lida && (
                  <button 
                    onClick={() => marcarLida(notif.id)}
                    className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                  >
                    Marcar como lida
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}