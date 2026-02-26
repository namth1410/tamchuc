import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

const ECO_GREEN_CITY = {
    lng: 105.8088007,
    lat: 20.9834822,
    name: 'Eco Green City',
    address: 'Nguyễn Xiển, Thanh Trì, Hà Nội',
};

const MapSection = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [ECO_GREEN_CITY.lng, ECO_GREEN_CITY.lat],
            zoom: 15,
            attributionControl: false,
        });

        map.addControl(new maplibregl.NavigationControl(), 'top-right');
        map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

        // Create custom marker element
        const markerEl = document.createElement('div');
        markerEl.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
                <div style="
                    background: linear-gradient(135deg, #22c55e, #15803d);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 14px;
                    box-shadow: 0 4px 20px rgba(34,197,94,0.4);
                    white-space: nowrap;
                    transform: translateY(-4px);
                    border: 2px solid rgba(255,255,255,0.8);
                ">📍 Eco Green City</div>
                <div style="
                    width: 3px;
                    height: 12px;
                    background: linear-gradient(to bottom, #22c55e, transparent);
                "></div>
                <div style="
                    width: 14px;
                    height: 14px;
                    background: #22c55e;
                    border-radius: 50%;
                    box-shadow: 0 0 0 4px rgba(34,197,94,0.3), 0 0 0 8px rgba(34,197,94,0.1);
                    animation: pulse-marker 2s ease-in-out infinite;
                "></div>
            </div>
        `;

        new maplibregl.Marker({ element: markerEl })
            .setLngLat([ECO_GREEN_CITY.lng, ECO_GREEN_CITY.lat])
            .addTo(map);

        // Add pulse animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse-marker {
                0%, 100% { box-shadow: 0 0 0 4px rgba(34,197,94,0.3), 0 0 0 8px rgba(34,197,94,0.1); }
                50% { box-shadow: 0 0 0 8px rgba(34,197,94,0.2), 0 0 0 16px rgba(34,197,94,0.05); }
            }
        `;
        document.head.appendChild(style);

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
            style.remove();
        };
    }, []);

    const handleDirections = () => {
        window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${ECO_GREEN_CITY.lat},${ECO_GREEN_CITY.lng}&destination_place_id=Eco+Green+City`,
            '_blank'
        );
    };

    return (
        <section className="py-16 md:py-24 bg-forest-50 relative overflow-hidden" id="meeting-point">
            {/* Decorative blobs */}
            <div className="absolute top-10 right-[-10%] w-[30rem] h-[30rem] bg-forest-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-10 left-[-5%] w-[25rem] h-[25rem] bg-gold-200/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 pointer-events-none"></div>

            <div className="container px-4 sm:px-6 mx-auto relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-14">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block bg-forest-100 text-forest-600 font-bold px-4 py-1.5 rounded-full text-sm tracking-widest uppercase mb-4 shadow-sm"
                    >
                        <MapPin className="inline w-4 h-4 mr-1.5 -mt-0.5" />
                        Điểm Tập Hợp
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-forest-900 mb-3 tracking-tight"
                    >
                        Eco Green City
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-lg max-w-xl mx-auto font-medium"
                    >
                        {ECO_GREEN_CITY.address} — Tập trung lúc <strong className="text-forest-700">07:50 sáng</strong> Chủ Nhật
                    </motion.p>
                </div>

                {/* Map Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border border-white/80 bg-white/70 backdrop-blur-xl">
                        {/* Map Container */}
                        <div
                            ref={mapContainer}
                            className="w-full h-[300px] sm:h-[400px] md:h-[450px]"
                        />

                        {/* Info Bar */}
                        <div className="p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center shadow-md flex-shrink-0">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-forest-900 text-lg">{ECO_GREEN_CITY.name}</h3>
                                    <p className="text-slate-400 text-sm">{ECO_GREEN_CITY.address}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={handleDirections}
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-forest-500 to-forest-600 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                                >
                                    <Navigation className="w-4 h-4" />
                                    Chỉ đường
                                </button>
                                <a
                                    href="https://maps.app.goo.gl/FNouijDX21yw7mPz6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-forest-50 text-forest-700 font-semibold text-sm border border-forest-200 hover:bg-forest-100 hover:scale-105 transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default MapSection;
