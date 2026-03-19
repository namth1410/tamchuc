import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TiltProps {
    children: React.ReactNode;
    className?: string;
    rotationFactor?: number;
    isReverse?: boolean;
}

export const Tilt = ({ children, className = '', rotationFactor = 15, isReverse = false }: TiltProps) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], isReverse ? [`-${rotationFactor}deg`, `${rotationFactor}deg`] : [`${rotationFactor}deg`, `-${rotationFactor}deg`]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], isReverse ? [`${rotationFactor}deg`, `-${rotationFactor}deg`] : [`-${rotationFactor}deg`, `${rotationFactor}deg`]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate values between -0.5 and 0.5
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={className}
        >
            {/* 
        This wrapper applies a translateZ to pop children out 
        from the rotating plane if desired, otherwise acts as a standard container
      */}
            <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="w-full h-full">
                {children}
            </div>
        </motion.div>
    );
};
