import { motion } from 'framer-motion';
import { Car, Ticket, Anchor, Utensils, Castle, Mountain, SunMedium, Home } from 'lucide-react';
import { WavyText } from './ui/WavyText';
import { ScrollReveal } from './ui/ScrollReveal';

const timelineData = [
    {
        time: '08:00',
        title: 'Xuất phát từ Hà Nội',
        description: 'Tập trung lúc 07:50 tại Artemis Lê Trọng Tấn. Di chuyển theo hướng QL1A hoặc cao tốc Pháp Vân - Cầu Giẽ.',
        icon: Car,
        color: 'from-blue-400 to-blue-600',
        shadow: 'shadow-blue-500/40',
        iconBg: 'bg-blue-500'
    },
    {
        time: '09:30',
        title: 'Có mặt tại Chùa Tam Chúc',
        description: 'Cả nhóm gửi xe, di chuyển vào nhà khách Thủy Đình mua vé. Gợi ý: Mua combo Thuyền + Xe điện (270k/người).',
        icon: Ticket,
        color: 'from-orange-400 to-orange-600',
        shadow: 'shadow-orange-500/40',
        iconBg: 'bg-orange-500'
    },
    {
        time: '10:00 - 11:30',
        title: 'Du ngoạn hồ Lục Ngạn',
        description: 'Đi thuyền ra giữa hồ, check-in tại Đình Tam Chúc. Chụp ảnh nhóm với view "Hạ Long trên cạn".',
        icon: Anchor,
        color: 'from-cyan-400 to-cyan-600',
        shadow: 'shadow-cyan-500/40',
        iconBg: 'bg-cyan-500'
    },
    {
        time: '11:30 - 12:30',
        title: 'Check-in Vườn Cột Kinh & Ăn trưa',
        description: 'Tham quan 32 cột kinh đá khổng lồ. Nghỉ ngơi, ăn trưa ngay bờ hồ chill chill.',
        icon: Utensils,
        color: 'from-rose-400 to-rose-600',
        shadow: 'shadow-rose-500/40',
        iconBg: 'bg-rose-500'
    },
    {
        time: '12:30 - 14:30',
        title: 'Hành trình chiêm bái Điện chính',
        description: 'Đi bộ tham quan: Điện Quan Âm -> Điện Pháp Chủ -> Điện Tam Thế. Ngắm các bức phù điêu bằng đá.',
        icon: Castle,
        color: 'from-amber-400 to-amber-600',
        shadow: 'shadow-amber-500/40',
        iconBg: 'bg-amber-500'
    },
    {
        time: '14:30 - 16:00',
        title: 'Chinh phục Chùa Ngọc (Đỉnh núi)',
        description: 'Leo bộ khoảng 299 bậc đá. Đây là điểm cao nhất để ngắm toàn cảnh Tam Chúc từ trên cao.',
        icon: Mountain,
        color: 'from-indigo-400 to-indigo-600',
        shadow: 'shadow-indigo-500/40',
        iconBg: 'bg-indigo-500'
    },
    {
        time: '16:00 - 17:00',
        title: 'Xuống núi & Đi xe điện',
        description: 'Đi xe điện từ khu vực điện chính trở lại bãi xe. Ngắm cảnh chiều tà ven hồ lần cuối.',
        icon: SunMedium,
        color: 'from-orange-300 to-orange-500',
        shadow: 'shadow-orange-400/40',
        iconBg: 'bg-orange-400'
    },
    {
        time: '17:15',
        title: 'Lên xe về Hà Nội',
        description: 'Điểm danh đủ 9 mạng rùi anh em lên xe về phố thị.',
        icon: Car,
        color: 'from-blue-500 to-blue-700',
        shadow: 'shadow-blue-600/40',
        iconBg: 'bg-blue-600'
    },
    {
        time: '19:00',
        title: 'Về đến Hà Nội',
        description: 'Kết thúc hành trình. Chuẩn bị tinh thần thứ 2 đi cày tiếp =))',
        icon: Home,
        color: 'from-forest-500 to-forest-700',
        shadow: 'shadow-forest-600/40',
        iconBg: 'bg-forest-600'
    },
];

const TimelineCard = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;

    return (
        <ScrollReveal
            yOffset={50}
            xOffset={isEven ? -30 : 30}
            className={`relative flex items-center justify-between md:justify-normal w-full mb-12 md:mb-20 ${isEven ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Connector Line (Desktop) */}
            <div className={`absolute left-1/2 top-4 bottom-[-80px] w-1 hidden md:block bg-gradient-to-b ${item.color} opacity-20`} style={{ transform: 'translateX(-50%)' }}></div>

            {/* Empty space for alternating layout on desktop */}
            <div className="hidden md:block w-[45%]"></div>

            {/* Center Icon */}
            <div className="relative z-10 flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full mx-4 md:mx-auto absolute md:relative left-[-15px] md:left-auto top-2 md:top-auto flex-shrink-0 group cursor-default">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${item.color} opacity-100 shadow-[0_0_20px_rgba(0,0,0,0.2)] md:group-hover:scale-110 md:group-hover:shadow-[0_0_30px_rgba(0,0,0,0.4)] transition-all duration-300 z-10 flex items-center justify-center border-4 border-forest-50`}>
                    <item.icon size={24} className="hidden md:block text-white drop-shadow-md" />
                    <item.icon size={18} className="md:hidden text-white drop-shadow-md" />
                </div>
                {/* Outer glowing ring */}
                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${item.color} blur-md opacity-60 md:group-hover:opacity-100 md:group-hover:scale-125 transition-all duration-500`}></div>
            </div>

            {/* Content Card */}
            <div className="w-[calc(100%-3rem)] md:w-[45%] pl-6 md:pl-0 ml-auto md:ml-0">
                <div className={`glass-panel p-5 md:p-8 rounded-[2rem] relative group/card transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 border border-white/80 bg-white/70 backdrop-blur-xl overflow-hidden`}>
                    {/* Card background subtle gradient */}
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.color} opacity-[0.05] group-hover/card:opacity-[0.15] transition-opacity duration-500 rounded-bl-full pointer-events-none`}></div>

                    <div className={`absolute w-4 h-4 rounded-full bg-gradient-to-br ${item.color} shadow-lg
                        ${isEven ? 'md:-right-2 md:left-auto md:top-8 hidden md:block' : 'md:-left-2 md:top-8 hidden md:block'}
                        -left-2 top-8 md:hidden
                    `}></div>

                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs md:text-sm font-bold text-white mb-3 md:mb-4 shadow-md bg-gradient-to-r ${item.color} ${item.shadow}`}>
                        {item.time}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2 md:mb-3 group-hover/card:text-forest-600 transition-colors font-display tracking-tight">
                        {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
                        {item.description}
                    </p>
                </div>
            </div>
        </ScrollReveal>
    );
};

const Timeline = () => {
    return (
        <section className="py-20 md:py-32 bg-forest-50 relative overflow-hidden" id="timeline">
            {/* Decorative background elements */}
            <div className="absolute top-20 left-[-10%] w-[40rem] h-[40rem] bg-forest-200/50 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none"></div>
            <div className="absolute top-1/2 right-[-10%] w-[35rem] h-[35rem] bg-gold-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="absolute bottom-20 left-1/4 w-[30rem] h-[30rem] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-4000 pointer-events-none"></div>

            <div className="container px-4 sm:px-6 mx-auto relative z-10 w-full text-center">
                <div className="text-center mb-16 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block bg-forest-100 text-forest-600 font-bold px-4 py-1.5 rounded-full text-sm tracking-widest uppercase mb-4 shadow-sm"
                    >
                        Hành Trình Chi Tiết
                    </motion.div>
                    <WavyText
                        text="Trục Thời Gian"
                        delay={0.1}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-forest-900 mb-4 md:mb-6 tracking-tight"
                    />
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto px-4 font-medium leading-relaxed"
                    >
                        Lịch trình 1 ngày dạo quanh siêu quần thể Tam Chúc. Thời gian có thể di dịch xíu xiu tùy độ "nhây" của anh em.
                    </motion.p>
                </div>

                <div className="relative max-w-5xl mx-auto pl-4 md:pl-0 sm:pr-4">
                    {/* Main vertical line (Mobile) */}
                    <div className="absolute left-[24px] top-4 bottom-4 w-1 bg-gradient-to-b from-blue-300 via-emerald-300 to-forest-300 md:hidden rounded-full opacity-50"></div>

                    {timelineData.map((item, index) => (
                        <TimelineCard key={index} item={item} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
