import { motion } from 'framer-motion';

interface BlurTextProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export const BlurText = ({ children, className = '', delay = 0 }: BlurTextProps) => {
    return (
        <motion.span
            initial={{ filter: 'blur(10px)', opacity: 0, y: 10 }}
            animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.span>
    );
};
