import { useEffect, useRef } from "react";
import type { Listing } from "@/lib/observatory-data";
import { currency } from "@/lib/observatory-data";

export function ObservatoryMap({ rows, large = false }: { rows: Listing[]; large?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;
    import("leaflet").then((L) => {
      if (disposed || !container.current) return;
      const map = L.map(container.current, { scrollWheelZoom: false, zoomControl: true }).setView(
        [-23.565, -46.66],
        12,
      );
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);
      rows.forEach((row, index) => {
        const icon = L.divIcon({
          className: "property-marker",
          html: `<span>${index + 1}</span>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
        const popup = document.createElement("div");
        const heading = document.createElement("strong");
        heading.textContent = `${row.type} · ${row.neighborhood}`;
        popup.append(
          heading,
          document.createElement("br"),
          document.createTextNode(`${row.area} m² · ${currency(row.price)}`),
        );
        L.marker([row.lat, row.lng], { icon }).addTo(map).bindPopup(popup);
      });
      if (rows.length)
        map.fitBounds(L.latLngBounds(rows.map((row) => [row.lat, row.lng] as [number, number])), {
          padding: [45, 45],
          maxZoom: 13,
        });
      cleanup = () => map.remove();
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [rows]);
  return (
    <div
      ref={container}
      className={large ? "market-map market-map-large" : "market-map"}
      aria-label="Mapa de localização dos anúncios"
    />
  );
}
