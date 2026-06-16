import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Badge from "../components/Badge";
import MapView from "../components/MapView";
import toast from "react-hot-toast";

const Ic = {
  pending: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  approved: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  rejected: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  lines: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  ),
  driver: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  bus: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M2 10h20M7 19v2M17 19v2" />
    </svg>
  ),
  eye: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  edit: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  trash: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      <line x1="10" y1="11" x2="10" y2="17"></line>
      <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
  ),
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  xmark: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  shield: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-6 h-6"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  map: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="w-4 h-4"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    </svg>
  ),
};

export default function AdminPanel() {
  const [tab, setTab] = useState("motoristas");
  const [pendentes, setPendentes] = useState([]);
  const [aprovados, setAprovados] = useState([]);
  const [rejeitados, setRejeitados] = useState([]);
  const [linhas, setLinhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cnhModal, setCnhModal] = useState(null);

  // Estados para Criação/Edição de Linhas
  const [showAddLineModal, setShowAddLineModal] = useState(false);
  const [editingLineId, setEditingLineId] = useState(null); // Se tiver ID, estamos editando
  const [lineCode, setLineCode] = useState("");
  const [lineName, setLineName] = useState("");
  const [lineSchedule, setLineSchedule] = useState("");
  const [submittingLine, setSubmittingLine] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: drivers } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "driver")
      .in("driver_status", ["pending", "approved", "rejected"]);
    const { data: linesData } = await supabase
      .from("linhas")
      .select("*")
      .order("codigo", { ascending: true });

    setPendentes(drivers?.filter((d) => d.driver_status === "pending") || []);
    setAprovados(drivers?.filter((d) => d.driver_status === "approved") || []);
    setRejeitados(drivers?.filter((d) => d.driver_status === "rejected") || []);
    setLinhas(linesData || []);
    setLoading(false);
  }

  async function updateStatus(id, status, msg, isError = false) {
    await supabase
      .from("profiles")
      .update({ driver_status: status })
      .eq("id", id);
    isError ? toast.error(msg) : toast.success(msg);
    fetchData();
  }

  // Função unificada para Salvar (Criar ou Atualizar)
  async function handleSaveLine(e) {
    e.preventDefault();
    if (!lineCode.trim() || !lineName.trim())
      return toast.error("Preencha ao menos o código e o nome da linha!");

    setSubmittingLine(true);

    const payload = {
      codigo: lineCode.trim(),
      nome: lineName.trim(),
      horario: lineSchedule.trim() || "Horários não definidos",
    };

    let error = null;

    if (editingLineId) {
      // Modo Edição: Atualiza os dados existentes
      const response = await supabase
        .from("linhas")
        .update(payload)
        .eq("id", editingLineId);
      error = response.error;
    } else {
      // Modo Criação: Insere um novo registro
      payload.status = "ativa";
      const response = await supabase.from("linhas").insert([payload]);
      error = response.error;
    }

    setSubmittingLine(false);

    if (error) {
      toast.error("Erro ao salvar linha: " + error.message);
    } else {
      toast.success(
        editingLineId
          ? "Linha atualizada com sucesso!"
          : "Nova linha cadastrada com sucesso!",
      );
      closeLineModal();
      fetchData();
    }
  }

  // Abrir modal configurado para edição
  function openEditModal(linha) {
    setEditingLineId(linha.id);
    setLineCode(linha.codigo);
    setLineName(linha.nome);
    setLineSchedule(
      linha.horario === "Horários não definidos" ? "" : linha.horario,
    );
    setShowAddLineModal(true);
  }

  // Função para deletar uma linha com verificação
  async function handleDeleteLine(id, codigo) {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir permanentemente a linha ${codigo}?`,
    );
    if (!confirmDelete) return;

    const { error } = await supabase.from("linhas").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao deletar linha: " + error.message);
    } else {
      toast.success("Linha removida com sucesso!");
      fetchData();
    }
  }

  function closeLineModal() {
    setShowAddLineModal(false);
    setEditingLineId(null);
    setLineCode("");
    setLineName("");
    setLineSchedule("");
  }

  const getCnhUrl = (file) =>
    !file
      ? ""
      : file.startsWith("http")
        ? file
        : supabase.storage.from("driver-docs").getPublicUrl(file).data
            .publicUrl;

  const stats = [
    {
      label: "Pendentes",
      value: pendentes.length,
      icon: Ic.pending,
      color: "#d97706",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
    {
      label: "Aprovados",
      value: aprovados.length,
      icon: Ic.approved,
      color: "#059669",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      label: "Rejeitados",
      value: rejeitados.length,
      icon: Ic.rejected,
      color: "#dc2626",
      bg: "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Linhas",
      value: linhas.length,
      icon: Ic.lines,
      color: "#1d4ed8",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center animate-pulse">
            {Ic.shield}
          </div>
          <p className="text-sm text-gray-400">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            {Ic.shield}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              Painel Administrativo
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gerenciamento do sistema BusMur
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Atualizado agora
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`card p-5 ${s.bg} border-0`}>
            <div className="flex items-center justify-between">
              <span className="text-3xl" style={{ color: s.color }}>
                {s.icon}
              </span>
              <div className="text-right">
                <p className="text-3xl font-black" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">
                  {s.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-2xl w-fit">
        {[
          { id: "motoristas", label: "Motoristas", icon: Ic.driver },
          { id: "linhas", label: "Linhas", icon: Ic.lines },
          { id: "mapa", label: "Mapa ao vivo", icon: Ic.map },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-md" : "text-gray-500 dark:text-gray-400"}`}
          >
            {t.icon}
            {t.label}
            {t.id === "motoristas" && pendentes.length > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {pendentes.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Aba de Motoristas */}
      {tab === "motoristas" && (
        <div className="space-y-6">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Aguardando aprovação ({pendentes.length})
            </h2>
            {pendentes.length === 0 ? (
              <div className="card p-10 text-center border-dashed">
                <div className="text-4xl mb-3" style={{ color: "#059669" }}>
                  {Ic.approved}
                </div>
                <p className="font-semibold text-gray-600 dark:text-gray-400">
                  Nenhum motorista pendente
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {pendentes.map((m) => (
                  <div
                    key={m.id}
                    className="card p-5 border-l-4 border-amber-400 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center"
                          style={{ color: "#d97706" }}
                        >
                          {Ic.driver}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 dark:text-white text-lg">
                            {m.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-500">
                              {m.email}
                            </span>
                            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                              CPF: {m.cpf}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            {m.cnh_image && (
                              <button
                                onClick={() => setCnhModal(m.cnh_image)}
                                className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600"
                              >
                                {Ic.eye} Visualizar CNH
                              </button>
                            )}
                            <Badge type="pending">pendente</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            updateStatus(
                              m.id,
                              "approved",
                              "Motorista aprovado!",
                            )
                          }
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/25"
                        >
                          {Ic.check} Aprovar
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(
                              m.id,
                              "rejected",
                              "Motorista rejeitado.",
                              true,
                            )
                          }
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25"
                        >
                          {Ic.xmark} Rejeitar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {Object.entries({ aprovados, rejeitados }).map(
            ([key, list]) =>
              list.length > 0 && (
                <div key={key}>
                  <h2 className="flex items-center gap-2 text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
                    <span
                      className={`w-2 h-2 rounded-full ${key === "aprovados" ? "bg-emerald-500" : "bg-red-500"}`}
                    />
                    {key === "aprovados" ? "Aprovados" : "Rejeitados"} (
                    {list.length})
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    {list.map((m) => (
                      <div
                        key={m.id}
                        className={`card p-4 flex items-center gap-3 ${key === "rejeitados" ? "opacity-60" : ""}`}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{
                            color: key === "aprovados" ? "#059669" : "#dc2626",
                            backgroundColor:
                              key === "aprovados"
                                ? "rgba(5,150,105,0.1)"
                                : "rgba(220,38,38,0.1)",
                          }}
                        >
                          {key === "aprovados" ? Ic.bus : Ic.xmark}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                            {m.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {m.email}
                          </p>
                        </div>
                        <Badge
                          type={key === "aprovados" ? "approved" : "rejected"}
                        >
                          {key === "aprovados" ? "aprovado" : "rejeitado"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      )}

      {/* Aba de Linhas com Editar e Deletar */}
      {tab === "linhas" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              Linhas cadastradas
            </h2>
            <button
              onClick={() => setShowAddLineModal(true)}
              className="btn-primary text-sm py-2 px-4"
            >
              + Nova linha
            </button>
          </div>
          <div className="grid gap-3">
            {linhas.length === 0 && (
              <div className="card p-10 text-center border-dashed">
                <div className="text-4xl mb-3" style={{ color: "#1d4ed8" }}>
                  {Ic.lines}
                </div>
                <p className="font-semibold text-gray-600 dark:text-gray-400">
                  Nenhuma linha cadastrada
                </p>
              </div>
            )}
            {linhas.map((l) => (
              <div
                key={l.id}
                className="card p-5 flex items-center gap-4 hover:shadow-md transition-all"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-black mono shadow-lg"
                  style={{
                    background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                  }}
                >
                  {l.codigo}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 dark:text-white">
                    {l.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    {l.horario || "Horários não definidos"}
                  </p>
                </div>
                <Badge type={l.status}>{l.status || "ativa"}</Badge>

                {/* Grupo de ações: Editar e Deletar */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(l)}
                    className="p-2 rounded-xl text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    title="Editar Linha"
                  >
                    {Ic.edit}
                  </button>
                  <button
                    onClick={() => handleDeleteLine(l.id, l.codigo)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    title="Excluir Linha"
                  >
                    {Ic.trash}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aba de Mapa */}
      {tab === "mapa" && (
        <div>
          <h2 className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-4">
            Monitoramento em tempo real
          </h2>
          <div
            className="card overflow-hidden rounded-2xl"
            style={{ height: "500px" }}
          >
            <MapView adminMode={true} />
          </div>
        </div>
      )}

      {/* Modal Visualizador de CNH */}
      {cnhModal && (
        <div
          onClick={() => setCnhModal(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 dark:text-white">
                CNH do Motorista
              </h3>
              <button
                onClick={() => setCnhModal(null)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              >
                {Ic.xmark}
              </button>
            </div>
            <div className="p-4 flex justify-center bg-gray-50 dark:bg-gray-800/50">
              <img
                src={getCnhUrl(cnhModal)}
                alt="CNH"
                className="w-full h-auto object-contain max-h-[70vh] rounded-xl shadow-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal Dinâmico de Criação/Edição de Linha */}
      {showAddLineModal && (
        <div
          onClick={closeLineModal}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                {editingLineId ? "Editar Linha" : "Cadastrar Nova Linha"}
              </h3>
              <button
                onClick={closeLineModal}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
              >
                {Ic.xmark}
              </button>
            </div>
            <form onSubmit={handleSaveLine} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Código da Linha (Número/ID)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 01, 104, A3"
                  value={lineCode}
                  onChange={(e) => setLineCode(e.target.value)}
                  className="w-full input-field"
                  disabled={submittingLine}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Nome do Itinerário
                </label>
                <input
                  type="text"
                  placeholder="Ex: Centro x Cardoso de Melo"
                  value={lineName}
                  onChange={(e) => setLineName(e.target.value)}
                  className="w-full input-field"
                  disabled={submittingLine}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  Horários de Saída (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: 06:15, 12:30, 18:00"
                  value={lineSchedule}
                  onChange={(e) => setLineSchedule(e.target.value)}
                  className="w-full input-field"
                  disabled={submittingLine}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeLineModal}
                  className="w-1/2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  disabled={submittingLine}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center justify-center transition-colors"
                  disabled={submittingLine}
                >
                  {submittingLine
                    ? "Salvando..."
                    : editingLineId
                      ? "Atualizar"
                      : "Salvar Linha"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
