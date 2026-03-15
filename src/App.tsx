import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, ArrowRight, X, LayoutGrid, Columns2 } from "lucide-react";
import SeasonSlider from "./components/SeasonSlider";
import PlanCard from "./components/PlanCard";

// Data for plans
const plans = [
  {
    id: 1,
    title: "Hành trình Tối ưu: Hà Nội - Nghĩa Lộ - Mù Cang Chải",
    duration: "2 Ngày 2 Đêm",
    cost: "1.500.000 VNĐ",
    description:
      "Lịch trình dày đặc dành cho những người muốn tận dụng tối đa thời gian. Khám phá toàn bộ các điểm check-in nổi tiếng nhất trong 48 giờ.",
    bestFor: "Người thích chụp ảnh, muốn đi nhiều nơi nhất",
    difficulty: "Trung bình (Chạy xe nhiều)",
    points: [
      "22:00 Thứ 6: Di chuyển HN - Nghĩa Lộ, nhận phòng nghỉ đêm",
      "Sáng Thứ 7: Chinh phục đèo Khau Phạ, ngắm thung lũng Cao Phạ",
      "Chiều Thứ 7: Check-in Đồi Mâm Xôi (La Pán Tẩn) lúc hoàng hôn",
      "Sáng CN: Đón bình minh tại Đồi Móng Ngựa, sau đó về Hà Nội",
    ],
  },
  {
    id: 2,
    title: "Trải nghiệm Thong dong: Nghỉ dưỡng & Khám phá",
    duration: "2 Ngày 1 Đêm",
    cost: "1.400.000 VNĐ",
    description:
      "Phù hợp cho gia đình hoặc cặp đôi muốn thư giãn. Di chuyển vào ban ngày để đảm bảo an toàn và sức khỏe tốt nhất.",
    bestFor: "Gia đình, người muốn nghỉ dưỡng",
    difficulty: "Dễ (Di chuyển thong thả)",
    points: [
      "05:00 Thứ 7: Xuất phát từ Hà Nội, ăn trưa tại Nghĩa Lộ",
      "Chiều Thứ 7: Vượt đèo Khau Phạ, check-in Tú Lệ",
      "Tối Thứ 7: Thưởng thức đặc sản lợn mán, gà đồi tại thị trấn",
      "Sáng CN: Tham quan Mâm Xôi, mua sắm đặc sản địa phương trước khi về",
    ],
  },
  {
    id: 3,
    title: "Chinh phục Bản làng: Sâu trong văn hóa Thái - Mông",
    duration: "3 Ngày 2 Đêm",
    cost: "2.200.000 VNĐ",
    description:
      "Dành cho những tâm hồn thích phiêu lưu. Đi sâu vào các bản làng xa xôi như Chế Cu Nha, Dế Xu Phình để cảm nhận thực sự văn hóa vùng cao.",
    bestFor: "Người thích phiêu lưu, văn hóa",
    difficulty: "Khó (Đường bản khó đi)",
    points: [
      "Ngày 1: Hà Nội - Tú Lệ - Bản Lìm Mông. Ngủ tại Homestay bản Thái",
      "Ngày 2: Chế Cu Nha - Dế Xu Phình. Tham gia sinh hoạt cùng dân bản",
      "Ngày 3: Leo đồi Móng Ngựa, ăn trưa tại bản sau đó mới khởi hành về",
      "Bao gồm: Thuê xe ôm bản địa và hướng dẫn viên địa phương",
    ],
  },
];

function App() {
  const [selectedPlans, setSelectedPlans] = useState<number[]>([]);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [viewingPlanId, setViewingPlanId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Mù Cang Chải 2026 - Hành trình Tuyệt tác",
      text: "Khám phá những cung đường đèo hùng vĩ và ruộng bậc thang Mù Cang Chải 2026.",
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const togglePlanSelection = (id: number) => {
    setSelectedPlans((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const getViewingPlan = () => plans.find((p) => p.id === viewingPlanId);

  return (
    <div className="min-h-screen bg-[#0a0f0b] text-white selection:bg-accent/40 selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 md:py-6 pointer-events-none">
        <div className="container flex justify-between items-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 md:gap-4 cursor-pointer group"
            onClick={() => {
              setIsCompareMode(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#ffcc00] flex-center text-black text-xl md:text-2xl font-black shadow-lg shadow-accent/40 group-hover:scale-110 transition-transform">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-black tracking-tight leading-none">
                MÙ CANG CHẢI
              </span>
              <span className="text-accent text-[10px] md:text-xs font-bold tracking-[0.3em]">
                HÀNH TRÌNH 2026
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <button 
              onClick={handleShare}
              className="glass px-4 md:px-8 py-2.5 md:py-3 rounded-2xl flex items-center gap-2 md:gap-3 hover:bg-accent hover:text-black transition-all font-black text-[10px] md:text-sm group"
            >
              <Share2
                size={16}
                className="group-hover:rotate-12 transition-transform text-accent group-hover:text-black"
              />
              <span className="hidden sm:inline">CHIA SẺ HÀNH TRÌNH</span>
              <span className="sm:hidden">CHIA SẺ</span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 md:pt-60 pb-20 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] md:h-[900px] bg-gradient-to-b from-moss-green/40 to-transparent blur-[100px] md:blur-[140px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-5xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-accent/60 bg-accent/20 text-accent text-[10px] md:text-sm font-black uppercase tracking-[0.2em] mb-6 md:mb-10 shadow-[0_0_20px_rgba(255,204,0,0.1)]"
            >
              <div className="w-2 md:w-2.5 h-2 md:h-2.5 rounded-full bg-accent animate-pulse" />
              Chương trình Phượt 2026
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-[10rem] font-black mb-8 md:mb-12 leading-[1.1] tracking-tight pb-2 md:pb-4"
            >
              MÙ CANG CHẢI <br />
              <span className="text-gradient">TUYỆT TÁC MIỀN CAO</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-2xl text-white/90 max-w-3xl mb-10 md:mb-16 leading-relaxed font-semibold drop-shadow-lg"
            >
              Trải nghiệm những cung đường đèo hùng vĩ nhất Việt Nam, nơi những
              thửa ruộng bậc thang kể câu chuyện về sức sống mãnh liệt của con
              người vùng cao.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-6"
            >
              <button
                onClick={() =>
                  document
                    .getElementById("plans")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-accent text-black font-black py-5 md:py-7 px-8 md:px-14 rounded-2xl md:rounded-3xl hover:bg-accent-hover hover:translate-y-[-4px] active:translate-y-0 transition-all flex items-center justify-center gap-3 md:gap-4 shadow-[0_25px_60px_rgba(255,204,0,0.4)] text-lg md:text-xl uppercase tracking-wider"
              >
                Xem Các Phương Án <ArrowRight size={24} strokeWidth={3} />
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Season Comparison */}
      <section className="py-16 md:py-24 bg-white/[0.02]">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6">
                Mùa nào dành cho bạn?
              </h2>
              <p className="text-lg md:text-xl text-white/70 font-medium">
                Sử dụng thanh trượt bên dưới để cảm nhận sự thay đổi màu sắc rực
                rỡ của thung lũng Mù Cang Chải.
              </p>
            </div>
            <div className="glass px-4 md:px-6 py-3 md:py-4 flex gap-6 md:gap-8 w-full md:w-auto overflow-x-auto whitespace-nowrap">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-sky-blue" />
                <span className="font-bold text-sm md:text-base">Mùa Nước Đổ</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-accent" />
                <span className="font-bold text-sm md:text-base">Mùa Lúa Chín</span>
              </div>
            </div>
          </div>

          <SeasonSlider
            waterSeasonImg="/images/mcc_water_8k.png"
            ripeRiceSeasonImg="/images/mcc_ripe_8k.png"
          />
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 md:py-32 relative">
        <div className="container">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 md:mb-20 gap-8 md:gap-10">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-4 md:mb-6">Hành trình Đề xuất</h2>
              <p className="text-lg md:text-xl text-white/70 font-medium">
                Hãy chọn tối đa{" "}
                <span className="text-accent font-black">3 phương án</span> để
                kích hoạt chế độ so sánh chuyên sâu.
              </p>
            </div>

            <div className="flex bg-white/5 p-1.5 md:p-2 rounded-2xl border border-white/10 backdrop-blur-md w-full sm:w-auto">
              <button
                onClick={() => setIsCompareMode(false)}
                className={`flex-grow sm:flex-initial flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl transition-all font-bold text-sm md:text-base ${!isCompareMode ? "bg-white text-black shadow-xl" : "text-white/60 hover:text-white"}`}
              >
                <LayoutGrid size={20} /> Danh sách
              </button>
              <button
                onClick={() => setIsCompareMode(true)}
                disabled={selectedPlans.length < 2}
                className={`flex-grow sm:flex-initial flex items-center justify-center gap-2 md:gap-3 px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl transition-all font-bold text-sm md:text-base ${isCompareMode ? "bg-white text-black shadow-xl" : "text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"}`}
              >
                <Columns2 size={20} /> So sánh
                {selectedPlans.length > 0 && (
                  <span
                    className={`ml-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex-center text-[10px] md:text-xs ${isCompareMode ? "bg-black text-white" : "bg-accent text-black"}`}
                  >
                    {selectedPlans.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isCompareMode ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    {...plan}
                    isSelected={selectedPlans.includes(plan.id)}
                    onCompare={() => togglePlanSelection(plan.id)}
                    onViewDetails={() => setViewingPlanId(plan.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="compare"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="w-full overflow-x-auto pb-10"
              >
                <div
                  className="min-w-[800px] lg:min-w-full glass bg-white/5 border-white/10 overflow-hidden"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `200px repeat(${selectedPlans.length}, 1fr)`,
                  }}
                >
                  {/* Header Row */}
                  <div className="contents">
                    <div className="p-8 flex items-center border-r border-b border-white/10 bg-white/5">
                      <span className="text-accent font-black tracking-widest text-sm italic">
                        MA TRẬN SO SÁNH
                      </span>
                    </div>
                    {plans
                      .filter((p) => selectedPlans.includes(p.id))
                      .map((plan) => (
                        <div
                          key={plan.id}
                          className="p-8 relative group border-r border-b border-white/10 last:border-r-0 bg-white/5"
                        >
                          <button
                            onClick={() => togglePlanSelection(plan.id)}
                            className="absolute top-4 right-4 w-10 h-10 glass rounded-full flex-center hover:bg-red-500 transition-colors z-20"
                          >
                            <X size={16} />
                          </button>
                          <h3 className="text-xl font-black mb-2 pr-8">
                            {plan.title}
                          </h3>
                          <div className="text-accent font-bold">
                            {plan.cost}
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Criteria Rows */}
                  {[
                    { label: "THỜI LƯỢNG", key: "duration" },
                    { label: "PHÙ HỢP VỚI", key: "bestFor" },
                    { label: "ĐỘ KHÓ", key: "difficulty" },
                  ].map((criteria) => (
                    <React.Fragment key={criteria.key}>
                      <div className="p-8 border-r border-b border-white/10 bg-white/[0.03]">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                          {criteria.label}
                        </span>
                      </div>
                      {plans
                        .filter((p) => selectedPlans.includes(p.id))
                        .map((plan) => (
                          <div
                            key={plan.id}
                            className="p-8 border-r border-b border-white/10 last:border-r-0 hover:bg-white/[0.02] transition-colors"
                          >
                            <span className="font-bold text-lg">
                              {(plan as any)[criteria.key]}
                            </span>
                          </div>
                        ))}
                    </React.Fragment>
                  ))}

                  {/* Description / Summary */}
                  <div className="contents">
                    <div className="p-8 border-r border-b border-white/10 bg-white/[0.03]">
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                        TỔNG QUAN
                      </span>
                    </div>
                    {plans
                      .filter((p) => selectedPlans.includes(p.id))
                      .map((plan) => (
                        <div
                          key={plan.id}
                          className="p-8 border-r border-b border-white/10 last:border-r-0 text-white/70 leading-relaxed italic"
                        >
                          "{plan.description}"
                        </div>
                      ))}
                  </div>

                  {/* Detailed Itinerary Row */}
                  <div className="contents">
                    <div className="p-8 border-r border-white/10 bg-white/[0.03]">
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                        LỘ TRÌNH
                      </span>
                    </div>
                    {plans
                      .filter((p) => selectedPlans.includes(p.id))
                      .map((plan) => (
                        <div
                          key={plan.id}
                          className="p-8 border-r border-white/10 last:border-r-0"
                        >
                          <div className="space-y-4">
                            {plan.points.map((step, idx) => (
                              <div key={idx} className="flex gap-4 items-start">
                                <div className="w-6 h-6 rounded-lg bg-accent/20 flex-center flex-shrink-0 text-[10px] font-black border border-accent/20 text-accent">
                                  {idx + 1}
                                </div>
                                <div className="text-xs font-semibold text-white/80">
                                  {step}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setIsCompareMode(false)}
                    className="glass px-12 py-5 rounded-2xl font-black text-sm hover:bg-white hover:text-black transition-all shadow-2xl"
                  >
                    QUAY LẠI DANH SÁCH
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Details Modal */}
      <AnimatePresence>
        {viewingPlanId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex-center p-0 sm:p-6 md:p-12 lg:p-24"
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setViewingPlanId(null)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="glass w-full h-full sm:h-auto max-w-5xl sm:max-h-[90vh] overflow-y-auto relative z-10 p-6 md:p-16 border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-none sm:rounded-[40px]"
            >
               <button
                onClick={() => setViewingPlanId(null)}
                className="absolute top-4 md:top-8 right-4 md:right-8 w-10 h-10 md:w-14 md:h-14 glass rounded-full flex-center hover:bg-white hover:text-black transition-all"
              >
                <X size={24} />
              </button>

              <div className="grid lg:grid-cols-2 gap-16">
                <div>
                  <span className="text-accent font-black uppercase tracking-widest block mb-4">
                    Chi tiết Phương án
                  </span>
                  <h2 className="text-2xl md:text-5xl font-black mb-6 md:mb-8 leading-tight">
                    {getViewingPlan()?.title}
                  </h2>
                  <p className="text-base md:text-xl text-white/70 mb-8 md:mb-10 leading-relaxed">
                    {getViewingPlan()?.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
                    <div className="glass-dark p-4 md:p-6 rounded-2xl border border-white/5">
                      <div className="text-white/40 text-[10px] md:text-xs font-bold uppercase mb-1 md:mb-2">
                        Thời lượng
                      </div>
                      <div className="text-xl md:text-2xl font-black text-accent">
                        {getViewingPlan()?.duration}
                      </div>
                    </div>
                    <div className="glass-dark p-4 md:p-6 rounded-2xl border border-white/5">
                      <div className="text-white/40 text-[10px] md:text-xs font-bold uppercase mb-1 md:mb-2">
                        Dự kiến chi phí
                      </div>
                      <div className="text-xl md:text-2xl font-black text-accent">
                        {getViewingPlan()?.cost}
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-accent text-black font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform text-lg">
                    Tải Lịch Trình PDF
                  </button>
                </div>

                <div className="space-y-8">
                  <h4 className="text-xl font-bold border-b border-white/10 pb-4">
                    Lịch trình từng bước
                  </h4>
                  <div className="space-y-6">
                    {getViewingPlan()?.points.map((pt, i) => (
                      <div key={i} className="flex gap-6 items-start">
                        <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex-center flex-shrink-0 text-accent font-black">
                          {i + 1}
                        </div>
                        <div className="pt-2 text-white/90 text-lg leading-relaxed">
                          {pt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-24 border-t border-white/5 bg-black/20">
        <div className="container text-center">
          <div className="mb-12 flex-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent flex-center text-black font-black text-2xl shadow-2xl shadow-accent/20">
              M
            </div>
            <div className="text-left">
              <div className="font-black text-2xl tracking-tighter leading-none">
                MÙ CANG CHẢI
              </div>
              <div className="text-accent text-[10px] font-bold tracking-[0.4em]">
                HÀNH TRÌNH 2026
              </div>
            </div>
          </div>
          <p className="text-white/30 text-xs max-w-xl mx-auto leading-relaxed mb-12 italic">
            "Ruộng bậc thang Mù Cang Chải là tuyệt tác nghệ thuật từ bàn tay và
            khối óc của người dân vùng cao."
          </p>
          <div className="h-[1px] w-40 bg-white/10 mx-auto mb-12" />
          <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
            Hợp tác cùng cộng đồng bản địa để gìn giữ vẻ đẹp của Tây Bắc. <br />
            © 2026 Mù Cang Chải Travel Guide.
          </p>
        </div>
      </footer>

      {/* Share Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-12 left-1/2 z-[200] px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center gap-3 text-sm font-bold tracking-wide"
          >
            <div className="w-8 h-8 rounded-full bg-accent flex-center text-black shadow-[0_0_15px_rgba(255,204,0,0.5)]">
               <Share2 size={14} />
            </div>
            <span className="text-white whitespace-nowrap">Đã sao chép liên kết hành trình!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
