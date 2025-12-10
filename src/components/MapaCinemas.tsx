import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import { ExternalLink } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom Icon using HTML string
const customIcon = L.divIcon({
    className: 'custom-icon',
    html: `
        <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute inset-0 rounded-full bg-[#8A1C1C] opacity-30 animate-ping"></span>
            <div class="relative z-10 text-[#8A1C1C] hover:text-[#D4AF37] transition-colors duration-300 transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            </div>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const inactiveIcon = L.divIcon({
    className: 'custom-icon-inactive',
    html: `
        <div class="relative flex items-center justify-center w-8 h-8">
            <div class="relative z-10 text-gray-500 hover:text-gray-400 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <path d="M9.5 7.5L14.5 12.5M14.5 7.5L9.5 12.5" stroke="#262626" stroke-width="2.5" />
                </svg>
            </div>
        </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});


const cinemas = [
    { name: "CINE ALIANÇA", address: "R. Dr. Seabra - 231, Nazaré", lat: -12.972076, lng: -38.507504, seats: "1.106", viewers: "265.440", active: false },
    { name: "CINE JANDAIA", address: "R. Dr. J.J. Seabra 28, Nazaré (Baixa dos Sapateiros)", lat: -12.973232, lng: -38.507475, seats: "2.100", viewers: "560.062", active: false },
    { name: "CINEMA BONFIM", address: "R. Barão de Cotegipe 98, Mares", lat: -12.942216, lng: -38.502578, seats: "509", viewers: "119.650", active: false },
    { name: "CINE TUPY", address: "R. Dr. J.J. Seabra 371, Nazaré (Baixa dos Sapateiros)", lat: -12.968431, lng: -38.505196, seats: "150 (uma das salas)", viewers: "~35 por dia", active: true },
    { name: "CINE EXCELSIOR", address: "Pça. da Sé s/n, Sé", lat: -12.972977, lng: -38.511141, seats: "778", viewers: "758.544", active: false },
    { name: "CINE GLÓRIA", address: "R. Rui Barbosa 1, Campo Grande", lat: -12.979147, lng: -38.506273, seats: "540", viewers: "329.133", active: false },
    { name: "CINE CAPRI", address: "Pça. Inocencio Galvão 33, Saúde (possível)", lat: -12.981514, lng: -38.516505, seats: "1.004", viewers: "513.803", active: false },
    { name: "CINE GLAUBER ROCHA", address: "Praça Castro Alves, 5 - Centro", lat: -12.977020, lng: -38.514294, seats: "800 (5 salas)", viewers: "N/D", active: true },
    { name: "SALA WALTER DA SILVEIRA (BARRIS)", address: "R. Gen. Labatut, 27 - Barris (Centro Cultural dos Barris)", lat: -12.985558, lng: -38.512948, seats: "200 (sala única)", viewers: "N/D", active: true },
    { name: "SALA MAM", address: "MAM - Solar do Unhão - Av. Contorno, s/n - Dois de Julho", lat: -12.981853, lng: -38.519852, seats: "100-200 (sala única)", viewers: "N/D", active: true },
    { name: "SALADEARTE CINEMA DA UFBA", address: "Av. Reitor Miguel Calmon, s/n - Canela", lat: -12.995114, lng: -38.518799, seats: "102 (sala única)", viewers: "N/D", active: true },
];

const bounds = L.latLngBounds(
    cinemas.map(c => [c.lat, c.lng])
);

const MapController = () => {
    const map = useMap();

    useMapEvents({
        popupclose: () => {
            map.flyToBounds(bounds, {
                padding: [50, 50],
                duration: 2.5, // Slower animation to allow tiles to load
                easeLinearity: 0.25
            });
        }
    });

    return null;
};

const MapaCinemas = () => {
    return (
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl">
            <MapContainer
                bounds={bounds}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                dragging={false}
                attributionControl={false}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <MapController />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    className="map-tiles-filter"
                    keepBuffer={20} // Keep more tiles in memory
                />
                {cinemas.map((cinema, index) => (
                    <Marker
                        key={index}
                        position={[cinema.lat, cinema.lng]}
                        icon={cinema.active ? customIcon : inactiveIcon}
                        eventHandlers={{
                            click: (e) => {
                                const map = e.target._map;
                                map.flyTo([cinema.lat, cinema.lng], 16, {
                                    duration: 1.5,
                                    easeLinearity: 0.25
                                });
                            },
                        }}
                    >
                        <Tooltip
                            direction="top"
                            offset={[0, -20]}
                            opacity={1}
                            className="custom-tooltip"
                        >
                            {cinema.name}
                        </Tooltip>
                        <Popup className="custom-popup">
                            <div className="p-2 font-grotesque">
                                <h3 className="font-stencil text-lg text-primary mb-1">{cinema.name}</h3>
                                <p className="text-sm text-foreground/80 mb-2">{cinema.address}</p>
                                <div className="grid grid-cols-2 gap-2 text-xs border-t border-primary/20 pt-2">
                                    <div>
                                        <span className="block text-primary font-bold">Lugares:</span>
                                        <span className="text-foreground/70">{cinema.seats}</span>
                                    </div>
                                    <div>
                                        <span className="block text-primary font-bold">Espectadores:</span>
                                        <span className="text-foreground/70">{cinema.viewers}</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${cinema.lat},${cinema.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 mt-3 text-xs text-accent hover:text-accent/80 transition-colors"
                                >
                                    <ExternalLink size={12} />
                                    Ver como está atualmente (Street View)
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Overlay Effects */}
            <div className="absolute inset-0 pointer-events-none z-[400] bg-sepia mix-blend-overlay opacity-30" />
            <div className="absolute inset-0 pointer-events-none z-[400] bg-noise opacity-10" />
            <div className="absolute inset-0 pointer-events-none z-[400] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

            <style>{`
        .map-tiles-filter {
          filter: grayscale(100%) contrast(1.2) sepia(20%);
        }
        .leaflet-popup-content-wrapper {
          background: rgba(20, 20, 20, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(138, 28, 28, 0.5);
          border-radius: 8px;
          color: white;
        }
        .leaflet-popup-tip {
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid rgba(138, 28, 28, 0.5);
        }
        .leaflet-container {
            font-family: 'Space Grotesk', sans-serif;
            background-color: #262626; /* Match dark theme to hide loading flash */
        }
        /* Custom Tooltip Styles */
        .custom-tooltip {
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #D4AF37;
            color: #D4AF37;
            font-family: 'Space Grotesk', sans-serif;
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
            padding: 4px 8px;
            border-radius: 4px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .leaflet-tooltip-top:before {
            border-top-color: #D4AF37;
        }
      `}</style>
        </div>
    );
};

export default MapaCinemas;
