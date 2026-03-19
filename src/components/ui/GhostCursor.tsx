import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const GhostCursor = () => {
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    const springConfigSlow = { damping: 30, stiffness: 100, mass: 1.5 };
    const springXSlow = useSpring(cursorX, springConfigSlow);
    const springYSlow = useSpring(cursorY, springConfigSlow);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', moveCursor);
        document.body.addEventListener('mouseleave', handleMouseLeave);
        document.body.addEventListener('mouseenter', handleMouseEnter);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
        };
    }, [cursorX, cursorY, isVisible]);

    if (typeof window === "undefined" || window.innerWidth < 768) return null; // Only on desktop

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <motion.div
                className="absolute w-8 h-8 rounded-full bg-forest-400 mix-blend-screen filter blur-md opacity-50"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 0.6 : 0,
                }}
            />
            <motion.div
                className="absolute w-16 h-16 rounded-full bg-gold-400 mix-blend-screen filter blur-xl opacity-30"
                style={{
                    x: springXSlow,
                    y: springYSlow,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 0.4 : 0,
                }}
            />
        </div>
    );
};
