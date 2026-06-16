import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import toast from "react-hot-toast";
import logoImg from "../assets/logo-busmur.png";
import logoImgWhite from "../assets/logo-busmur-white.png";

/* ── Ícones dos perfis ──────────────────────────────────────────── */
const RoleIcons = {
  passenger: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-6 h-6"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  driver: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className="w-6 h-6"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <line x1="12" y1="2" x2="12" y2="9" />
      <line x1="12" y1="15" x2="12" y2="22" />
      <line x1="2" y1="12" x2="9" y2="12" />
      <line x1="15" y1="12" x2="22" y2="12" />
    </svg>
  ),
};

const roles = [
  { id: "passenger", label: "Passageiro" },
  { id: "driver", label: "Motorista" },
];

/* ── Força da senha ─────────────────────────────────────────────── */
function getPasswordStrength(p) {
  if (!p) return { level: 0, label: "", color: "" };
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s <= 1) return { level: 1, label: "Fraca", color: "var(--danger)" };
  if (s <= 2) return { level: 2, label: "Média", color: "var(--warning)" };
  if (s <= 3) return { level: 3, label: "Boa", color: "var(--brand)" };
  return { level: 4, label: "Forte", color: "var(--success)" };
}

// ── CONFIGURAÇÃO: E-mail invisível cadastrado no Supabase para o Admin ──
const ADMIN_EMAIL_HARDCODED = "admin@busmur.com";

/* ── Login ──────────────────────────────────────────────────────── */
export default function Login() {
  const { login, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("passenger");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados do Modal Administrativo
  const [showAdminGate, setShowAdminGate] = useState(false);
  const [adminGatePass, setAdminGatePass] = useState("");
  const [adminGateErr, setAdminGateErr] = useState("");
  const [showAdminPass, setShowAdminPass] = useState(false);

  const strength = getPasswordStrength(password);

  // Manipula o envio apenas da senha no modal de Acesso Restrito
  const handleAdminGateSubmit = async (e) => {
    e.preventDefault();
    if (!adminGatePass) return;

    setAdminGateErr("");

    try {
      // Faz o login injetando por baixo dos panos o e-mail hardcoded
      await login(ADMIN_EMAIL_HARDCODED, adminGatePass, "admin");

      toast.success("Bem-vindo ao Painel Administrativo!");
      setShowAdminGate(false);
      setAdminGatePass("");
      navigate("/admin");
    } catch (err) {
      setAdminGateErr(err.message || "Senha incorreta. Tente novamente.");
      toast.error("Falha na autenticação administrativa.");
    }
  };

  // Manipula o login padrão (Passageiro e Motorista)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password, selectedRole);
      toast.success("Bem-vindo ao BusMur!");
      const paths = { passenger: "/linhas", driver: "/motorista" };
      navigate(paths[selectedRole]);
    } catch (err) {
      toast.error(err.message || "E-mail ou senha inválidos.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--bg-soft)", transition: "background 0.25s" }}
    >
      {/* Fundo */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 map-bg opacity-60" />
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,76,104,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,229,0,0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Toggle tema */}
      <button
        onClick={toggleTheme}
        aria-label="Alternar tema"
        className="absolute top-5 right-5 p-2.5 rounded-xl transition-all"
        style={{
          background: "var(--bg)",
          border: "1.5px solid var(--border)",
          color: "var(--text-muted)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        {theme === "light" ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </button>

      {/* Modal Admin */}
      {showAdminGate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: "rgba(0,20,35,0.6)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAdminGate(false);
              setAdminGateErr("");
              setAdminGatePass("");
            }
          }}
        >
          <div
            className="card w-full mx-4 fade-in-up"
            style={{
              maxWidth: 360,
              padding: "32px 28px",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <div className="flex flex-col items-center mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                style={{
                  background: "var(--brand-pale)",
                  border: "2px solid var(--brand-mid)",
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  className="w-7 h-7"
                  style={{ color: "var(--brand)" }}
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h2
                style={{ fontSize: 17, fontWeight: 800, color: "var(--text)" }}
              >
                Acesso Restrito
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                Digite a senha de acesso administrativo
              </p>
            </div>
            <form onSubmit={handleAdminGateSubmit}>
              <div className="form-group">
                <label
                  htmlFor="admin-gate-pass"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--text-sub)",
                  }}
                >
                  Senha de acesso
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="admin-gate-pass"
                    type={showAdminPass ? "text" : "password"}
                    className="input-field"
                    style={{ paddingRight: 44 }}
                    placeholder="••••••••••••"
                    value={adminGatePass}
                    onChange={(e) => {
                      setAdminGatePass(e.target.value);
                      setAdminGateErr("");
                    }}
                    disabled={loading}
                    autoFocus
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPass(!showAdminPass)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                  >
                    {showAdminPass ? (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        className="w-4 h-4"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {adminGateErr && (
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--danger)",
                      marginTop: 6,
                      fontWeight: 600,
                    }}
                  >
                    ⚠ {adminGateErr}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => {
                    setShowAdminGate(false);
                    setAdminGateErr("");
                    setAdminGatePass("");
                  }}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1 }}
                  disabled={!adminGatePass || loading}
                >
                  {loading ? (
                    <svg
                      className="animate-spin w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeOpacity="0.25"
                      />
                      <path
                        d="M12 2a10 10 0 0 1 10 10"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    "Confirmar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Card central */}
      <div
        className="relative z-10 w-full mx-4 fade-in-up"
        style={{ maxWidth: 420 }}
      >
        {/* Header marca */}
        <div className="text-center mb-7">
          <div
            className="inline-flex items-center justify-center mb-4"
            style={{ filter: "drop-shadow(0 8px 20px rgba(0,76,104,0.22))" }}
          >
            <img
              src={theme === "dark" ? logoImgWhite : logoImg}
              alt="BusMur logo"
              style={{ width: 130, height: 130, objectFit: "contain" }}
            />
          </div>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              marginTop: 2,
              fontWeight: 500,
            }}
          >
            Transporte público de Muriaé
          </p>
        </div>

        {/* Card formulário */}
        <div
          className="card"
          style={{ padding: "32px 28px", boxShadow: "var(--shadow-lg)" }}
        >
          <h2
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 20,
            }}
          >
            Entrar no sistema
          </h2>

          {/* Seletor de perfil */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {roles.map((r) => {
              const isActive = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    padding: "12px 8px",
                    borderRadius: 10,
                    border: isActive
                      ? "2px solid var(--brand)"
                      : "1.5px solid var(--border)",
                    background: isActive ? "var(--brand-pale)" : "var(--bg)",
                    color: isActive ? "var(--brand)" : "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    fontFamily: "inherit",
                  }}
                >
                  {RoleIcons[r.id]}
                  <span
                    style={{ fontSize: 11, fontWeight: isActive ? 700 : 500 }}
                  >
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="password">Senha</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  style={{ paddingRight: 44 }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    borderRadius: 6,
                  }}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-4 h-4"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 3,
                          borderRadius: 99,
                          background:
                            i <= strength.level
                              ? strength.color
                              : "var(--border)",
                          transition: "background 0.2s",
                        }}
                      />
                    ))}
                  </div>
                  <p
                    style={{
                      fontSize: 11,
                      color: strength.color,
                      fontWeight: 600,
                    }}
                  >
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: 24, width: "100%", justifyContent: "center" }}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeOpacity="0.25"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Links rodapé */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
              <Link
                to="/cadastro-usuario"
                style={{
                  color: "var(--brand)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Criar conta
              </Link>
              <span style={{ color: "var(--border)" }}>·</span>
              <Link
                to="/cadastro-motorista"
                style={{
                  color: "var(--text-muted)",
                  fontWeight: 500,
                  textDecoration: "none",
                }}
              >
                Sou motorista
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowAdminGate(true)}
              style={{
                marginTop: 2,
                fontSize: 11,
                color: "var(--text-faint)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontWeight: 500,
                opacity: 0.6,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            >
              Acesso restrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
