import { motion } from 'framer-motion';

interface AuroraProps {
    className?: string;
    colorStops?: string[];
    blend?: number;
    amplitude?: number;
    speed?: number;
}

export const Aurora = ({
    className = '',
    colorStops = ["#3b82f6", "#22c55e", "#eab308"],
    speed = 0.5
}: AuroraProps) => {
    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            <div className="absolute inset-0 bg-[#020617] opacity-90 z-0"></div>
            <motion.div
                className="absolute -inset-[100%] opacity-50 z-10"
                style={{
                    backgroundImage: `repeating-linear-gradient(100deg, transparent, transparent 100px, rgba(255,255,255,0.03) 100px, rgba(255,255,255,0.03) 101px)`,
                    backgroundSize: '200px 200px'
                }}
            />

            {/* Animated Aurora Blobs */}
            <motion.div
                animate={{
                    x: ["0%", "20%", "-20%", "0%"],
                    y: ["0%", "-20%", "20%", "0%"],
                    rotate: [0, 90, 180, 360],
                }}
                transition={{
                    duration: 20 / speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-[100%] mix-blend-screen filter blur-[8vw] z-10 opacity-60"
                style={{ background: colorStops[0] || "#3b82f6" }}
            />
            <motion.div
                animate={{
                    x: ["0%", "-20%", "20%", "0%"],
                    y: ["0%", "20%", "-20%", "0%"],
                    rotate: [360, 180, 90, 0],
                }}
                transition={{
                    duration: 25 / speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-[100%] mix-blend-screen filter blur-[10vw] z-10 opacity-50"
                style={{ background: colorStops[1] || "#22c55e" }}
            />
            <motion.div
                animate={{
                    x: ["-20%", "20%", "0%", "-20%"],
                    y: ["20%", "0%", "-20%", "20%"],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{
                    duration: 30 / speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
                className="absolute top-1/2 left-1/2 -px-[25vw] -py-[25vw] w-[45vw] h-[45vw] rounded-[100%] mix-blend-screen filter blur-[9vw] z-10 opacity-40"
                style={{ background: colorStops[2] || "#eab308" }}
            />
            {/* Overlay gradient to smooth it out towards bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-20"></div>
        </div>
    );
};
