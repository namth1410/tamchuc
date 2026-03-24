import { useEffect } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Helmet } from 'react-helmet-async';
import { Share2, ArrowLeft, MapPin, Clock, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import TripDock from "../components/TripDock";

const timelineData = [
  {
    time: "06:00",
    title: "Khởi hành từ Hà Nội",
    description: "Tập trung tại 591 Nguyễn Trãi. Đổ đầy bình xăng, buộc chặt đồ đạc, hít một hơi thật sâu và bắt đầu hành trình trốn phố về rừng.",
    icon: Navigation,
    image: "/images/mc_hanoi_start.png"
  },
  {
    time: "09:00",
    title: "Check-in Đèo Đá Trắng",
    description: "Dừng chân tại Thung Khe sương mù giăng lối. Chụp vài bô ảnh ngầu đét cùng xế cưng, ăn vội bắp ngô nướng và ống cơm lam lấp đầy chiếc bụng đói.",
    icon: MapPin,
    image: "/images/mc_thung_khe.png"
  },
  {
    time: "11:30",
    title: "Đặt chân tới Cao Nguyên",
    description: "Khí hậu mát mẻ đón chào. Bỏ qua những ồn ào khói bụi, chỉ còn lại màu xanh thẳm của mây trời và những đồi chè bát ngát.",
    icon: MapPin,
    image: "/images/mc_tea_hills.png"
  },
  {
    time: "12:00",
    title: "Nạp Năng Lượng",
    description: "Ăn trưa bình dân nhưng cực dính: Bê chao nóng hổi, cá suối chiên giòn rụm chấm nước mắm gừng sả tại quán nhỏ ven đường.",
    icon: Clock,
  },
  {
    time: "13:30",
    title: "Vi Vu Khám Phá",
    description: "Lượn lờ Rừng thông Bản Áng tĩnh lặng hay Đồi chè Trái tim bát ngát. Góc nào lên hình cũng là cực phẩm của tuổi trẻ.",
    icon: MapPin,
    image: "/images/mc_pine_forest.png"
  },
  {
    time: "16:00",
    title: "Quay Đầu Về Thủ Đô",
    description: "Kiểm tra lại xe cộ, xốc lại tinh thần đổ đèo trở về Hà Nội trước khi màn sương đêm buông xuống lạnh buốt.",
    icon: Navigation,
    image: "/images/mc_return_trip.png"
  }
];

export default function MocChauTrip() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    document.documentElement.style.setProperty('--trip-primary', '#86efac');
    document.documentElement.style.setProperty('--trip-bg', '#022c22');
    
    // Cleanup to prevent colors bleeding when navigating via browser back button immediately.
    // Dashboard resets colors too, but good practice.
    return () => {
      document.documentElement.style.setProperty('--trip-primary', '#ffcc00');
      document.documentElement.style.setProperty('--trip-bg', '#0a0f0b');
    };
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "Mộc Châu - Hành trình Trà xanh",
      text: "Chuyến đi Mộc Châu trong ngày với Nhóm Hảo Hán.",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--trip-bg)] text-white selection:bg-[var(--trip-primary)]/40 selection:text-black transition-colors duration-1000 overflow-x-hidden font-sans pb-32">
      <Helmet>
        <title>Mộc Châu Day Trip - Hành trình Trà xanh | Nhóm Hảo Hán</title>
        <meta name="description" content="Chuyến đi Mộc Châu trong ngày với Đèo Đá Trắng và Đồi chè." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1559599268-07bd629abce9?q=80&w=2000&auto=format&fit=crop" />
      </Helmet>
      
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 md:h-2 bg-[var(--trip-primary)] origin-left z-50 rounded-r-full shadow-[0_0_15px_rgba(134,239,172,0.8)]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-6 md:py-8 pointer-events-none">
        <div className="container flex justify-between items-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-2 items-start"
          >
            <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-[var(--trip-primary)] transition-colors font-semibold text-xs py-1 uppercase tracking-widest backdrop-blur-md bg-black/20 px-4 rounded-full border border-white/10">
              <ArrowLeft size={14} /> Trở về Sổ Nhật ký
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button 
              onClick={handleShare}
              className="backdrop-blur-xl bg-white/10 border border-white/20 px-4 md:px-6 py-2.5 rounded-full flex items-center gap-2 hover:bg-[var(--trip-primary)] hover:text-black hover:border-[var(--trip-primary)] transition-all font-bold text-xs md:text-sm group shadow-lg"
            >
              <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Chia sẻ Lịch trình</span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559599268-07bd629abce9?q=80&w=2000&auto=format&fit=crop" 
            alt="Moc Chau Tea Hills" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--trip-bg)] via-transparent to-[var(--trip-bg)] mix-blend-multiply" />
          <div className="absolute inset-0 bg-[var(--trip-bg)] opacity-70" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[var(--trip-primary)] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-[#10b981] rounded-full mix-blend-screen filter blur-[100px] opacity-20" />

        <div className="container relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--trip-primary)]/50 bg-[var(--trip-primary)]/10 text-[var(--trip-primary)] text-xs font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_20px_rgba(134,239,172,0.2)]">
              Cùng Nam & Quyết
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-black mb-6 leading-[0.9] tracking-tighter drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
              MỘC CHÂU
            </h1>
            <p className="text-[var(--trip-primary)] text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-widest mb-10 drop-shadow-lg">
              Hành Trình Trà Xanh
            </p>
            
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed mb-12">
              Một ngày trốn khỏi khói bụi thủ đô, vặn tay ga lướt qua Đèo Đá Trắng ngắm mây mù, và hoà mình vào màu xanh bát ngát của cao nguyên.
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[var(--trip-primary)] text-black font-black py-4 px-10 rounded-full flex items-center gap-3 shadow-[0_15px_30px_rgba(134,239,172,0.3)] text-sm md:text-base uppercase tracking-wider mx-auto group"
            >
              Xem Lộ Trình <ArrowLeft size={20} className="rotate-[-90deg] group-hover:translate-y-1 transition-transform" strokeWidth={3} />
            </motion.button>
          </motion.div>
        </div>
      </header>

      {/* Timeline Section */}
      <section id="timeline" className="py-20 md:py-32 relative z-10">
        <div className="container px-4">
          <div className="text-center mb-20 md:mb-32">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Timeline Trong Ngày</h2>
            <p className="text-[var(--trip-primary)] font-bold tracking-widest uppercase text-sm">Chạy xe máy - Ăn bình dân</p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Center Line for Desktop, Left Line for Mobile */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--trip-primary)] via-transparent to-[var(--trip-primary)] opacity-30 md:-translate-x-1/2 rounded-full" />

            <div className="space-y-12 md:space-y-24">
              {timelineData.map((item, index) => {
                const Icon = item.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Floating Time Badge - Desktop Center, Mobile Left */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                      <div className="w-16 h-8 md:w-20 md:h-10 rounded-full bg-[var(--trip-bg)] border-2 border-[var(--trip-primary)] flex items-center justify-center shadow-[0_0_20px_rgba(134,239,172,0.4)]">
                        <span className="text-[var(--trip-primary)] font-black text-sm md:text-base">{item.time}</span>
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-start pl-[5rem] md:pl-0' : 'md:justify-end pl-[5rem] md:pr-0'}`}>
                      <div className={`glass w-full max-w-md p-6 md:p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group hover:border-[var(--trip-primary)]/50 transition-colors duration-500`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--trip-primary)]/10 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                        
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--trip-primary)] border border-white/10 shrink-0">
                            <Icon size={24} />
                          </div>
                          <h3 className="text-xl md:text-2xl font-black leading-tight">{item.title}</h3>
                        </div>
                        
                        <p className="text-white/70 leading-relaxed font-medium relative z-10 text-sm md:text-base">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Image Box */}
                    <div className={`w-full md:w-1/2 pl-[5rem] md:pl-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                      {item.image && (
                        <div className={`inline-block overflow-hidden rounded-[2rem] border-4 border-white/5 relative group w-full max-w-md aspect-video md:aspect-[4/3] shadow-2xl ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Outro */}
      <footer className="py-24 border-t border-white/5 bg-black/40 relative z-10">
        <div className="container text-center px-4">
          <div className="mb-10 flex flex-col items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--trip-primary)] to-[#10b981] flex items-center justify-center shadow-[0_0_30px_rgba(134,239,172,0.3)]">
                <Navigation size={32} className="text-[#022c22]" />
             </div>
             <h3 className="text-3xl font-black">Hành Trình Gió Bụi</h3>
          </div>
          <p className="text-white/50 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-12 font-medium italic">
            "Không quan trọng là đi bao xa, quan trọng là đi cùng ai. Chuyến đi với những người anh em Hảo Hán luôn là chuyến đi đáng nhớ nhất."
          </p>
        </div>
      </footer>

      {/* Trip Dock */}
      <TripDock tripId="moc-chau" />
    </div>
  );
}
