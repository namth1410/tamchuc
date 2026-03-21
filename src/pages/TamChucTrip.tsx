import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import TeamBoard from '../components/TeamBoard';
import Checklist from '../components/Checklist';
import TripDock from '../components/TripDock';

function TamChucTrip() {
  return (
    <div className="min-h-screen bg-[#050a06] overflow-hidden font-sans text-white">
      <Helmet>
        <title>Tam Chúc 2026 - Hành trình tĩnh lặng | Nhóm Hảo Hán</title>
        <meta name="description" content="Khám phá hành trình Tam Chúc bình yên và tĩnh lặng cùng Nhóm Hảo Hán." />
        <meta property="og:image" content="/images/tam_chuc.png" />
      </Helmet>
      {/* Navigation Back */}
      <nav className="fixed w-full z-50 px-6 py-4 backdrop-blur-md border-b border-white/5">
        <Link to="/" className="inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors font-semibold group">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#2d4f1e] group-hover:text-white group-hover:border-[#2d4f1e] transition-all">
            <ArrowLeft size={18} />
          </div>
          Quay lại Sổ Nhật Ký
        </Link>
      </nav>

      {/* Legacy Content wrapped in a generic container */}
      <div className="pt-20">
        <Hero />
        <Timeline />
        <TeamBoard />
        <Checklist />
      </div>

      {/* Trip Dock (Replaces old static sections) */}
      <TripDock tripId="tam-chuc" />
    </div>
  );
}

export default TamChucTrip;
