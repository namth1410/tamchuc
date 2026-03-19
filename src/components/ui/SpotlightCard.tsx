import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface SpotlightCardProps extends HTMLMotionProps<"div"> {
    children?: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

export const SpotlightCard = React.forwardRef<HTMLDivElement, SpotlightCardProps>(({
    children,
    className = '',
    spotlightColor = 'rgba(255, 255, 255, 0.1)',
    ...props
}, forwardedRef) => {
    const backupRef = useRef<HTMLDivElement>(null);
    const divRef = (forwardedRef as React.RefObject<HTMLDivElement>) || backupRef;

    const [isFocused, setIsFocused] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current || isFocused) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });

        if (props.onMouseMove) {
            props.onMouseMove(e);
        }
    };

    const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
        setIsFocused(true);
        setOpacity(1);
        if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        setIsFocused(false);
        setOpacity(0);
        if (props.onBlur) props.onBlur(e);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        setOpacity(1);
        if (props.onMouseEnter) props.onMouseEnter(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        setOpacity(0);
        if (props.onMouseLeave) props.onMouseLeave(e);
    };

    return (
        <motion.div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden ${className}`}
            {...props}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            {children as React.ReactNode}
        </motion.div>
    );
});

SpotlightCard.displayName = "SpotlightCard";
