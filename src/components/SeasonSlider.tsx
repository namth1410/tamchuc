import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

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
      className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-col-resize shadow-2xl border border-white/10"
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
        <div className="absolute top-8 right-8 glass px-6 py-3 text-white font-bold tracking-wider uppercase text-sm border border-white/30 shadow-xl">
          Mùa Lúa Chín (Tháng 9)
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
        <div className="absolute top-8 left-8 glass px-6 py-3 text-white font-bold tracking-wider uppercase text-sm border border-white/30 shadow-xl">
          Mùa Nước Đổ (Tháng 4)
        </div>
      </div>

      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] z-10 pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 glass flex-center">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-white/50 rounded-full" />
            <div className="w-1 h-4 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Overlay Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass-dark px-8 py-3 text-white/80 text-sm font-medium animate-pulse pointer-events-none">
        Kéo để so sánh hai mùa
      </div>
    </div>
  );
};

export default SeasonSlider;
