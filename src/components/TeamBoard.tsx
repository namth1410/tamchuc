import { motion } from 'framer-motion';

const teamMembers = [
    { name: 'Hiếu', role: 'Trưởng Ban Tổ Chức', description: 'Người khởi xướng mọi cuộc vui. Lên timeline chuẩn chỉ.', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Hieu12&backgroundColor=b6e3f4', color: 'from-blue-400 to-cyan-300' },
    { name: 'Dung', role: 'Kế Toán Kiêm Thủ Quỹ', description: 'Tay hòm chìa khóa. Thích thu tiền hơn đi chơi.', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Dung123&backgroundColor=c0aede', color: 'from-purple-400 to-pink-300' },
    { name: 'Nam', role: 'Camera Man', description: 'Hy sinh thanh xuân để anh em có ảnh Facebook.', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Nam&backgroundColor=ffdfbf', color: 'from-orange-400 to-amber-300' },
    { name: 'Dũng', role: 'Thánh Phá Mồi', description: 'Đi chùa là phụ, ăn trưa là chính.', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Dung456&backgroundColor=d1d4f9', color: 'from-indigo-400 to-blue-300' },
    { name: 'Tân', role: 'Đội Trưởng Hậu Cần', description: 'Vác balo nặng nhất đoàn, bao gồm nước và đồ ăn vặt.', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Tan&backgroundColor=ffd5dc', color: 'from-rose-400 to-red-300' },
    { name: 'Tuyển', role: 'Bậc Thầy Giao Tiếp', description: 'Trò chuyện với sư thầy, cò vé tàu các kiểu.', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Tuyen&backgroundColor=b6e3f4', color: 'from-cyan-400 to-teal-300' },
    { name: 'Tâm', role: 'Nhà Bảo Hành Tâm Linh', description: 'Chăm đi lễ sớm, xin quẻ bói siêu chuẩn.', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Tam789&backgroundColor=c0aede', color: 'from-violet-400 to-purple-300' },
    { name: 'Quyết', role: 'Chúa Tể Cao Su', description: 'Tập trung 07:50 nhưng 08:00 mới ngủ dậy.', avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Quyet&backgroundColor=ffdfbf', color: 'from-yellow-400 to-orange-300' },
    { name: 'Mai Anh', role: 'Nữ Hoàng Cuốc Bộ', description: 'Thề sẽ leo đến Đỉnh Thất Tinh đầu tiên.', avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=MaiAnh22&backgroundColor=ffd5dc', color: 'from-pink-400 to-rose-300' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring" as const, stiffness: 100, damping: 12 }
    }
};

const TeamBoard = () => {
    return (
        <section className="py-20 md:py-32 bg-white relative overflow-hidden" id="team">
            {/* Very subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23166534\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>

            <div className="container px-4 sm:px-6 mx-auto relative z-10">
                <div className="text-center mb-16 md:mb-24">
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
                        9 gương mặt vàng trong làng phá đò... à nhầm, đi chùa Tam Chúc. Mỗi người một vẻ, mười phân vẹn mười điểm tấu hài.
                    </motion.p>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {teamMembers.map((member) => (
                        <motion.div
                            key={member.name}
                            variants={cardVariants}
                            whileHover={{
                                y: -12,
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 300, damping: 20 }
                            }}
                            className="group bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-forest-100 transition-all duration-300 text-center flex flex-col items-center relative overflow-hidden"
                        >
                            {/* Card glow effect */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-bl-full pointer-events-none`}></div>

                            <div className="relative mb-6 group-hover:scale-110 transition-transform duration-500">
                                {/* Avatar glow */}
                                <div className={`absolute inset-0 bg-gradient-to-tr ${member.color} rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`}></div>

                                <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white z-10">
                                    <img
                                        src={member.avatar}
                                        alt={member.name}
                                        className="w-full h-full object-cover transform group-hover:rotate-6 transition-transform duration-500"
                                    />
                                </div>
                                <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${member.color} border-4 border-white shadow-sm z-20`}></div>
                            </div>

                            <h3 className="text-xl md:text-2xl font-black text-slate-800 mb-2 font-display">{member.name}</h3>

                            <div className={`text-xs font-bold uppercase tracking-[0.15em] text-white bg-gradient-to-r ${member.color} px-4 py-1.5 rounded-full mb-4 shadow-sm group-hover:shadow-md transition-all`}>
                                {member.role}
                            </div>

                            <p className="text-slate-500 text-sm md:text-base leading-relaxed px-2 font-medium">
                                "{member.description}"
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default TeamBoard;
