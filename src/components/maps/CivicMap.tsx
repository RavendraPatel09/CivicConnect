import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Complaint, ComplaintCategory, ComplaintSeverity } from '../../types';
import { CATEGORIES } from '../../constants';

interface CivicMapProps {
  complaints: Complaint[];
  selectedComplaintId?: string | null;
  onSelectComplaint?: (complaint: Complaint) => void;
  height?: string;
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  selectableLocation?: boolean;
  onLocationSelected?: (lat: number, lng: number) => void;
  className?: string;
}

export const CivicMap: React.FC<CivicMapProps> = ({
  complaints,
  selectedComplaintId,
  onSelectComplaint,
  height = '480px',
  center = [37.7749, -122.4194],
  zoom = 13,
  selectableLocation = false,
  onLocationSelected,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const selectionMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true,
      });

      // Standard OSM CartoDB Positron / OSM tiles (clean civic look)
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://carto.com/">CARTO</a>, &copy; <a href="https://openstreetmap.org">OSM</a>',
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      // Handle map click if selectableLocation is enabled
      if (selectableLocation && onLocationSelected) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onLocationSelected(lat, lng);

          // Update selection pin
          if (selectionMarkerRef.current) {
            selectionMarkerRef.current.setLatLng([lat, lng]);
          } else {
            const selectIcon = L.divIcon({
              className: 'custom-selection-pin',
              html: `
                <div style="position: relative; width: 32px; height: 32px; transform: translate(-16px, -32px);">
                  <div style="background-color: #2563EB; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(37,99,235,0.4); border: 2px solid white;">
                    <div style="transform: rotate(45deg); width: 10px; height: 10px; background-color: white; border-radius: 50%;"></div>
                  </div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            });
            selectionMarkerRef.current = L.marker([lat, lng], { icon: selectIcon }).addTo(map);
          }
        });
      }
    }

    return () => {
      // Map cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when complaints or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    complaints.forEach((complaint) => {
      const isSelected = complaint.id === selectedComplaintId;
      const categoryMeta = CATEGORIES[complaint.category] || CATEGORIES.roads_potholes;
      const pinColor = categoryMeta.color;

      const severityPulse =
        complaint.severity === 'critical'
          ? '<span style="position:absolute; width:100%; height:100%; border-radius:50%; background-color:#EF4444; opacity:0.6; animation:ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>'
          : '';

      const markerHtml = `
        <div style="position: relative; width: 36px; height: 36px; transform: translate(-18px, -36px); cursor: pointer;">
          ${severityPulse}
          <div style="
            background: linear-gradient(135deg, ${pinColor}, #142B45);
            width: 36px;
            height: 36px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: ${isSelected ? '0 0 0 4px #2563EB, 0 8px 16px rgba(0,0,0,0.3)' : '0 3px 8px rgba(0,0,0,0.2)'};
            border: 2px solid #FFFFFF;
            transition: all 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-size: 11px;
              font-weight: 700;
              color: #FFFFFF;
              font-family: Inter, sans-serif;
            ">
              ${complaint.severity === 'critical' ? '!' : complaint.category[0].toUpperCase()}
            </span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: `civic-marker-${complaint.id}`,
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      const marker = L.marker([complaint.location.lat, complaint.location.lng], {
        icon: customIcon,
        title: complaint.title,
      });

      // Custom HTML Popup
      const statusColor =
        complaint.status === 'resolved'
          ? '#10B981'
          : complaint.status === 'in_progress'
          ? '#8B5CF6'
          : '#F59E0B';

      const popupHtml = `
        <div style="font-family: Inter, sans-serif; min-width: 230px; max-width: 280px; padding: 12px; background: #FFFFFF; color: #172B3A; border-radius: 10px;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 10px; font-weight: 700; color: #64748B; letter-spacing: 0.05em;">${complaint.id}</span>
            <span style="font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; background: ${statusColor}18; color: ${statusColor};">
              ${complaint.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 600; line-height: 1.3; margin: 0 0 6px 0; color: #0F172A;">
            ${complaint.title}
          </h4>
          <p style="font-size: 11px; color: #64748B; margin: 0 0 8px 0; line-height: 1.4;">
            ${complaint.location.address}
          </p>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 8px; font-size: 11px;">
            <span style="color: #0F9D91; font-weight: 600;">Priority ${complaint.aiTriage.priorityScore}/100</span>
            <span style="color: #2563EB; font-weight: 500;">👍 ${complaint.upvotes}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectComplaint) {
          onSelectComplaint(complaint);
        }
      });

      markersLayer.addLayer(marker);

      if (isSelected) {
        marker.openPopup();
        map.setView([complaint.location.lat, complaint.location.lng], Math.max(map.getZoom(), 14), {
          animate: true,
        });
      }
    });
  }, [complaints, selectedComplaintId, onSelectComplaint]);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 dark:border-[#22344D] shadow-sm ${className}`}>
      {/* Demo Prototype Watermark / Badge */}
      <div className="absolute top-3 right-3 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white/95 dark:bg-[#131E30]/95 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200/80 dark:border-slate-700 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Prototype Map • Synthetic Geodata
        </span>
      </div>

      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
    </div>
  );
};

export default CivicMap;
