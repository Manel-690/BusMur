import { useState } from "react";
import { Link } from "react-router-dom";
import { LINHAS } from "../lib/mockData";
import Badge from "../components/Badge";

// Ícones minimalistas com linhas finas (strokeWidth={1.5})
const IconBus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6z" />
    <path d="M4 14h16" />
    <path d="M8 18v2" />
    <path d="M16 18v2" />
    <path d="M9 10h6" />
  </svg>
);

const IconCheckCircle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const IconAlertTriangle = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const IconRefresh = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

function LotacaoBar({ lotacao }) {
  const map = { baixa: { w: "33%", color: "#059669" }, media: { w: "66%", color: "#d97706" }, alta: { w: "100%", color: "#dc2626" } };
  const { w, color } = map[lotacao] || { w: "0%", color: "gray" };
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

  const counts = {
    ativas: LINHAS.filter((l) => l.status === "ativa").length,
    atrasadas: LINHAS.filter((l) => l.status === "atrasada").length,
    fimDeSemana: LINHAS.filter((l) => l.funcionaFimDeSemana).length,
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Linhas de Ônibus</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Muriaé — {LINHAS.length} linhas cadastradas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Card 1: Total de linhas */}
        <div className="card p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total de linhas</p>
              <p className="text-3xl font-black mt-1 text-blue-600 dark:text-blue-500">{LINHAS.length}</p>
            </div>
            {/* NOVO ESTILO AQUI */}
            <div className="p-2.5 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-500">
              <IconBus />
            </div>
          </div>
        </div>

        {/* Card 2: Operando agora */}
        <div className="card p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Operando agora</p>
              <p className="text-3xl font-black mt-1 text-emerald-600 dark:text-emerald-500">{counts.ativas}</p>
            </div>
            {/* NOVO ESTILO AQUI */}
            <div className="p-2.5 bg-emerald-500/10 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-500">
              <IconCheckCircle />
            </div>
          </div>
        </div>

        {/* Card 3: Com atraso */}
        <div className="card p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Com atraso</p>
              <p className="text-3xl font-black mt-1 text-amber-600 dark:text-amber-500">{counts.atrasadas}</p>
            </div>
            {/* NOVO ESTILO AQUI */}
            <div className="p-2.5 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-500">
              <IconAlertTriangle />
            </div>
          </div>
        </div>

        {/* Card 4: Fim de semana */}
        <div className="card p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Fim de semana</p>
              <p className="text-3xl font-black mt-1 text-purple-600 dark:text-purple-500">{counts.fimDeSemana}</p>
            </div>
            {/* NOVO ESTILO AQUI */}
            <div className="p-2.5 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-500">
              <IconCalendar />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><IconSearch /></div>
          <input className="input-field pl-10 w-full" placeholder="Buscar linha por nome ou número..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["todas", "ativa", "atrasada", "inativa"].map((f) => (
            <button key={f} onClick={() => setFiltroStatus(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${filtroStatus === f ? "text-white shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"}`}
              style={filtroStatus === f ? { background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" } : {}}>
              {f === "todas" ? "Todas" : f}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((linha) => (
          <Link key={linha.id} to={`/linhas/${linha.id}`} className="card p-5 block card-hover group cursor-pointer border dark:border-gray-800 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-md mono" style={{ background: linha.cor }}>{linha.numero}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white text-sm group-hover:text-blue-600 transition-colors">{linha.nome}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{linha.paradas.length} paradas · {linha.frequencia}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {linha.funcionaFimDeSemana && <span className="text-purple-500" title="Funciona fim de semana"><IconCalendar /></span>}
                    {linha.trocaMotorista && <span className="text-gray-400" title={`Troca: ${linha.trocaMotorista}`}><IconRefresh /></span>}
                    <Badge type={linha.status}>{linha.status}</Badge>
                  </div>
                </div>
                {linha.status !== "inativa" && (
                  <div className="mt-3 flex items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-1.5 text-blue-500"><IconClock /><span className="text-xs font-bold text-blue-600 mono">{linha.tempo_espera}</span></div>
                    {linha.lotacao && (
                      <div className="flex items-center gap-2 flex-1 max-w-32"><LotacaoBar lotacao={linha.lotacao}/><span className="text-[11px] text-gray-500 shrink-0 capitalize">{linha.lotacao}</span></div>
                    )}
                    <div className="flex items-center gap-1 text-xs text-gray-400"><IconUsers />{linha.passageiros}</div>
                    {linha.trocaMotorista && <span className="text-[10px] text-gray-400">Troca: {linha.trocaMotorista}</span>}
                  </div>
                )}
                {linha.status === "atrasada" && linha.motivo_atraso && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                    <IconAlertTriangle /><span>{linha.motivo_atraso}</span>
                  </div>
                )}
              </div>
              <div className="text-gray-300 dark:text-gray-700 group-hover:text-blue-400 transition-colors shrink-0 mt-1"><IconChevron /></div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="mb-3 flex justify-center text-blue-600 dark:text-blue-500"><IconBus /></div>
            <p className="font-semibold">Nenhuma linha encontrada</p>
            <p className="text-sm mt-1">Tente outro termo de busca</p>
          </div>
        )}
      </div>
    </div>
  );
}