export default function ArrivalPanel({ linhas, buses }) {
  const estimativas = linhas.map((linha) => {
    const busNaLinha = buses.find((b) => b.linha === linha.numero);
    const minutos = busNaLinha
      ? Math.floor(Math.random() * 15) + 2 // Mock: entre 2 e 16 min
      : null;

    return {
      numero: linha.numero,
      nome: linha.nome,
      cor: linha.cor,
      minutos,
    };
  });

  return (
    <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 w-64">
      <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
        Previsão de chegada
      </h3>
      <div className="space-y-2">
        {estimativas.map((e) => (
          <div key={e.numero} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: e.cor }} />
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Linha {e.numero}
              </span>
            </div>
            <span className={`text-xs font-bold ${e.minutos ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"}`}>
              {e.minutos ? `${e.minutos} min` : "—"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}