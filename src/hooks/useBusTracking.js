import { useState, useEffect } from "react";
import { MOTORISTAS_APROVADOS } from "../lib/mockData";

export function useBusTracking() {
  const [buses, setBuses] = useState(MOTORISTAS_APROVADOS);

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

  return buses;
}