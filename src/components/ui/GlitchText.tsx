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

            {/* Glitch Layer 1 */}
            <span
                className={`absolute top-0 left-0 z-20 opacity-90 animate-glitch-1 pointer-events-none ${className}`}
                style={{
                    animationDuration: `${2 / speed}s`,
                    filter: 'hue-rotate(-90deg) drop-shadow(0 0 4px rgba(0,255,255,0.4))'
                }}
                aria-hidden="true"
            >
                {text}
            </span>

            {/* Glitch Layer 2 */}
            <span
                className={`absolute top-0 left-0 z-20 opacity-90 animate-glitch-2 pointer-events-none ${className}`}
                style={{
                    animationDuration: `${3 / speed}s`,
                    filter: 'hue-rotate(90deg) drop-shadow(0 0 4px rgba(255,0,255,0.4))'
                }}
                aria-hidden="true"
            >
                {text}
            </span>

            <style>{`
        @keyframes glitch-1 {
          0% { clip-path: inset(20% 0 80% 0); transform: translate(-4px, 1px); }
          10% { clip-path: inset(10% 0 60% 0); transform: translate(4px, -1px); }
          20% { clip-path: inset(80% 0 5% 0); transform: translate(-4px, -2px); }
          30% { clip-path: inset(40% 0 50% 0); transform: translate(4px, 2px); }
          40% { clip-path: inset(60% 0 20% 0); transform: translate(-4px, 1px); }
          50% { clip-path: inset(15% 0 80% 0); transform: translate(4px, -1px); }
          60% { clip-path: inset(70% 0 10% 0); transform: translate(-4px, 2px); }
          70% { clip-path: inset(5% 0 70% 0); transform: translate(4px, -2px); }
          80% { clip-path: inset(50% 0 30% 0); transform: translate(-4px, 1px); }
          90% { clip-path: inset(30% 0 40% 0); transform: translate(4px, -1px); }
          100% { clip-path: inset(20% 0 50% 0); transform: translate(-4px, 2px); }
        }
        
        @keyframes glitch-2 {
          0% { clip-path: inset(10% 0 60% 0); transform: translate(4px, -1px); }
          10% { clip-path: inset(30% 0 20% 0); transform: translate(-4px, 2px); }
          20% { clip-path: inset(70% 0 10% 0); transform: translate(4px, 1px); }
          30% { clip-path: inset(20% 0 50% 0); transform: translate(-4px, -2px); }
          40% { clip-path: inset(50% 0 30% 0); transform: translate(4px, 2px); }
          50% { clip-path: inset(5% 0 80% 0); transform: translate(-4px, -1px); }
          60% { clip-path: inset(40% 0 20% 0); transform: translate(4px, 1px); }
          70% { clip-path: inset(80% 0 10% 0); transform: translate(-4px, 2px); }
          80% { clip-path: inset(10% 0 50% 0); transform: translate(4px, -1px); }
          90% { clip-path: inset(60% 0 30% 0); transform: translate(-4px, 2px); }
          100% { clip-path: inset(20% 0 60% 0); transform: translate(4px, -2px); }
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
