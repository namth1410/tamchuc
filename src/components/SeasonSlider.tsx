import React, { useState, useRef } from 'react';

interface SeasonSliderProps {
  waterSeasonImg: string;
  ripeRiceSeasonImg: string;
}

const SeasonSlider: React.FC<SeasonSliderProps> = ({ waterSeasonImg, ripeRiceSeasonImg }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    
    setSliderPosition(Math.max(0, Math.min(100, position)));
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/5] md:aspect-video rounded-3xl overflow-hidden cursor-col-resize shadow-2xl border border-white/10"
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
    >
      {/* Ripe Rice Season (Background) */}
      <div className="absolute inset-0">
        <img 
          src={ripeRiceSeasonImg} 
          alt="Mùa Lúa Chín" 
          className="slider-img"
        />
        <div className="absolute top-4 md:top-8 right-4 md:right-8 glass px-4 md:px-6 py-2 md:py-3 text-white font-bold tracking-wider uppercase text-[10px] md:text-sm border border-white/30 shadow-xl">
          Mùa Lúa Chín
        </div>
      </div>

      {/* Water Season (Foreground with Clip) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img 
          src={waterSeasonImg} 
          alt="Mùa Nước Đổ" 
          className="slider-img"
        />
        <div className="absolute top-4 md:top-8 left-4 md:left-8 glass px-4 md:px-6 py-2 md:py-3 text-white font-bold tracking-wider uppercase text-[10px] md:text-sm border border-white/30 shadow-xl">
          Mùa Nước Đổ
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 glass flex-center">
          <div className="flex gap-1">
            <div className="w-0.5 md:w-1 h-3 md:h-4 bg-white/50 rounded-full" />
            <div className="w-0.5 md:w-1 h-3 md:h-4 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Overlay Instructions */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 glass-dark px-6 md:px-8 py-2 md:py-3 text-white/80 text-[10px] md:text-sm font-medium animate-pulse pointer-events-none">
        Kéo để so sánh
      </div>
    </div>
  );
};

export default SeasonSlider;
