import { motion } from 'framer-motion';
import { DomeGallery } from './ui/DomeGallery';

const teamMembers = [
    { id: 1, name: 'Hiếu', role: 'Trưởng Ban Tổ Cchức', description: 'Người khởi xướng mọi cuộc vui. Lên timeline chuẩn chỉ.', avatar: '/Hiếu.png', color: 'from-blue-400 to-cyan-300' },
    { id: 2, name: 'Nam', role: 'Chiến Thần AI', description: 'Chúa tể ngôn ngữ, bậc thầy code dạo. Luôn sẵn sàng giải đáp mọi thắc mắc.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Nam', color: 'from-emerald-400 to-teal-300' },
    { id: 3, name: 'Dung', role: 'Kế Toán Kiêm Thủ Quỹ', description: 'Tay hòm chìa khóa. Thích thu tiền hơn đi chơi.', avatar: '/Dung.png', color: 'from-purple-400 to-pink-300' },
    { id: 4, name: 'Dũng', role: 'Thánh Phá Mồi', description: 'Đi chùa là phụ, ăn trưa là chính.', avatar: '/Dũng.png', color: 'from-indigo-400 to-blue-300' },
    { id: 5, name: 'Tân', role: 'Đội Trưởng Hậu Cần', description: 'Vác balo nặng nhất đoàn, bao gồm nước và đồ ăn vặt.', avatar: '/Tân.png', color: 'from-rose-400 to-red-300' },
    { id: 6, name: 'Tuyển', role: 'Bậc Thầy Giao Tiếp', description: 'Trò chuyện với sư thầy, cò vé tàu các kiểu.', avatar: '/Tuyển.png', color: 'from-cyan-400 to-teal-300' },
    { id: 7, name: 'Tâm', role: 'Nhà Bảo Hành Tâm Linh', description: 'Chăm đi lễ sớm, xin quẻ bói siêu chuẩn.', avatar: '/Tâm.png', color: 'from-violet-400 to-purple-300' },
    { id: 8, name: 'Quyết', role: 'Chúa Tể Cao Su', description: 'Tập trung 07:50 nhưng 08:00 mới ngủ dậy.', avatar: '/Quyết.png', color: 'from-yellow-400 to-orange-300' },
    { id: 9, name: 'Định', role: 'Ông Hoàng Cuốc Bộ', description: 'Thề sẽ leo đến Đỉnh Thất Tinh đầu tiên.', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Nam', color: 'from-pink-400 to-rose-300' },
];

const TeamBoard = () => {
    const galleryImages = teamMembers.map(m => ({
        src: m.avatar,
        alt: `${m.name} - ${m.role}`,
        name: m.name,
        role: m.role,
        description: m.description
    }));

    return (
        <section className="py-20 md:py-32 bg-white relative overflow-hidden" id="team">
            {/* Very subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23166534\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

            <div className="container px-4 sm:px-6 mx-auto relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block bg-forest-50 border border-forest-100 text-forest-600 font-bold px-4 py-1.5 rounded-full text-sm tracking-widest uppercase mb-4 shadow-sm"
                    >
                        Thành Viên
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black text-forest-900 mb-4 md:mb-6 tracking-tight"
                    >
                        Bảng Phong Thần
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto px-4 font-medium leading-relaxed"
                    >
                        9 gương mặt vàng trong làng phá đò... à nhầm, đi chùa Tam Chúc. Kéo để xoay panorama mượt mà!
                    </motion.p>
                </div>

                <div className="w-full h-[500px] md:h-[700px] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-50">
                    <DomeGallery
                        images={galleryImages}
                        fit={0.5}
                        overlayBlurColor="#ffffff"
                        imageBorderRadius="2rem"
                        grayscale={false}
                    />
                </div>
            </div>
        </section>
    );
};

export default TeamBoard;
