import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface AnimatedCheckboxProps {
    checked: boolean;
    onChange: () => void;
    className?: string;
}

export const AnimatedCheckbox = ({ checked, onChange, className = '' }: AnimatedCheckboxProps) => {
    return (
        <motion.button
            onClick={onChange}
            className={`relative flex items-center justify-center rounded-lg border-2 transition-colors duration-300 overflow-hidden ${checked
                    ? 'bg-gradient-to-tr from-forest-500 to-emerald-400 border-transparent shadow-[0_0_15px_rgba(52,211,153,0.4)]'
                    : 'bg-white/40 border-forest-300 hover:border-forest-400'
                } ${className}`}
            whileTap={{ scale: 0.85 }}
            initial={false}
            animate={{ scale: checked ? [1, 1.1, 1] : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25, delay: 0.1 }}
            >
                <Check className="w-4 h-4 md:w-5 md:h-5 text-white" strokeWidth={3} />
            </motion.div>

            {/* Morphing ring effect on check */}
            {checked && (
                <motion.div
                    className="absolute inset-0 rounded-lg border border-emerald-300"
                    initial={{ scale: 0.8, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            )}
        </motion.button>
    );
};
