import { Polyline } from "react-leaflet";
import { ROTAS } from "../utils/routeData";

export default function RoutePolyline({ linha }) {
  const rota = ROTAS[linha];
  if (!rota) return null;

  return (
    <Polyline
      positions={rota.coordenadas}
      color={rota.cor}
      weight={4}
      opacity={0.7}
      dashArray="10 6"
    />
  );
}