import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { fetchTrips, BASE_URL } from '../lib/api';
import { Plane, Calendar, ArrowRight, BookOpen, Plus, PartyPopper, CalendarDays, Lock, Unlock, Edit2 } from 'lucide-react';
import CreateTripModal from '../components/CreateTripModal';
import AdminAuthModal from '../components/AdminAuthModal';

export interface Trip {
  id: string;
  title: string;
  date?: string;
  color: string;
  bg: string;
  coverUrl?: string;
}

const BIRTHDAYS = [
  { name: 'Tân', date: '01-20', role: 'Đại ca', avatarColor: '#ff4b4b', avatarUrl: '/Tân.png' },
  { name: 'Hiếu', date: '04-27', role: 'Đại ca', avatarColor: '#4caf50', avatarUrl: '/Hiếu.png' },
  { name: 'Tuyển', date: '07-12', role: 'Vua', avatarColor: '#ffcc00', avatarUrl: '/Tuyển.png' },
  { name: 'Thu', date: '10-02', role: 'Chị đại', avatarColor: '#e91e63', avatarUrl: '/Thu.png' },
  { name: 'Nam', date: '10-14', role: 'Đại ca', avatarColor: '#9c27b0', avatarUrl: '/Nam.jpeg' },
  { name: 'Dũng', date: '11-29', role: 'Đại ca', avatarColor: '#2196f3', avatarUrl: '/Dũng.png' },
];

interface BirthdayPerson {
  name: string;
  date: string;
  role: string;
  avatarColor: string;
  avatarUrl?: string;
}

interface NextBirthday extends BirthdayPerson {
  daysLeft: number;
  nextAge: number;
  yearBday: Date;
}

const getNextBirthday = (): NextBirthday | null => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();

  let next: NextBirthday | null = null;
  let minDiff = Infinity;

  BIRTHDAYS.forEach(person => {
    const [month, day] = person.date.split('-');
    let bday = new Date(currentYear, parseInt(month) - 1, parseInt(day));

    if (bday.getTime() < today.getTime()) {
      bday = new Date(currentYear + 1, parseInt(month) - 1, parseInt(day));
    }

    const diff = Math.ceil((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < minDiff) {
      minDiff = diff;
      next = { ...person, daysLeft: diff, nextAge: bday.getFullYear() - 2002, yearBday: bday };
    }
  });

  return next;
};

const getTripCover = (trip: Trip) => {
  if (trip.coverUrl) return `${BASE_URL}${trip.coverUrl}`;

  const title = trip.title.toLowerCase();
  if (title.includes('mù cang chải') || trip.id === 'mu-cang-chai') {
    return '/images/mcc_ripe_8k.png';
  }
  if (title.includes('tam chúc') || trip.id === 'tam-chuc' || trip.id === 'tam-chuc-legacy') {
    return '/images/tam_chuc.png';
  }
  if (trip.id === 'moc-chau') {
    return '/images/mc_cover_landscape.png';
  }
  if (title.includes('hà giang') || title.includes('mã pì lèng')) {
    return '/images/ma_pi_leng.png';
  }

  // Default abstract landscape
  return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80';
};

export default function Dashboard() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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

    const savedPass = sessionStorage.getItem('adminPass');
    if (savedPass === '01664157092a') {
      setIsAdmin(true);
      setAdminPass(savedPass);
    }

    loadAllTrips();
  }, []);

  const toggleAdmin = () => {
    if (isAdmin) {
      sessionStorage.removeItem('adminPass');
      setIsAdmin(false);
      setAdminPass('');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0b] text-white">
      <Helmet>
        <title>Sổ Tay Kỷ Niệm - Nhóm Hảo Hán</title>
        <meta name="description" content="Chào mừng các đại ca đến với kỳ nghỉ và kỷ niệm tuyệt vời của Nhóm Hảo Hán. Nơi lưu giữ những hành trình đáng nhớ." />
        <meta property="og:image" content="/images/mcc_ripe_8k.png" />
      </Helmet>
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
          <button onClick={toggleAdmin} className="ml-auto p-2 rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white" title="Chế độ Quản trị">
            {isAdmin ? <Unlock size={20} className="text-green-400" /> : <Lock size={20} />}
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="pt-40 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#ffcc00]/10 to-transparent blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tighter">
              Kỷ niệm của<br />
              <span className="text-[var(--trip-primary)] drop-shadow-[0_0_30px_rgba(255,204,0,0.3)]">Nhóm Hảo Hán</span>
            </h2>
            <p className="text-xl text-white/60 font-medium max-w-xl leading-relaxed">
              Chào mừng các đại ca: Nguyễn Duy Tân, Trần Thế Dũng, Nguyễn Thế Quyết, Nguyễn Văn Tuyển, Lê Thị Xuân Thu, Nguyễn Khắc Hiếu, và Trần Hải Nam.
              <br /><br />
              <span className="font-bold text-white/90 italic border-l-2 border-[var(--trip-primary)] pl-3">
                "Cảm ơn vua Tuyển!"
              </span>
            </p>
          </motion.div>
        </div>
      </header>

      {/* Dashboard List */}
      <main className="container mx-auto px-8 pb-32">
        {/* Birthday Widget */}
        {(() => {
          const nextBday = getNextBirthday();
          if (!nextBday) return null;

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-12 relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#151c16] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 justify-between group shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--trip-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-xl transition-transform group-hover:scale-110 duration-500 group-hover:-rotate-3 overflow-hidden relative" style={{ backgroundColor: nextBday.avatarColor + '20', color: nextBday.avatarColor, border: `1px solid ${nextBday.avatarColor}40` }}>
                  {nextBday.avatarUrl ? (
                    <img src={nextBday.avatarUrl} alt={nextBday.name} className="w-full h-full object-cover" />
                  ) : (
                    <PartyPopper size={36} />
                  )}
                  <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] pointer-events-none rounded-[1.5rem]" />
                </div>
                <div>
                  <h3 className="text-white/50 text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                    <CalendarDays size={14} className="text-[var(--trip-primary)]" /> Sự kiện sắp tới
                  </h3>
                  <div className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                    Sinh nhật <span className="opacity-80 block md:inline text-lg md:text-4xl">{nextBday.role}</span> <span className="drop-shadow-lg" style={{ color: nextBday.avatarColor }}>{nextBday.name}</span>
                  </div>
                  <div className="text-white/60 font-medium tracking-wide mt-2 text-sm md:text-base">
                    Chuẩn bị đón tuổi thọ <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">{nextBday.nextAge}</span> vào ngày {nextBday.date.split('-').reverse().join('/')}
                  </div>
                </div>
              </div>

              <div className="relative z-10 bg-black/40 px-8 py-5 rounded-[1.5rem] border border-white/5 text-center w-full md:w-auto shrink-0 shadow-inner">
                {nextBday.daysLeft === 0 ? (
                  <div className="text-[var(--trip-primary)] font-black text-xl md:text-2xl animate-pulse whitespace-nowrap">
                    HÔM NAY LÀ<br />SINH NHẬT! 🎉
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="text-5xl md:text-6xl font-black leading-none bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                      {nextBday.daysLeft}
                    </div>
                    <div className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-2">Ngày nữa</div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })()}

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
                  className="h-full"
                >
                  <Link
                    to={trip.id === 'mu-cang-chai' ? '/trips/mu-cang-chai' : trip.id === 'tam-chuc' ? '/trips/tam-chuc-legacy' : trip.id === 'moc-chau' ? '/trips/moc-chau' : `/trips/${trip.id}`}
                    className="block group relative h-full"
                  >
                    {isAdmin && (
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedTrip(trip);
                          setIsModalOpen(true);
                        }}
                        className="absolute top-4 right-4 z-[60] p-3 bg-black/60 hover:bg-[var(--trip-primary)] hover:text-black text-white rounded-full backdrop-blur-md transition-all shadow-xl opacity-0 group-hover:opacity-100"
                        title="Sửa chuyến đi"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}

                    {/* Glowing effect shadow */}
                    <div
                      className={`absolute -inset-0.5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${trip.coverUrl ? '!opacity-0' : ''}`}
                      style={{ backgroundColor: trip.color }}
                    />

                    <div
                      className={`relative h-full glass p-8 overflow-hidden rounded-[2rem] border transition-all duration-500 border-white/10 hover:border-white/40 group-hover:border-[var(--trip-primary)] text-white shadow-2xl`}
                      style={{
                        backgroundImage: `url(${getTripCover(trip)})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: trip.bg
                      }}
                    >
                      {/* Gradient overlay for readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10 pointer-events-none group-hover:from-black/80 transition-opacity duration-500" />

                      {/* Decorative colored corner */}
                      <div
                        className="absolute -top-16 -right-16 w-40 h-40 blur-[50px] rounded-full opacity-40 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
                        style={{ backgroundColor: trip.color }}
                      />

                      <div className="flex flex-col h-full relative z-10">
                        {/* Icon Top Left */}
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl mb-8 backdrop-blur-md"
                          style={{ backgroundColor: `${trip.color}30`, color: trip.color }}
                        >
                          <Plane strokeWidth={2.5} />
                        </div>

                        {/* Title and Date anchored to the bottom using mt-auto */}
                        <div className="mt-auto">
                          <h3 className="text-2xl md:text-3xl font-black mb-3 group-hover:text-white transition-colors drop-shadow-lg leading-tight line-clamp-3">
                            {trip.title}
                          </h3>
                          <div className="flex items-center gap-2 text-white/70 text-xs md:text-sm font-bold uppercase tracking-[0.2em] drop-shadow-md">
                            <Calendar size={14} className="text-[var(--trip-primary)]" /> {trip.date || '2026 Season'}
                          </div>
                        </div>

                        {/* Call to action below title */}
                        <div className="mt-6 flex items-center gap-3 text-sm font-bold opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <span style={{ color: trip.color }} className="tracking-wide uppercase">Mở Hành Trình</span>
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
                  onClick={() => {
                    setSelectedTrip(undefined);
                    setIsModalOpen(true);
                  }}
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
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tripToEdit={selectedTrip}
        adminPass={adminPass}
        onSuccess={() => {
          setIsModalOpen(false);
          loadAllTrips();
        }}
      />

      <AdminAuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(pass) => {
          sessionStorage.setItem('adminPass', pass);
          setIsAdmin(true);
          setAdminPass(pass);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
