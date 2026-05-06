import { toSVGCoordinates, LINHA_COLORS } from "../utils/mapUtils";

export default function BusMarker({ bus }) {
  const pos = toSVGCoordinates(bus.lat, bus.lng);
  const cor = LINHA_COLORS[bus.linha] || "#1d4ed8";

  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r="18" fill={cor} opacity="0.12">
        <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2s" repeatCount="indefinite" />
      </circle>
      <rect x={pos.x - 12} y={pos.y - 10} width="24" height="16" rx="4" fill={cor} filter="url(#shadow)" />
      <rect x={pos.x - 9} y={pos.y - 7} width="5" height="5" rx="1" fill="white" opacity="0.9" />
      <rect x={pos.x + 1} y={pos.y - 7} width="5" height="5" rx="1" fill="white" opacity="0.9" />
      <rect x={pos.x - 12} y={pos.y + 1} width="24" height="2" rx="0" fill="black" opacity="0.1" />
      <text x={pos.x} y={pos.y + 22} textAnchor="middle" fontSize="9" fontWeight="700" fill={cor} fontFamily="Space Mono, monospace">
        {bus.linha}
      </text>
    </g>
  );
}