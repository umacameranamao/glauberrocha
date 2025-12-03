import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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


const cinemas = [
    { name: "CINE ALIANÇA", address: "R. Dr. Seabra - 231, Nazaré", lat: -12.9774, lng: -38.5081, seats: "1.106", viewers: "265.440" },
    { name: "CINE ART", address: "R. Tomé de Souza 5, Centro (Sé/Piedade)", lat: -12.9779, lng: -38.5135, seats: "579", viewers: "320.400" },
    { name: "CINE BRASIL", address: "R. Lima e Silva 194, Liberdade", lat: -12.9515, lng: -38.4891, seats: "893", viewers: "328.600" },
    { name: "CINE EXCELCIOR", address: "Pça. da Sé s/n, Sé", lat: -12.9734, lng: -38.5100, seats: "778", viewers: "758.544" },
    { name: "CINE GLÓRIA", address: "R. Rui Barbosa 1, Campo Grande", lat: -12.9840, lng: -38.5173, seats: "540", viewers: "329.133" },
    { name: "CINE IDEAL", address: "R. 7 de Setembro s/n, Centro", lat: -12.9785, lng: -38.5110, seats: "150", viewers: "6.450" },
    { name: "CINE ITAPOAN", address: "R. Engenheiro Figueiredo, Itapoan", lat: -12.9542, lng: -38.3755, seats: "1.340", viewers: "44.546" },
    { name: "CINE MERCURIO", address: "R. Sergio Cardoso 28, Calçada (possível)", lat: -12.9440, lng: -38.4988, seats: "N/D", viewers: "22.698" },
    { name: "CINE OCEANIA", address: "R. Marques de Leão 1, Vitória", lat: -12.9868, lng: -38.5256, seats: "453", viewers: "74.320" },
    { name: "CINE PAX", address: "R. Dr. J.J.Seabra s/n, Nazaré (Baixa dos Sapateiros)", lat: -12.9789, lng: -38.5085, seats: "1.778", viewers: "450.430" },
    { name: "CINE RIO VERMELHO", address: "R. João Gomes 35, Rio Vermelho", lat: -12.9904, lng: -38.4907, seats: "782", viewers: "153.620" },
    { name: "CINE ROMA", address: "Pça. da Bandeira s/n, Centro (Nazaré)", lat: -12.9770, lng: -38.5090, seats: "1.850", viewers: "395.261" },
    { name: "CINE SÃO BRAZ", address: "Alameda Brandão, Plataforma", lat: -12.9090, lng: -38.4815, seats: "500", viewers: "N/D" },
    { name: "CINE SÃO CAETANO", address: "R. Eng. Austricliano 24, Sto. Antonio (Liberdade)", lat: -12.9482, lng: -38.4910, seats: "537", viewers: "270.694" },
    { name: "CINE TEATRO AMPARO", address: "R. Alm. Alves Camara s/n, Saúde (possível)", lat: -12.9590, lng: -38.5140, seats: "750", viewers: "75.320" },
    { name: "CINE TEATRO JANDAIA", address: "R. Dr. J.J. Seabra 28, Nazaré (Baixa dos Sapateiros)", lat: -12.9787, lng: -38.5087, seats: "2.100", viewers: "560.062" },
    { name: "CINE TEATR PERIPERI", address: "Av. 2 de Julho 75, Periperi", lat: -12.8755, lng: -38.4680, seats: "212", viewers: "N/D" },
    { name: "CINEMA BONFIM", address: "R. Barão de Cotegipe 98, Mares", lat: -12.9351, lng: -38.4950, seats: "509", viewers: "119.650" },
    { name: "CINEMA CASA STO. ANTONIO", address: "R. de São Francisco s/n, Santo Antônio Além do Carmo", lat: -12.9699, lng: -38.5144, seats: "683", viewers: "321.436" },
    { name: "CINEMA ITAPAGIPE", address: "Pça. Cons. Freire de Carvalho 1, Itapagipe (Ribeira)", lat: -12.9288, lng: -38.5042, seats: "810", viewers: "166.921" },
    { name: "CINEMA LIBERDADE", address: "R. Lima e Silva s/n, Liberdade", lat: -12.9525, lng: -38.4895, seats: "377", viewers: "55.285" },
    { name: "CINEMA LICEU", address: "R. Saldanha da Gama s/n, Nazaré", lat: -12.9720, lng: -38.5080, seats: "1.081", viewers: "342.685" },
    { name: "CINEMA POPULAR", address: "R. 7 de Setembro s/n, Centro", lat: -12.9785, lng: -38.5110, seats: "690", viewers: "169.183" },
    { name: "CINE BAHIA", address: "Povoado de São Cristovão - Ipitanga, São Cristóvão", lat: -12.9030, lng: -38.3580, seats: "500", viewers: "N/D" },
    { name: "CINE GUARANI", address: "Pça. Castro Alves s/n, Castro Alves", lat: -12.9750, lng: -38.5113, seats: "N/D", viewers: "N/D" },
    { name: "CINE TEATRO GUARANI", address: "Pça. Castro Alves s/n, Castro Alves", lat: -12.9749, lng: -38.5113, seats: "1.086", viewers: "971.680" },
    { name: "CINE CAPRI", address: "Pça. Inocencio Galvão 33, Saúde (possível)", lat: -12.9770, lng: -38.5115, seats: "1.004", viewers: "513.803" },
    { name: "CINE TUPY", address: "R. Dr. J.J. Seabra 371, Nazaré (Baixa dos Sapateiros)", lat: -12.9780, lng: -38.5080, seats: "1.256", viewers: "470.583" },
    { name: "AUDITÓRIO INST. NORMAL", address: "Pça do Barbalho s/n, Barbalho", lat: -12.9653, lng: -38.5087, seats: "1.596", viewers: "148.600" },
    { name: "CINE MADRE DE DEUS", address: "Madre de Deus, Madre de Deus (Município)", lat: -12.7408, lng: -38.6208, seats: "150", viewers: "8.960" },
    { name: "TEATRO OCEANIA", address: "Farol da Barra, Barra", lat: -13.0076, lng: -38.5323, seats: "300", viewers: "32.000" },
];

const MapaCinemas = () => {
    return (
        <div className="relative w-full h-[600px] rounded-xl overflow-hidden border-2 border-primary/30 shadow-2xl">
            <MapContainer
                center={[-12.9750, -38.5113]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    className="map-tiles-filter"
                />
                {cinemas.map((cinema, index) => (
                    <Marker
                        key={index}
                        position={[cinema.lat, cinema.lng]}
                        icon={customIcon}
                    >
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
        }
      `}</style>
        </div>
    );
};

export default MapaCinemas;
