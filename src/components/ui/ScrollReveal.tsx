import { motion } from 'framer-motion';

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    amount?: number | "some" | "all";
    delay?: number;
    yOffset?: number;
    xOffset?: number;
}

export const ScrollReveal = ({
    children,
    className = '',
    amount = 0.3,
    delay = 0,
    yOffset = 30,
    xOffset = 0,
}: ScrollRevealProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: yOffset, x: xOffset }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            viewport={{ once: true, amount }}
            transition={{ duration: 0.6, delay, ease: [0.25, 1, 0.5, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};
