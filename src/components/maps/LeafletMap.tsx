'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LeafletMapProps {
  customerLat?: number;
  customerLng?: number;
  providerLat?: number;
  providerLng?: number;
  providerName?: string;
  status?: string;
}

export default function LeafletMap({
  customerLat = 28.6080,
  customerLng = 77.2980,
  providerLat = 28.6180,
  providerLng = 77.2850,
  providerName = 'Ramesh Kumar (ITI Electrician)',
  status = 'en_route'
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapContainerRef.current) return;

    let isCancelled = false;

    // Dynamically import Leaflet in browser
    import('leaflet').then((L) => {
      if (isCancelled || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map centered between customer and provider
      const centerLat = (customerLat + providerLat) / 2;
      const centerLng = (customerLng + providerLng) / 2;

      const map = L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: true
      });

      mapInstanceRef.current = map;

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      // Custom SVG DivIcon for Customer (Home marker)
      const customerIcon = L.divIcon({
        className: 'custom-customer-icon',
        html: `
          <div style="background-color: #18181B; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      // Custom SVG DivIcon for Provider (Co-op worker marker)
      const providerIcon = L.divIcon({
        className: 'custom-provider-icon',
        html: `
          <div style="background-color: #0D5C3A; color: white; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(13,92,58,0.4); border: 2.5px solid white; animation: pulse 2s infinite;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19]
      });

      // Add Customer Marker
      L.marker([customerLat, customerLng], { icon: customerIcon })
        .addTo(map)
        .bindPopup('<b>Customer Destination</b><br>Mayur Vihar, New Delhi');

      // Add Provider Marker
      L.marker([providerLat, providerLng], { icon: providerIcon })
        .addTo(map)
        .bindPopup(`<b>${providerName}</b><br>Status: ${status === 'en_route' ? 'En Route (8 mins away)' : 'Arrived'}`)
        .openPopup();

      // Draw dashed trajectory line between provider and customer
      L.polyline(
        [
          [providerLat, providerLng],
          [customerLat, customerLng]
        ],
        {
          color: '#0D5C3A',
          weight: 3,
          opacity: 0.8,
          dashArray: '6, 8'
        }
      ).addTo(map);

      // Fit bounds nicely
      map.fitBounds([
        [customerLat, customerLng],
        [providerLat, providerLng]
      ], { padding: [40, 40] });
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mounted, customerLat, customerLng, providerLat, providerLng, providerName, status]);

  if (!mounted) {
    return (
      <div className="w-full h-72 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm">
        Initializing OpenStreetMap Provider Radar...
      </div>
    );
  }

  return (
    <div className="relative w-full h-72 rounded-2xl overflow-hidden shadow-inner border border-neutral-200">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 text-neutral-800 z-[1000]">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span>Live GPS Feed (OSM)</span>
      </div>
    </div>
  );
}
