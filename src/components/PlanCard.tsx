import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Wallet, ChevronRight, Check } from 'lucide-react';

interface PlanCardProps {
  title: string;
  duration: string;
  cost: string;
  description: string;
  points: string[];
  isComparison?: boolean;
  onCompare?: () => void;
  onViewDetails?: () => void;
  isSelected?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ 
  title, duration, cost, description, points, isComparison, onCompare, onViewDetails, isSelected 
}) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass p-5 md:p-8 relative overflow-hidden flex flex-col h-full ${isSelected ? 'border-accent ring-2 ring-accent/20 bg-white/10' : ''}`}
    >
      {/* Selection Badge */}
      {isSelected && !isComparison && (
        <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-accent flex-center text-black">
          <Check size={18} strokeWidth={3} />
        </div>
      )}

      {/* Background Glow */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 blur-[60px] rounded-full pointer-events-none transition-colors duration-700 ${isSelected ? 'bg-accent/30' : 'bg-terrace-gold/10'}`} />
      
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-white leading-tight max-w-[70%]">{title}</h3>
        <div className="glass-dark px-3 md:px-4 py-1.5 md:py-2 text-accent font-black rounded-xl flex items-center gap-1.5 md:gap-2 border border-accent/20 text-xs md:text-base whitespace-nowrap">
          <Wallet size={16} />
          {cost}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-1.5 text-white/90 font-medium text-sm">
          <Clock size={16} className="text-accent" />
          {duration}
        </div>
        <div className="flex items-center gap-1.5 text-white/90 font-medium text-sm">
          <MapPin size={16} className="text-accent" />
          Mù Cang Chải
        </div>
      </div>

      <p className="text-white/85 mb-6 md:mb-8 flex-grow leading-relaxed font-medium text-sm md:text-base">{description}</p>

      <div className="space-y-3 mb-8">
        {points.map((pt, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-white/90 font-medium">
            <div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
            {pt}
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-auto">
        <button 
          onClick={onViewDetails}
          className="flex-grow bg-white text-black font-black py-3.5 md:py-4 px-4 md:px-6 rounded-2xl hover:bg-accent transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg text-sm md:text-base"
        >
          Chi Tiết
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        {onCompare && !isComparison && (
          <button 
            onClick={onCompare}
            title="Chọn để so sánh"
            className={`w-14 flex-center rounded-2xl border transition-all duration-300 ${isSelected ? 'bg-accent/20 border-accent text-accent' : 'border-white/20 bg-white/5 hover:border-white/50 text-white'}`}
          >
            <MapPin size={24} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default PlanCard;
