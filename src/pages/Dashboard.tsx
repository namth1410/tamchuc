import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchTrips } from '../lib/api';
import { Plane, Calendar, ArrowRight, BookOpen, Plus } from 'lucide-react';
import CreateTripModal from '../components/CreateTripModal';

interface Trip {
  id: string;
  title: string;
  color: string;
  bg: string;
  coverUrl?: string;
}

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const loadAllTrips = () => {
    fetchTrips()
      .then(data => {
        setTrips(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load trips", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Reset theme color to generic notebook theme
    document.documentElement.style.setProperty('--trip-primary', '#ffcc00');
    document.documentElement.style.setProperty('--trip-bg', '#0a0f0b');
    
    loadAllTrips();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f0b] text-white">
      {/* Navbar Mộc */}
      <nav className="fixed w-full z-50 px-8 py-6 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-lg">
            <BookOpen size={24} className="text-[#ffcc00]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-none uppercase">Sổ Tay Nhóm Hảo Hán</h1>
            <span className="text-white/40 text-xs font-bold tracking-[0.2em] uppercase">"Cảm ơn vua Tuyển!"</span>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#ffcc00]/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter">
              Kỷ niệm của<br/>
              <span className="text-[var(--trip-primary)] drop-shadow-[0_0_30px_rgba(255,204,0,0.3)]">Nhóm Hảo Hán</span>
            </h2>
            <p className="text-xl text-white/60 font-medium max-w-xl leading-relaxed">
              Chào mừng các đại ca: Nguyễn Duy Tân, Trần Thế Dũng, Nguyễn Thế Quyết, Nguyễn Văn Tuyển, Lê Thị Xuân Thu (con gái), Nguyễn Khắc Hiếu, và Trần Hải Nam.
              <br/><br/>
              <span className="font-bold text-white/90 italic border-l-2 border-[var(--trip-primary)] pl-3">
                "Cảm ơn vua Tuyển!"
              </span>
            </p>
          </motion.div>
        </div>
      </header>

      {/* Dashboard List */}
      <main className="container mx-auto px-8 pb-32">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-white/20 border-t-[#ffcc00] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {trips.map((trip, idx) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, scale: 0.95, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                >
                  <Link 
                    to={trip.id === 'mu-cang-chai' ? '/trips/mu-cang-chai' : trip.id === 'tam-chuc' ? '/trips/tam-chuc-legacy' : `/trips/${trip.id}`} 
                    className="block group relative"
                  >
                    {/* Glowing effect shadow */}
                    <div 
                      className={`absolute -inset-0.5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${trip.coverUrl ? '!opacity-0' : ''}`}
                      style={{ backgroundColor: trip.color }}
                    />
                    
                    {/* Card Body */}
                    <div 
                      className={`relative h-full glass p-8 overflow-hidden rounded-[2rem] border transition-all duration-500 bg-[${trip.bg}] border-white/10 hover:border-white/30 ${trip.coverUrl ? 'group-hover:border-[var(--accent)] text-white' : ''}`}
                      style={trip.coverUrl ? {
                        backgroundImage: `url(http://localhost:3000${trip.coverUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      } : {}}
                    >
                      {/* Lớp phủ đen Gradient cho chữ dễ đọc nếu có ảnh */}
                      {trip.coverUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 pointer-events-none" />}
                      
                      {/* Decorative colored corner */}
                      {!trip.coverUrl && (
                        <div 
                          className="absolute -top-16 -right-16 w-40 h-40 blur-[50px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                          style={{ backgroundColor: trip.color }}
                        />
                      )}
                      
                      <div className="flex flex-col h-full gap-8 relative z-10">
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl"
                          style={{ backgroundColor: `${trip.color}20`, color: trip.color }}
                        >
                          <Plane strokeWidth={2.5} />
                        </div>
                        
                        <div>
                          <h3 className="text-2xl font-black mb-3 group-hover:text-white transition-colors">{trip.title}</h3>
                          <div className="flex items-center gap-2 text-white/40 text-sm font-semibold uppercase tracking-wider">
                            <Calendar size={14} /> 2026 Season
                          </div>
                        </div>

                        <div className="mt-auto pt-6 flex items-center gap-3 text-sm font-bold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <span style={{ color: trip.color }}>Mở Hành Trình</span>
                          <ArrowRight size={18} style={{ color: trip.color }} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
              {/* Add New Trip Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: trips.length * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <button 
                  onClick={() => setIsCreating(true)}
                  className="w-full h-full min-h-[350px] rounded-[2rem] border-2 border-dashed border-white/20 hover:border-[var(--trip-primary)] hover:bg-white/[0.02] flex flex-col items-center justify-center gap-4 text-white/50 hover:text-[var(--trip-primary)] transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 group-hover:bg-[var(--trip-primary)]/20 flex items-center justify-center transition-colors shadow-lg">
                    <Plus size={32} />
                  </div>
                  <span className="font-bold text-lg tracking-wide uppercase">Tạo Trang Viết Mới</span>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>

      <CreateTripModal 
        isOpen={isCreating} 
        onClose={() => setIsCreating(false)} 
        onSuccess={() => {
          setIsCreating(false);
          loadAllTrips();
        }} 
      />
    </div>
  );
}
