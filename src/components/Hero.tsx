import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlurText } from './ui/BlurText';
import { Aurora } from './ui/Aurora';
import { GhostCursor } from './ui/GhostCursor';
import { GlitchText } from './ui/GlitchText';
import { MapPin, Calendar, Clock, ChevronDown } from 'lucide-react';

const Hero = () => {
    // Target date: This Sunday at 07:50 AM
    const [timeLeft, setTimeLeft] = useState<{
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
    }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Determine the next Sunday
        const now = new Date();
        const currentDay = now.getDay(); // 0 is Sunday
        const daysUntilSunday = currentDay === 0 ? 0 : 7 - currentDay;

        // Set target to this coming Sunday at 07:50:00
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilSunday);
        targetDate.setHours(7, 50, 0, 0);

        // If it's Sunday but past 7:50 AM, target NEXT Sunday
        if (now.getTime() > targetDate.getTime()) {
            targetDate.setDate(targetDate.getDate() + 7);
        }

        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            const distance = targetDate.getTime() - currentTime;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeBlocks = [
        { label: 'Ngày', value: timeLeft.days },
        { label: 'Giờ', value: timeLeft.hours },
        { label: 'Phút', value: timeLeft.minutes },
        { label: 'Giây', value: timeLeft.seconds },
    ];

    return (
        <section className="relative min-h-[100svh] flex items-center justify-center pt-16 pb-12 overflow-hidden bg-forest-900">
            <GhostCursor />
            {/* Aurora Background Effect */}
            <Aurora colorStops={["#22c55e", "#eab308", "#14532d"]} speed={0.8} />

            <div className="container relative z-10 px-4 mx-auto text-center flex flex-col items-center justify-center h-full">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-morphism w-full max-w-4xl mx-auto rounded-[2.5rem] p-6 sm:p-10 md:p-14 mb-8 relative overflow-hidden group"
                >
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-[2.5rem]"></div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="inline-block bg-gradient-to-r from-gold-500/20 to-gold-600/20 text-gold-400 font-bold px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm tracking-[0.2em] uppercase mb-6 border border-gold-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)] backdrop-blur-md"
                    >
                        ✨ Chuyến Đi Chữa Lành ✨
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-6 md:mb-8 leading-[1.1]">
                        <BlurText delay={0.3}>Đại Hội Võ Lâm</BlurText> <br className="hidden md:block" />
                        <GlitchText speed={1.5} className="text-transparent bg-clip-text bg-gradient-to-r from-forest-300 via-forest-100 to-gold-300 drop-shadow-lg" text="Tam Chúc" />
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-8 text-forest-50/90 mb-10 text-sm md:text-lg font-medium tracking-wide"
                    >
                        <div className="flex items-center gap-2.5 bg-white/5 md:bg-transparent px-4 py-2 md:p-0 rounded-2xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none border border-white/5 md:border-none w-full sm:w-auto hover:text-white transition-colors">
                            <Calendar className="w-5 h-5 text-gold-400 drop-shadow-md" />
                            <span>Chủ Nhật tuần này</span>
                        </div>
                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gold-500/50"></div>
                        <div className="flex items-center gap-2.5 bg-white/5 md:bg-transparent px-4 py-2 md:p-0 rounded-2xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none border border-white/5 md:border-none w-full sm:w-auto hover:text-white transition-colors">
                            <Clock className="w-5 h-5 text-gold-400 drop-shadow-md" />
                            <span>07:50 Sáng</span>
                        </div>
                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gold-500/50"></div>
                        <div className="flex items-center gap-2.5 bg-white/5 md:bg-transparent px-4 py-2 md:p-0 rounded-2xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none border border-white/5 md:border-none w-full sm:w-auto hover:text-white transition-colors">
                            <MapPin className="w-5 h-5 text-gold-400 drop-shadow-md flex-shrink-0" />
                            <span className="text-left leading-tight">Artemis Lê Trọng Tấn</span>
                        </div>
                    </motion.div>

                    {/* Countdown Timer */}
                    <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-3xl mx-auto mt-4">
                        {timeBlocks.map((block, index) => (
                            <motion.div
                                key={block.label}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 + index * 0.1, type: "spring", bounce: 0.4 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-forest-400/20 to-transparent rounded-2xl sm:rounded-[2rem] transform scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                                <div className="bg-forest-900/40 border border-white/10 rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 md:p-8 backdrop-blur-md relative overflow-hidden transition-all duration-300 group-hover:bg-forest-800/60 group-hover:border-forest-300/30 group-hover:shadow-[0_0_30px_rgba(74,222,128,0.15)] group-hover:-translate-y-1">
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>
                                    <div className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-1 md:mb-2 font-display tracking-tight drop-shadow-md">
                                        {String(block.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-forest-200/80 uppercase tracking-[0.2em]">
                                        {block.label}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="mt-10 md:mt-14"
                    >
                        <button onClick={() => {
                            document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' });
                        }} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm md:text-lg font-medium text-white rounded-full group bg-gradient-to-br from-forest-400 to-forest-600 group-hover:from-forest-400 group-hover:to-forest-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-forest-200 dark:focus:ring-forest-800 shadow-[0_10px_40px_-10px_rgba(34,197,94,0.5)] transition-all hover:scale-105 hover:shadow-[0_10px_40px_-5px_rgba(34,197,94,0.7)] w-full sm:w-auto">
                            <span className="relative px-8 py-4 transition-all ease-in duration-75 bg-forest-900/20 backdrop-blur-sm rounded-full group-hover:bg-opacity-0 font-bold tracking-wide flex items-center gap-2">
                                Khám Phá Lộ Trình
                            </span>
                        </button>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="absolute bottom-6 md:bottom-12 animate-bounce cursor-pointer flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-20"
                    onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    <span className="text-white text-[10px] md:text-xs uppercase tracking-[0.3em] font-semibold mb-2">Cuộn Xuống</span>
                    <ChevronDown className="text-white w-5 h-5 md:w-6 md:h-6" />
                </motion.div>
            </div>

            {/* Decorative Wave */}
            <div className="absolute bottom-[-1px] left-0 right-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
                <svg className="relative block w-full h-[60px] md:h-[120px] rotate-180" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-forest-50"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-forest-50"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-forest-50"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
