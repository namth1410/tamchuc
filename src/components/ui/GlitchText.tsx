

interface GlitchTextProps {
    text: string;
    className?: string;
    speed?: number;
}

export const GlitchText = ({ text, className = '', speed = 1 }: GlitchTextProps) => {
    return (
        <span className="inline-block relative">
            {/* Base Text */}
            <span className={`relative inline-block z-10 ${className}`}>{text}</span>

            {/* Glitch Layer 1 (Cyan) */}
            <span
                className="absolute top-0 left-[-2px] z-0 opacity-80 animate-glitch-1 pointer-events-none"
                style={{
                    animationDuration: `${2 / speed}s`,
                    color: '#00fff9',
                    clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
                }}
                aria-hidden="true"
            >
                {text}
            </span>

            {/* Glitch Layer 2 (Magenta) */}
            <span
                className="absolute top-0 left-[2px] z-0 opacity-80 animate-glitch-2 pointer-events-none"
                style={{
                    animationDuration: `${3 / speed}s`,
                    color: '#ff00c1',
                    clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
                }}
                aria-hidden="true"
            >
                {text}
            </span>

            <style>{`
        @keyframes glitch-1 {
          0% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); transform: translate(-2px, 2px); }
          20% { clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%); transform: translate(2px, -2px); }
          40% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); transform: translate(2px, 2px); }
          60% { clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%); transform: translate(-2px, -2px); }
          80% { clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%); transform: translate(-2px, 2px); }
          100% { clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%); transform: translate(2px, -2px); }
        }
        
        @keyframes glitch-2 {
          0% { clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); transform: translate(2px, -2px); }
          20% { clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%); transform: translate(-2px, 2px); }
          40% { clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%); transform: translate(2px, 2px); }
          60% { clip-path: polygon(0 15%, 100% 15%, 100% 20%, 0 20%); transform: translate(-2px, -2px); }
          80% { clip-path: polygon(0 2%, 100% 2%, 100% 2%, 0 2%); transform: translate(-2px, 2px); }
          100% { clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); transform: translate(2px, -2px); }
        }
        
        .animate-glitch-1 {
          animation: glitch-1 linear infinite alternate-reverse;
        }
        .animate-glitch-2 {
          animation: glitch-2 linear infinite alternate-reverse;
        }
      `}</style>
        </span>
    );
};
