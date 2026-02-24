import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Sparkles } from 'lucide-react';

const checklistItems = [
    { id: 1, text: 'Trang phục lịch sự (quần/váy dài quá gối).' },
    { id: 2, text: 'Giày thể thao (vì đi bộ rất nhiều).' },
    { id: 3, text: 'Nước uống (1-2 chai/người vì leo núi rất khát).' },
    { id: 4, text: 'Sạc dự phòng (chụp ảnh nhóm cực tốn pin).' },
    { id: 5, text: 'Tiền mặt/Chuyển khoản (Đóng quỹ cho thủ quỹ Dung).' },
    { id: 6, text: 'Ô che nắng/Kem chống nắng (Đừng để đen thui khi về).' },
];

const faqItems = [
    {
        question: 'Trời mưa thì sao?',
        answer: 'Thì che ô đi tiếp, đã chốt là đi, cấm xé vé hoàn tiền!',
    },
    {
        question: 'Ai bao chuyến này?',
        answer: 'Cam-pu-chia toàn tập (chia đều). Kế toán Dung sẽ thu tiền và trảm những ai trốn viện phí.',
    },
    {
        question: 'Được mang người yêu theo không?',
        answer: 'Tùy, nhưng phát cơm chó thì sẽ bị anh em ném xuống hồ Lục Ngạn cho cá ăn.',
    },
    {
        question: 'Đến muộn lúc 07:50 thì sao?',
        answer: 'Phạt thẳng 50k vào quỹ chung. Muộn 15 phút thì tự bắt xe bus về Hà Nam đuổi theo nhóm.',
    }
];

const Checklist = () => {
    const [checkedItems, setCheckedItems] = useState<number[]>([]);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const toggleCheck = (id: number) => {
        if (checkedItems.includes(id)) {
            setCheckedItems(checkedItems.filter(item => item !== id));
        } else {
            setCheckedItems([...checkedItems, id]);
        }
    };

    return (
        <section className="py-20 md:py-32 bg-forest-50 relative overflow-hidden" id="checklist">
            {/* Soft background glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-radial from-forest-200/50 to-transparent blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-gold-100/40 to-transparent blur-3xl opacity-60 pointer-events-none"></div>

            <div className="container px-4 sm:px-6 mx-auto max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-start">

                    {/* Checklist Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -30, y: 20 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                        className="order-2 lg:order-1 relative"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-forest-300 to-gold-300 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-white/80 p-6 sm:p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl border border-white/60">

                            <div className="mb-8 md:mb-10 flex flex-col">
                                <span className="inline-flex items-center gap-2 text-[10px] md:text-sm font-bold uppercase tracking-widest text-forest-500 bg-forest-50 w-max px-4 py-1.5 rounded-full mb-4 border border-forest-100 shadow-sm">
                                    <Sparkles size={16} className="text-gold-500" /> Chuẩn Bị
                                </span>
                                <h2 className="text-3xl md:text-5xl font-black text-forest-900 tracking-tight flex items-center gap-4">
                                    Hành Trang
                                </h2>
                                <p className="text-slate-500 mt-4 text-sm md:text-base font-medium">
                                    Click vào để check đồ đã chuẩn bị. Nhớ mang đủ kẻo toang!
                                    <span className="ml-2 inline-block px-2 py-0.5 bg-forest-100 text-forest-600 rounded-md text-xs font-bold">{checkedItems.length}/{checklistItems.length}</span>
                                </p>
                            </div>

                            <div className="space-y-3 md:space-y-4 relative">
                                {/* Completion Progress Bar */}
                                <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-forest-400 to-gold-400"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(checkedItems.length / checklistItems.length) * 100}%` }}
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                </div>

                                {checklistItems.map((item, i) => {
                                    const isChecked = checkedItems.includes(item.id);
                                    return (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            whileHover={{ scale: 1.02, x: 5 }}
                                            whileTap={{ scale: 0.98 }}
                                            key={item.id}
                                            onClick={() => toggleCheck(item.id)}
                                            className={`group/item flex items-start gap-4 p-4 md:p-5 rounded-[1.5rem] cursor-pointer transition-all duration-300 border-2 overflow-hidden relative ${isChecked
                                                ? 'bg-forest-50/80 border-forest-200'
                                                : 'bg-white border-transparent hover:border-slate-100 hover:shadow-md'
                                                }`}
                                            style={!isChecked ? { boxShadow: "0 4px 20px -10px rgba(0,0,0,0.05)" } : {}}
                                        >
                                            {/* Hover highlight background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-forest-50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                            <div className={`mt-0.5 relative z-10 flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm ${isChecked
                                                ? 'bg-gradient-to-br from-forest-400 to-forest-600 border-forest-500 scale-110 shadow-forest-500/30 text-white'
                                                : 'border-slate-200 text-transparent bg-slate-50 group-hover/item:border-forest-300'
                                                }`}>
                                                <Check size={16} strokeWidth={isChecked ? 3 : 2} className={isChecked ? "opacity-100" : "opacity-0"} />
                                            </div>

                                            <span className={`relative z-10 text-slate-700 font-medium text-sm md:text-base leading-snug md:leading-relaxed transition-all duration-500 ${isChecked ? 'line-through decoration-forest-300 text-slate-400' : 'group-hover/item:text-slate-900'
                                                }`}>
                                                {item.text}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* FAQ Area */}
                    <motion.div
                        initial={{ opacity: 0, x: 30, y: 20 }}
                        whileInView={{ opacity: 1, x: 0, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
                        className="order-1 lg:order-2 lg:sticky lg:top-24"
                    >
                        <div className="mb-10 md:mb-12">
                            <span className="inline-flex items-center gap-2 text-[10px] md:text-sm font-bold uppercase tracking-widest text-gold-600 bg-gold-50 w-max px-4 py-1.5 rounded-full mb-4 border border-gold-100 shadow-sm">
                                ❓ Giải Đáp
                            </span>
                            <h2 className="text-3xl md:text-5xl font-black text-forest-900 tracking-tight">
                                Hỏi Đáp Nhanh
                            </h2>
                            <p className="text-slate-500 mt-4 text-sm md:text-base font-medium max-w-md">
                                Đôi lời giải đáp những thắc mắc ngớ ngẩn nhất của anh em trước giờ G.
                            </p>
                        </div>

                        <div className="space-y-4 md:space-y-5">
                            {faqItems.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className={`glass-panel rounded-[2rem] overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg border-forest-200 ring-1 ring-forest-500/20' : 'hover:shadow-md hover:border-forest-100/50'}`}
                                    >
                                        <button
                                            onClick={() => setOpenFaq(isOpen ? null : index)}
                                            className={`w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none transition-colors duration-300 ${isOpen ? 'bg-forest-50/50' : 'hover:bg-slate-50/50'}`}
                                        >
                                            <span className={`font-bold pr-4 text-base md:text-xl font-display tracking-wide transition-colors ${isOpen ? 'text-forest-700' : 'text-slate-800'}`}>
                                                {faq.question}
                                            </span>
                                            <motion.div
                                                animate={{ rotate: isOpen ? 180 : 0, backgroundColor: isOpen ? '#f0fdf4' : '#f8fafc', color: isOpen ? '#22c55e' : '#94a3b8' }}
                                                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                                                className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-slate-100/50 shadow-sm"
                                            >
                                                <ChevronDown size={20} strokeWidth={2.5} />
                                            </motion.div>
                                        </button>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                >
                                                    <div className="px-6 md:px-8 pb-6 md:pb-8 text-slate-600 text-sm md:text-base leading-relaxed font-medium bg-gradient-to-b from-transparent to-forest-50/30">
                                                        <div className="w-12 h-1 bg-gradient-to-r from-forest-300 to-gold-300 rounded-full mb-4 opacity-50"></div>
                                                        {faq.answer}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Checklist;
