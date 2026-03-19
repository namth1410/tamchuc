import { motion } from 'framer-motion';
import { X, MapPin } from 'lucide-react';

export default function MapModal({ tripId, onClose }: { tripId: string, onClose: () => void }) {
  // Lộ trình giả lập linh hoạt theo ID của chuyến đi
  const routePoints = tripId === 'mu-cang-chai' 
    ? [
        { name: 'Hà Nội', desc: 'Xuất phát lúc 5h Sáng' },
        { name: 'Nghĩa Lộ', desc: 'Nghỉ ngơi, ăn trưa' },
        { name: 'Đèo Khau Phạ', desc: 'Check-in biển mây' },
        { name: 'Mù Cang Chải', desc: 'Điểm vinh quang' }
      ]
    : tripId === 'tam-chuc-legacy' || tripId === 'tam-chuc' 
    ? [
        { name: 'Hà Nội', desc: 'Tập trung tại cổng' },
        { name: 'Phủ Lý', desc: 'Ăn sáng bánh cuốn chả' },
        { name: 'Chùa Tam Chúc', desc: 'Vãn cảnh, lễ phật' }
      ]
    : [
        { name: 'Hà Nội', desc: 'Khởi hành' },
        { name: 'Trạm dừng chân', desc: 'Nạp năng lượng' },
        { name: 'Đích đến', desc: 'Tận hưởng' }
      ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[999] bg-[#050a06]/95 backdrop-blur-3xl flex items-center justify-center p-4 overflow-y-auto"
      style={{ scrollbarWidth: 'none' }}
    >
      <button 
        onClick={onClose} 
        className="fixed top-6 right-6 md:top-10 md:right-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all border border-white/20 z-[1000]"
      >
        <X size={24} />
      </button>

      <div className="w-full max-w-2xl relative py-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--trip-primary)]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[var(--trip-primary)]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="text-center mb-16 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Lộ Trình <span className="text-[var(--trip-primary)] drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">Hành Trình</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg uppercase tracking-[0.3em] font-bold">Trace The Memories</p>
        </div>

        <div className="relative pl-8 md:pl-12 max-w-lg mx-auto z-10 w-full">
          {/* Đường dẫn nền (Mờ) */}
          <div className="absolute inset-y-0 left-[39px] md:left-[55px] top-6 bottom-6 w-1.5 bg-white/10 rounded-full" />
          
          {/* Đường dẫn vẽ động (Sáng rực) */}
          <div className="absolute left-[39px] md:left-[55px] top-6 bottom-6 w-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: '100%' }}
              transition={{ duration: 2.5, ease: "anticipate", delay: 0.2 }}
              className="w-full bg-gradient-to-b from-[var(--trip-primary)] via-white to-[var(--trip-primary)] rounded-full shadow-[0_0_20px_var(--trip-primary)]"
            />
          </div>

          <div className="flex flex-col gap-12 md:gap-16 w-full relative">
            {routePoints.map((pt, i) => (
              <motion.div 
                key={pt.name} 
                initial={{ opacity: 0, x: -30, filter: 'blur(5px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: i * 0.6 + 0.5, type: 'spring' }}
                className="relative flex items-center gap-6 md:gap-8 group w-full"
              >
                {/* Dấu chấm Checkpoint */}
                <div className="absolute left-[-22px] md:left-[-22px] w-[30px] h-[30px] rounded-full bg-black border-[5px] border-[var(--trip-primary)] z-10 shadow-[0_0_20px_var(--trip-primary)] group-hover:scale-125 transition-transform duration-500 ease-out flex shadow-[var(--trip-primary)] items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Hộp thông tin */}
                <div className="bg-black/40 border border-white/10 p-6 rounded-3xl flex-1 backdrop-blur-xl group-hover:bg-white/5 group-hover:border-[var(--trip-primary)]/50 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-1">
                  <h3 className="text-xl md:text-2xl font-black text-white flex items-center gap-3 mb-2">
                    <MapPin size={22} strokeWidth={2.5} className="text-[var(--trip-primary)]" />
                    {pt.name}
                  </h3>
                  <p className="text-white/60 text-sm md:text-base font-medium pl-8">{pt.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
