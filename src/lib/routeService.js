import { PARADAS, LINHAS_CONFIG } from "../utils/routeData";

async function buscarSegmento(de, para) {
  const url = `https://router.project-osrm.org/route/v1/driving/${de.lng},${de.lat};${para.lng},${para.lat}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erro HTTP OSRM: ${res.status}`);
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [
        lat,
        lng,
      ]);
    }
  } catch (error) {
    console.error("Erro ao buscar rota no OSRM:", error);
  }

  return [
    [de.lat, de.lng],
    [para.lat, para.lng],
  ];
}

export async function obterRotaAutomatica(idLinha) {
  const linha = LINHAS_CONFIG[idLinha];
  if (!linha) {
    console.warn(`Linha não encontrada: ${idLinha}`);
    return [];
  }

  let pontosCompletos = [];
  for (let i = 0; i < linha.paradas.length - 1; i++) {
    const de = PARADAS.find((p) => p.id === linha.paradas[i]);
    const para = PARADAS.find((p) => p.id === linha.paradas[i + 1]);
    if (!de || !para) continue;
    const segmento = await buscarSegmento(de, para);
    if (i < linha.paradas.length - 2) segmento.pop();
    pontosCompletos = [...pontosCompletos, ...segmento];
  }
  return pontosCompletos;
}

// NOVO: Snap to Road - ajusta coordenadas para a via mais próxima
export async function snapToRoad(lat, lng) {
  const url = `https://router.project-osrm.org/nearest/v1/driving/${lng},${lat}?number=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) return { lat, lng };
    const data = await res.json();
    if (data.waypoints?.length > 0) {
      const [snapLng, snapLat] = data.waypoints[0].location;
      return { lat: snapLat, lng: snapLng };
    }
  } catch (e) {
    console.error("Snap to road error:", e);
  }
  return { lat, lng };
}

export async function ajustarParadasProximas(paradas) {
  return Promise.all(
    paradas.map(async (p) => {
      const ajustada = await snapToRoad(p.lat, p.lng);
      return { ...p, lat: ajustada.lat, lng: ajustada.lng, geo_ajustado: true };
    }),
  );
}
