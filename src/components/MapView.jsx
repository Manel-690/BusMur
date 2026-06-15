import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { useTheme } from "../contexts/ThemeContext";
import { useBusTracking } from "../hooks/useBusTracking";
import { PARADAS, LINHAS_CONFIG } from "../utils/routeData";
import { obterRotaAutomatica } from "../lib/routeService";
import L from "leaflet";

function AjustarCamera({ coordenadas }) {
  const map = useMap();
  useEffect(() => {
    if (coordenadas?.length > 0) {
      map.fitBounds(L.latLngBounds(coordenadas), {
        padding: [40, 40],
        maxZoom: 15,
      });
    }
  }, [coordenadas, map]);
  return null;
}

export default function MapView({
  rotaSelecionada = null,
  ehMotorista = false,
  currentDriverBusId = 1,
}) {
  const { theme } = useTheme();
  const [rotaCoordenadas, setRotaCoordenadas] = useState([]);
  const [loadingRota, setLoadingRota] = useState(false);

  const buses = useBusTracking(ehMotorista, currentDriverBusId);
  const filteredBuses = rotaSelecionada
    ? buses.filter((b) => b.linha === rotaSelecionada.idLinha)
    : buses;

  const linhaAtual = rotaSelecionada
    ? LINHAS_CONFIG[rotaSelecionada.idLinha]
    : null;
  const paradasDaLinha = linhaAtual
    ? linhaAtual.paradas.map((id) => PARADAS.find((p) => p.id === id))
    : [];

  useEffect(() => {
    if (!rotaSelecionada?.idLinha) {
      setRotaCoordenadas([]);
      return;
    }
    setLoadingRota(true);
    obterRotaAutomatica(rotaSelecionada.idLinha).then((coordenadas) => {
      setRotaCoordenadas(coordenadas);
      setLoadingRota(false);
    });
  }, [rotaSelecionada?.idLinha]);

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden shadow-lg"
      style={{ minHeight: "450px" }}
    >
      {loadingRota && (
        <div className="absolute inset-0 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xs z-[2000] flex items-center justify-center font-semibold text-sm text-gray-700 dark:text-gray-200">
          Calculando rota por Muriaé...
        </div>
      )}

      <MapContainer
        center={[-21.13, -42.366]}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer attribution="&copy; OpenStreetMap" url={tileUrl} />
        <AjustarCamera coordenadas={rotaCoordenadas} />

        {rotaCoordenadas.length > 0 && (
          <Polyline
            positions={rotaCoordenadas}
            color={linhaAtual?.cor || "#1d4ed8"}
            weight={6}
            opacity={0.85}
          />
        )}

        {/* Agrupamento de marcadores de paradas */}
        <MarkerClusterGroup chunkedLoading>
          {paradasDaLinha.map(
            (parada, i) =>
              parada && (
                <Marker
                  key={parada.id}
                  position={[parada.lat, parada.lng]}
                  icon={L.divIcon({
                    className: "",
                    html: `<div style="width:28px;height:28px;border-radius:50%;background:${i === 0 || i === paradasDaLinha.length - 1 ? linhaAtual?.cor : "#fff"};border:3px solid ${linhaAtual?.cor};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:10px;color:${i === 0 || i === paradasDaLinha.length - 1 ? "#fff" : linhaAtual?.cor};box-shadow:0 2px 6px rgba(0,0,0,0.2);font-family:monospace">${i + 1}</div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14],
                  })}
                >
                  <Popup>
                    <p className="font-bold text-sm">{parada.nome}</p>
                    <p className="text-xs text-gray-500">
                      Parada {i + 1} de {paradasDaLinha.length}
                    </p>
                  </Popup>
                </Marker>
              ),
          )}
        </MarkerClusterGroup>

        {/* Marcadores dos ônibus */}
        {filteredBuses.map((bus) => (
          <Marker
            key={bus.id}
            position={[bus.lat, bus.lng]}
            icon={L.divIcon({
              className: "bus-marker",
              html: `<div style="background:${LINHAS_CONFIG[bus.linha]?.cor || "#1d4ed8"};width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">🚌</div>`,
              iconSize: [30, 30],
              iconAnchor: [15, 15],
            })}
          >
            <Popup>
              <p className="font-bold">
                Linha {bus.linha} —{" "}
                {LINHAS_CONFIG[bus.linha]?.nome ?? `Linha ${bus.linha}`}
              </p>
              <p className="text-xs">Motorista: {bus.name}</p>
              <p className="text-xs font-semibold text-green-600">
                Status: {bus.status}
              </p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
