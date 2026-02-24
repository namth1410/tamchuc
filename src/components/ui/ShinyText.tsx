interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

export const ShinyText = ({ text, disabled = false, speed = 3, className = '' }: ShinyTextProps) => {
    return (
        <span
            className={`text-transparent bg-clip-text inline-block ${disabled ? '' : 'animate-shine'} ${className}`}
            style={{
                backgroundImage: 'linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.8) 50%, transparent 60%)',
                backgroundColor: 'currentColor',
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                animationDuration: `${speed}s`,
            }}
        >
            {text}
            <style>{`
        @keyframes shine {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
        .animate-shine {
          animation: shine linear infinite;
        }
      `}</style>
        </span>
    );
};
