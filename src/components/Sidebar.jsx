import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { supabase } from "../lib/supabaseClient";
import { BusIcon, MapIcon, BellIcon, ShieldIcon, LogoutIcon, WheelIcon, SunIcon, MoonIcon } from "./icons/BusIcons";

const SettingsIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const ROLE_MENUS = {
  passenger: [
    { label: "Linhas", path: "/linhas", icon: BusIcon },
    { label: "Mapa", path: "/mapa", icon: MapIcon },
    { label: "Notificações", path: "/notificacoes", icon: BellIcon },
    { label: "Configurações", path: "/configuracoes", icon: SettingsIcon },
  ],
  driver: [
    { label: "Minha Rota", path: "/motorista", icon: WheelIcon },
    { label: "Configurações", path: "/configuracoes", icon: SettingsIcon },
  ],
  admin: [
    { label: "Painel", path: "/admin", icon: ShieldIcon },
    { label: "Linhas", path: "/linhas", icon: BusIcon },
    { label: "Mapa", path: "/mapa", icon: MapIcon },
    { label: "Configurações", path: "/configuracoes", icon: SettingsIcon },
  ],
};

const ROLE_LABELS = { passenger: "Passageiro", driver: "Motorista", admin: "Administrador" };
const ROLE_COLORS = { passenger: "#1d4ed8", driver: "#059669", admin: "#7c3aed" };

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", avatar_url: "", role: "" });

  useEffect(() => {
    async function loadProfile() {
      if (!user?.id) return;
      const { data } = await supabase
        .from("profiles")
        .select("name, avatar_url, role")
        .eq("id", user.id)
        .single();
      if (data) setProfileData(data);
    }
    loadProfile();
  }, [user]);

  // Define o cargo prioritário vindo do banco de dados
  const currentRole = profileData.role || user?.role || "passenger";
  const menu = ROLE_MENUS[currentRole] || ROLE_MENUS.passenger;

  return (
    <>
      {/* Botão Mobile */}
      <button onClick={() => setOpen(!open)} className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg text-gray-600 dark:text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          {open ? (<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>) : (<><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>)}
        </svg>
      </button>

      {open && <div onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"/>}

      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 flex flex-col bg-white dark:bg-[#0a1120] border-r border-gray-100 dark:border-gray-800 transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md" style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}>{BusIcon}</div>
          <div><span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Bus<span className="text-blue-500">Mur</span></span><p className="text-[10px] text-gray-400 font-medium -mt-0.5">Muriaé — MG</p></div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {menu.map((item) => {
            const active = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
            return (
              <Link key={item.path} to={item.path} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${active ? "text-white shadow-md" : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"}`}
                style={active ? { background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" } : {}}>
                {item.icon}<span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Perfil Inferior Corrigido */}
        <div className="p-3 m-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3 mb-3">
            {profileData.avatar_url ? (
              <img src={profileData.avatar_url} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border border-gray-200 dark:border-gray-700" />
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: ROLE_COLORS[currentRole] || "#1d4ed8" }}>
                {profileData.name?.[0] || user?.name?.[0] || "?"}
              </div>
            )}
            
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate text-gray-800 dark:text-white">{profileData.name || user?.name || "Usuário"}</p>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: (ROLE_COLORS[currentRole] || "#1d4ed8") + "22", color: ROLE_COLORS[currentRole] }}>
                {ROLE_LABELS[currentRole]}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              {theme === "light" ? MoonIcon : SunIcon}{theme === "light" ? "Escuro" : "Claro"}
            </button>
            <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center justify-center px-3 py-1.5 rounded-lg text-[11px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
              {LogoutIcon}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}