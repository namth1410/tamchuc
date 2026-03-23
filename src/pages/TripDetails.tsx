import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { fetchTripById, BASE_URL } from '../lib/api';
import { ArrowLeft } from 'lucide-react';
import TripDock from '../components/TripDock';

export default function TripDetails() {
  const { id } = useParams();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    fetchTripById(id)
      .then(data => {
        setTrip(data);
        // Ngay khi load xong, ghi đè biến màu sắc toàn app (Dynamic Theme)
        if (data.color) document.documentElement.style.setProperty('--trip-primary', data.color);
        if (data.bg) document.documentElement.style.setProperty('--trip-bg', data.bg);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-dark)] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/10 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip) {
    return <div className="p-20 text-center text-xl font-bold text-white">Trip không tồn tại.</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] text-white transition-colors duration-1000">
      <Helmet>
        <title>{trip.title} | Nhóm Hảo Hán</title>
        <meta name="description" content={`Hành trình lưu bút: ${trip.title} - Nhóm Hảo Hán`} />
        {trip.coverUrl && <meta property="og:image" content={`${BASE_URL}${trip.coverUrl}`} />}
      </Helmet>
      <nav className="fixed w-full z-50 px-6 py-4 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors font-semibold group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[var(--accent)] group-hover:text-black group-hover:border-[var(--accent)] transition-all">
            <ArrowLeft size={18} />
          </div>
          Quay lại Sổ Nhật Ký
        </Link>
      </nav>

      <header className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] blur-[150px] opacity-40 pointer-events-none transition-colors duration-1000" style={{ backgroundColor: trip.color }} />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-7xl font-black mb-6 leading-tight drop-shadow-2xl">
            {trip.title}
          </motion.h1>
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[var(--accent)] font-bold text-sm tracking-widest uppercase">
            Hành trình lưu bút - Nhóm Hảo Hán
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 pb-32 flex flex-col items-center justify-center pt-20">
        <div className="glass p-10 rounded-[2rem] border-white/10 text-center max-w-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent pointer-events-none group-hover:scale-105 transition-transform duration-1000"></div>
          <h2 className="text-3xl font-black mb-4 flex items-center justify-center gap-3">
             Hành trình phía trước
          </h2>
          <p className="text-white/60 font-medium leading-relaxed">
            Sử dụng Menu nổi (Dock) phía dưới màn hình để bắt đầu thảo luận kế hoạch hoặc chia sẻ kỷ niệm cùng mọi người nhé!
          </p>
        </div>
      </main>

      <TripDock tripId={trip.id} />
    </div>
  );
}
