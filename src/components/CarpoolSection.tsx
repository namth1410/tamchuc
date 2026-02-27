import { useState, useRef } from 'react';
import type { MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Bike, Users, ShieldCheck, Route } from 'lucide-react';

const carpoolData = [
    { id: 1, driver: 'Hiếu', driverAvatar: '/Hiếu.png', passenger: 'Dung', passengerAvatar: '/Dung.png', color: 'from-blue-500 to-cyan-500', shadow: 'shadow-cyan-500/50' },
    { id: 2, driver: 'Định', driverAvatar: '/Định.png', passenger: 'Tâm', passengerAvatar: '/Tâm.png', color: 'from-purple-500 to-pink-500', shadow: 'shadow-pink-500/50' },
    { id: 3, driver: 'Tuyển', driverAvatar: '/Tuyển.png', passenger: 'Tân', passengerAvatar: '/Tân.png', color: 'from-green-500 to-emerald-500', shadow: 'shadow-emerald-500/50' },
    { id: 4, driver: 'Dũng', driverAvatar: '/Dũng.png', passenger: 'Linh', passengerAvatar: '/Linh.png', color: 'from-orange-500 to-red-500', shadow: 'shadow-red-500/50' },
    { id: 5, driver: 'Quyết', driverAvatar: '/Quyết.png', passenger: 'Trang', passengerAvatar: '/Trang.png', color: 'from-indigo-500 to-blue-500', shadow: 'shadow-blue-500/50' },
    { id: 6, driver: 'Nam', driverAvatar: '/Nam.jpeg', passenger: null, passengerAvatar: null, color: 'from-teal-500 to-forest-500', shadow: 'shadow-forest-500/50' },
];

const CarpoolCard = ({ pair, index, isHovered, onHover, onLeave }: any) => {
    const cardRef = useRef<HTMLDivElement>(null);

    // Spring animations for tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
    const scale = useSpring(1, { stiffness: 300, damping: 20 });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseEnter = () => {
        onHover();
        scale.set(1.05);
    };

    const handleMouseLeave = () => {
        onLeave();
        x.set(0);
        y.set(0);
        scale.set(1);
    };

    // Determine opacity based on spotlight effect
    const opacity = isHovered === null || isHovered === pair.id ? 1 : 0.4;
    const zIndex = isHovered === pair.id ? 20 : 1;

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                scale,
                zIndex,
                opacity,
            }}
            className="perspective-1000 relative group"
        >
            <div className="relative glass-morphism p-8 rounded-[2.5rem] border border-white/10 group-hover:border-white/40 transition-colors duration-300 h-full flex flex-col justify-between overflow-hidden shadow-2xl bg-white/5 backdrop-blur-xl">
                {/* Glowing Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pair.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className={`absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br ${pair.color} rounded-full blur-[80px] opacity-0 group-hover:opacity-60 transition-opacity duration-700`} />

                {/* Shiny overlay */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        backgroundPosition: useTransform(mouseXSpring, [-0.5, 0.5], ["0% 0%", "100% 100%"])
                    }}
                />

                <div className="relative z-10 w-full">
                    {/* Top Icon */}
                    <div className="flex justify-between items-start mb-10 w-full">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${pair.color} ${pair.shadow} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                            <Bike className="text-white w-7 h-7" />
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md relative overflow-hidden group-hover:border-white/40 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 group-hover:animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest relative z-10">
                                Sẵn sàng
                            </span>
                        </div>
                    </div>

                    <div className="space-y-8 flex-grow">
                        {/* Driver */}
                        <div className="flex items-center gap-5 relative group/driver">
                            <div className="relative">
                                {/* Pulse effect behind avatar */}
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${pair.color} blur-md opacity-40 group-hover/driver:opacity-80 group-hover/driver:scale-125 transition-all duration-500`} />
                                <img
                                    src={pair.driverAvatar}
                                    alt={pair.driver}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-white relative z-10 shadow-lg group-hover/driver:scale-105 transition-transform"
                                />
                                <div className="absolute -bottom-1 -right-1 bg-forest-900 rounded-full p-1 border border-white/20 z-20 shadow-md">
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${pair.color}`} />
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.2em] mb-1 flex items-center gap-1.5">
                                    Tài xế / Xế
                                </p>
                                <h3 className="text-2xl font-black text-white/90 tracking-tight group-hover/driver:text-white transition-colors">{pair.driver}</h3>
                            </div>
                        </div>

                        {/* Passenger */}
                        {pair.passenger ? (
                            <div className="flex items-center gap-5 pl-4 relative group/passenger">
                                {/* Animated Connecting Line */}
                                <div className="absolute left-[-10px] top-[-30px] bottom-[30px] w-12 overflow-hidden pointer-events-none">
                                    <svg className="absolute w-full h-full left-0 top-0 overflow-visible" preserveAspectRatio="none">
                                        <path
                                            d="M 10 0 C 10 20, 10 30, 10 60"
                                            fill="transparent"
                                            stroke="rgba(255,255,255,0.2)"
                                            strokeWidth="2"
                                            strokeDasharray="4 4"
                                            className="group-hover:stroke-white/50 transition-colors"
                                        />
                                        <motion.circle
                                            cx="10"
                                            cy="0"
                                            r="3"
                                            fill="#eab308"
                                            initial={{ cy: 0, opacity: 0 }}
                                            animate={{ cy: [0, 60], opacity: [0, 1, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            className="opacity-0 group-hover:opacity-100"
                                        />
                                    </svg>
                                </div>

                                <div className="relative">
                                    <div className={`absolute inset-0 rounded-full bg-white/20 blur-md opacity-30 group-hover/passenger:opacity-60 group-hover/passenger:scale-125 transition-all duration-500`} />
                                    <img
                                        src={pair.passengerAvatar || ''}
                                        alt={pair.passenger}
                                        className="w-14 h-14 rounded-full object-cover border-2 border-white/60 relative z-10 shadow-md group-hover/passenger:scale-105 transition-transform"
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-forest-900/80 backdrop-blur-sm rounded-full p-1 border border-white/20 z-20">
                                        <div className={`w-2.5 h-2.5 rounded-full bg-slate-300`} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-forest-300 uppercase tracking-[0.2em] mb-1">Bạn đồng hành / Ôm</p>
                                    <h3 className="text-xl font-bold text-white/80 tracking-tight group-hover/passenger:text-white transition-colors">{pair.passenger}</h3>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-5 pl-4 opacity-70 group-hover:opacity-100 transition-opacity">
                                <div className="absolute left-[-10px] top-[-30px] bottom-[30px] w-12 overflow-hidden pointer-events-none">
                                    <svg className="absolute w-full h-full left-0 top-0 overflow-visible" preserveAspectRatio="none">
                                        <path
                                            d="M 10 0 C 10 20, 10 30, 10 60"
                                            fill="transparent"
                                            stroke="rgba(255,255,255,0.1)"
                                            strokeWidth="2"
                                            strokeDasharray="2 4"
                                        />
                                    </svg>
                                </div>
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/20 flex items-center justify-center relative overflow-hidden group/solo">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 group-hover/solo:from-white/10 transition-colors" />
                                    <Users className="w-6 h-6 text-white/40 group-hover/solo:text-white/70 transition-colors" />
                                </div>
                                <p className="text-sm font-medium italic text-forest-300/60 group-hover:text-forest-300 transition-colors">Xe độc hành (Tìm thêm ôm)</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 pt-5 border-t border-white/10 relative z-10 flex justify-between items-center group/footer">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Route className="w-3 h-3 text-white/20 group-hover/footer:text-gold-400 group-hover/footer:animate-pulse transition-colors" />
                        Cặp số {String(pair.id).padStart(2, '0')}
                    </span>
                    <motion.div
                        className={`w-6 h-6 rounded-full flex items-center justify-center border border-white/20 bg-white/5`}
                        whileHover={{ scale: 1.2, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Bike className="w-3 h-3 text-white/50 group-hover:text-gold-400 transition-colors" />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

const CarpoolSection = () => {
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <section className="py-20 md:py-32 bg-forest-900 relative overflow-hidden" id="carpool">
            {/* Perspective container needed for 3D tilt */}
            <style>{`
                .perspective-1000 { perspective: 1000px; transform-style: preserve-3d; }
                @keyframes shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>

            {/* Dynamic Abstract Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-5%] w-[50rem] h-[50rem] bg-forest-600/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-gold-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s', animationDuration: '4s' }}></div>
                <div className="absolute top-[40%] left-[60%] w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>

                {/* Parallax elements */}
                <div className="absolute top-[20%] right-[10%] opacity-10">
                    <Bike className="w-64 h-64 text-white -rotate-12" />
                </div>
                <div className="absolute bottom-[20%] left-[5%] opacity-[0.03]">
                    <Users className="w-96 h-96 text-white rotate-12" />
                </div>
            </div>

            <div className="container px-4 sm:px-6 mx-auto relative z-10">
                <div className="text-center mb-16 md:mb-24 relative">
                    {/* Glowing effect behind title */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-gold-500/10 blur-[80px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-forest-800/80 to-forest-900/80 backdrop-blur-md border border-forest-400/30 text-gold-400 font-bold px-6 py-2.5 rounded-full text-xs sm:text-sm tracking-[0.2em] uppercase mb-8 shadow-[0_0_30px_rgba(234,179,8,0.15)] relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
                        <Bike className="w-4 h-4" />
                        <span>Xếp Xe Đi Chung</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1, duration: 0.7 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-tight drop-shadow-2xl"
                    >
                        Biệt Đội <span className="text-transparent bg-clip-text bg-gradient-to-br from-gold-300 via-gold-400 to-amber-600 relative inline-block">
                            Xế & Ôm
                            <motion.div
                                className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-1 md:h-2 bg-gradient-to-r from-gold-300/0 via-gold-400 to-gold-300/0"
                                initial={{ scaleX: 0, opacity: 0 }}
                                whileInView={{ scaleX: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-forest-100/60 text-lg md:text-2xl max-w-3xl mx-auto px-4 font-medium leading-relaxed"
                    >
                        Phân bổ xe cộ để đảm bảo không ai bị bỏ lại phía sau. Anh em kiểm tra đúng tổ hợp của mình nhé! 🛵💨
                    </motion.p>
                </div>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 sm:px-6 md:px-0 lg:max-w-7xl mx-auto"
                >
                    {carpoolData.map((pair, index) => (
                        <CarpoolCard
                            key={pair.id}
                            pair={pair}
                            index={index}
                            isHovered={hoveredId}
                            onHover={() => setHoveredId(pair.id)}
                            onLeave={() => setHoveredId(null)}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom transition wave matching theme */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180 leading-none opacity-[0.15] mix-blend-screen pointer-events-none">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16 md:h-32">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.29C80.7,52.47,157.2,74.51,232.49,81.38,274.32,85.2,332.3,71.04,321.39,56.44Z" fill="url(#gradient-wave)"></path>
                    <defs>
                        <linearGradient id="gradient-wave" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#eab308" />
                            <stop offset="50%" stopColor="#3ea070" />
                            <stop offset="100%" stopColor="#eab308" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className="absolute bottom-0 left-0 w-full overflow-hidden rotate-180 leading-none pointer-events-none z-0">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-8 md:h-16">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.29C80.7,52.47,157.2,74.51,232.49,81.38,274.32,85.2,332.3,71.04,321.39,56.44Z" className="fill-forest-50"></path>
                </svg>
            </div>
        </section>
    );
};

export default CarpoolSection;
