import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
  const position = [40.7128, -74.0060]; // NYC default
  
  const vehicles = [
    { id: 1, pos: [40.7589, -73.9851], label: 'V-9921 (Active)', status: 'On-time' },
    { id: 2, pos: [40.7128, -74.0060], label: 'V-4410 (Idle)', status: 'Idle' },
    { id: 3, pos: [40.7306, -73.9352], label: 'V-3301 (Delayed)', status: 'Delayed' },
  ];

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold">Live Asset Tracking</h2>
         <div className="flex gap-4">
            <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 bg-green-500 rounded-full" /> Normal</span>
            <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 bg-amber-500 rounded-full" /> Idle</span>
            <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 bg-red-500 rounded-full" /> High Risk</span>
         </div>
      </div>

      <div className="h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 glass">
        <MapContainer center={position} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {vehicles.map(v => (
            <Marker key={v.id} position={v.pos}>
              <Popup className="custom-popup">
                <div className="p-2">
                    <p className="font-bold">{v.label}</p>
                    <p className="text-xs text-gray-500">Status: {v.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
