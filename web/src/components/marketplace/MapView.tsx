"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";

interface MapDeal {
  id: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  type: string;
  capitalNeeded: number;
  funded: number;
  roi: number;
}

interface MapViewProps {
  deals: MapDeal[];
  onDealSelect?: (dealId: string) => void;
  selectedDealId?: string | null;
}

const TYPE_COLORS: Record<string, string> = {
  Flip: "#E8632B",
  "New Build": "#2B4C7E",
  "Value-Add": "#2ECC71",
  Wholesale: "#D4A843",
  Land: "#8B5CF6",
};

function createMarkerIcon(type: string, isSelected: boolean) {
  const color = TYPE_COLORS[type] || "#D4A843";
  const size = isSelected ? 40 : 32;
  const border = isSelected ? "3px solid #FFFFFF" : "2px solid rgba(255,255,255,0.6)";

  return `<div style="
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border: ${border};
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    transition: all 0.2s;
  ">
    <svg style="transform: rotate(45deg); width: ${size * 0.45}px; height: ${size * 0.45}px;" fill="white" viewBox="0 0 24 24">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  </div>`;
}

function createClusterIcon(count: number) {
  const size = count > 100 ? 56 : count > 10 ? 48 : 40;
  return `<div style="
    width: ${size}px;
    height: ${size}px;
    background: linear-gradient(135deg, #D4A843 0%, #E8632B 100%);
    border: 2px solid rgba(255,255,255,0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: ${size > 48 ? 16 : 14}px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-family: 'Inter', sans-serif;
  ">${count.toLocaleString()}</div>`;
}

export default function MapView({ deals, onDealSelect, selectedDealId }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");

      // Load Leaflet CSS via link tags (avoids TS module resolution issues)
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      if (!document.getElementById("leaflet-mc-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-mc-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css";
        document.head.appendChild(link);

        const link2 = document.createElement("link");
        link2.id = "leaflet-mc-default-css";
        link2.rel = "stylesheet";
        link2.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css";
        document.head.appendChild(link2);
      }

      if (cancelled || !mapRef.current) return;

      // Center on US Southeast (Charlotte, NC area)
      const map = L.map(mapRef.current, {
        center: [35.2, -80.8],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark map tiles
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Zoom control on the right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Marker cluster group
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const markers = (L as any).markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster: { getChildCount: () => number }) => {
          return L.divIcon({
            html: createClusterIcon(cluster.getChildCount()),
            className: "custom-cluster-icon",
            iconSize: L.point(48, 48),
            iconAnchor: L.point(24, 24),
          });
        },
      });

      deals.forEach((deal) => {
        const isSelected = deal.id === selectedDealId;
        const icon = L.divIcon({
          html: createMarkerIcon(deal.type, isSelected),
          className: "custom-marker-icon",
          iconSize: L.point(isSelected ? 40 : 32, isSelected ? 48 : 40),
          iconAnchor: L.point(isSelected ? 20 : 16, isSelected ? 48 : 40),
        });

        const marker = L.marker([deal.lat, deal.lng], { icon });

        // Popup
        marker.bindPopup(
          `<div style="
            font-family: 'Inter', sans-serif;
            background: #1A1A2E;
            color: white;
            padding: 12px;
            border-radius: 8px;
            min-width: 200px;
          ">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${deal.address}</div>
            <div style="color: #4A4A5A; font-size: 12px; margin-bottom: 8px;">${deal.city}, ${deal.state}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="background: ${TYPE_COLORS[deal.type] || "#D4A843"}; color: white; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600;">${deal.type}</span>
              <span style="color: #2ECC71; font-weight: 600; font-size: 12px;">${deal.roi}% ROI</span>
            </div>
            <div style="color: #D4A843; font-weight: 700; font-size: 14px;">$${deal.capitalNeeded.toLocaleString()}</div>
          </div>`,
          {
            className: "dark-popup",
            closeButton: false,
          }
        );

        marker.on("click", () => {
          onDealSelect?.(deal.id);
        });

        markers.addLayer(marker);
      });

      map.addLayer(markers);

      // Fit bounds to deal markers if any
      if (deals.length > 0) {
        const bounds = L.latLngBounds(deals.map((d) => [d.lat, d.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
      }

      mapInstanceRef.current = map;
      setReady(true);
    }

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [deals, onDealSelect, selectedDealId]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "#0D0D1A" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#D4A843]" />
            <span className="text-sm" style={{ color: "#4A4A5A" }}>Loading map...</span>
          </div>
        </div>
      )}
      {/* Map legend */}
      <div
        className="absolute bottom-4 left-4 z-[1000] rounded-lg border border-white/10 p-3"
        style={{ backgroundColor: "#1A1A2Eee" }}
      >
        <div className="text-xs font-semibold text-white mb-2">Deal Types</div>
        <div className="space-y-1.5">
          {Object.entries(TYPE_COLORS).slice(0, 3).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs" style={{ color: "#F8F6F0" }}>{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
