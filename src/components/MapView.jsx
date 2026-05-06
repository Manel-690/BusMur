import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useTheme } from "../contexts/ThemeContext";
import { ROTAS } from "../utils/routeData";
import L from "leaflet";
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const LINHA_COLORS = {
  "001": "#1d4ed8",
  "002": "#0ea5e9",
  "003": "#059669",
  "004": "#d97706"
};

const MOTORISTAS_APROVADOS = [
  { id: 1, name: "João Pereira", linha: "001", status: "Em rota", lat: -21.1345, lng: -42.3690 },
  { id: 2, name: "Carlos Mendes", linha: "002", status: "Em rota", lat: -21.1400, lng: -42.3770 },
  { id: 3, name: "Ana Beatriz", linha: "003", status: "Em rota", lat: -21.1280, lng: -42.3620 },
  { id: 4, name: "Roberto Lima", linha: "004", status: "Aguardando", lat: -21.1300, lng: -42.3660 }
];

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function createBusIcon(color) {
  return L.divIcon({
    className: 'bus-icon',
    html: `<div style="background-color:${color};width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 6px rgba(0,0,0,0.3);color:white;font-weight:bold;font-size:12px;font-family:sans-serif;border:2px solid white;">🚌</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

const REFERENCE_POINTS = [
  { lat: -21.1345, lng: -42.3690, label: "Terminal Central" },
  { lat: -21.1400, lng: -42.3770, label: "Hospital Regional" },
  { lat: -21.1280, lng: -42.3620, label: "UFJF Campus" },
];

export default function MapView({ selectedLinha = null }) {
  const { theme } = useTheme();
  const [buses, setBuses] = useState(MOTORISTAS_APROVADOS);
  const [mapReady, setMapReady] = useState(false);

  const filteredBuses = selectedLinha
    ? buses.filter((b) => b.linha === selectedLinha)
    : buses;

  const muriaeCenter = [-21.1300, -42.3660];

  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((b) => ({
          ...b,
          lat: b.lat + (Math.random() - 0.5) * 0.002,
          lng: b.lng + (Math.random() - 0.5) * 0.002,
        }))
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMapReady(true);
  }, []);

  // Modo claro: OpenStreetMap padrão | Modo escuro: tom mais suave (Cinza claro)
  const tileUrl = theme === "dark"
    ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg ${theme === "dark" ? "dark-map" : ""}`}>
      <MapContainer
        center={muriaeCenter}
        zoom={14}
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
        zoomControl={true}
      >
        <TileLayer attribution={tileAttr} url={tileUrl} />

        {/* Polylines das rotas */}
        {mapReady && Object.entries(ROTAS).map(([linha, rota]) => (
          <Polyline
            key={linha}
            positions={rota.coordenadas}
            color={rota.cor}
            weight={4}
            opacity={selectedLinha ? (selectedLinha === linha ? 0.9 : 0.15) : 0.6}
          />
        ))}

        {mapReady && REFERENCE_POINTS.map((p, idx) => (
          <Marker key={`ref-${idx}`} position={[p.lat, p.lng]} icon={DefaultIcon}>
            <Popup><strong>{p.label}</strong></Popup>
          </Marker>
        ))}

        {mapReady && filteredBuses.map((bus) => {
          const cor = LINHA_COLORS[bus.linha] || "#1d4ed8";
          return (
            <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={createBusIcon(cor)}>
              <Popup>
                <div className="text-sm">
                  <p className="font-bold text-gray-800">Linha {bus.linha}</p>
                  <p className="text-gray-600">Motorista: {bus.name}</p>
                  <p className="text-xs text-gray-500">Status: {bus.status}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Overlay escuro suave no tema dark */}
      {theme === "dark" && (
        <div className="absolute inset-0 bg-gray-900/20 pointer-events-none z-[500]" />
      )}

      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-xl p-3 flex flex-col gap-1.5 shadow-xl border border-gray-100 dark:border-gray-800 z-[1000]">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-0.5">Linhas ativas</p>
        {Object.entries(LINHA_COLORS).map(([num, color]) => (
          <div key={num} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }}/>
            <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 mono">Linha {num}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-2 z-[1000]">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
        <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">Ao vivo</span>
      </div>
    </div>
  );
}