import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api';

// Fix for default marker icons
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
    const [deliveries, setDeliveries] = useState([]);
    const [center, setCenter] = useState([40.7128, -74.0060]); // NYC
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const { data } = await api.get('/deliveries');
                const withCoords = data.filter(d => d.pickup_lat && d.drop_lat);
                setDeliveries(withCoords);
                
                if (withCoords.length > 0) {
                    setCenter([withCoords[0].pickup_lat, withCoords[0].pickup_lng]);
                }
            } catch (err) {
                console.error("Map sync error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMissions();
    }, []);

    return (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center px-2">
                <div>
                     <h2 className="text-2xl font-black text-[var(--text-color)]">Geospatial Intelligence</h2>
                     <p className="text-xs text-[var(--text-muted)] mt-1 uppercase font-black tracking-widest">Active Mission Visualization</p>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full border border-blue-400/30" /> Pickup
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border border-emerald-400/30" /> Target
                    </span>
                </div>
            </div>

            <div className="h-[650px] w-full rounded-[2.5rem] overflow-hidden border border-[var(--glass-border)] shadow-2xl relative">
                {loading && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[1000] flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                )}
                <MapContainer center={center} zoom={5} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {deliveries.map(d => (
                        <React.Fragment key={d.id}>
                            <Marker position={[d.pickup_lat, d.pickup_lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <p className="font-black text-xs uppercase tracking-widest text-blue-500">Pickup</p>
                                        <p className="font-bold text-sm">{d.customer_name}</p>
                                        <p className="text-[10px] text-gray-500">{d.pickup_location}</p>
                                    </div>
                                </Popup>
                            </Marker>
                            <Marker position={[d.drop_lat, d.drop_lng]}>
                                <Popup>
                                    <div className="p-1">
                                        <p className="font-black text-xs uppercase tracking-widest text-emerald-500">Destination</p>
                                        <p className="font-bold text-sm">{d.customer_name}</p>
                                        <p className="text-[10px] text-gray-500">{d.drop_location}</p>
                                    </div>
                                </Popup>
                            </Marker>
                            <Polyline 
                                positions={[[d.pickup_lat, d.pickup_lng], [d.drop_lat, d.drop_lng]]}
                                color={d.status === 'Delayed' ? '#ef4444' : '#3b82f6'}
                                weight={2}
                                dashArray="5, 10"
                                opacity={0.6}
                            />
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapView;
