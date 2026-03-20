import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, ArrowRight } from 'lucide-react';

export default function IdentityModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('travel_user');
    if (!user) {
      setIsOpen(true);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('travel_user', name.trim());
      setIsOpen(false);
      // Phát event để các component khác tự update nếu cần
      window.dispatchEvent(new Event('identity_updated'));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-[#050a06]/90 backdrop-blur-2xl flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-black/40 border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 mx-auto bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,204,0,0.1)]">
                <UserCircle size={40} strokeWidth={1.5} />
              </div>

              <h2 className="text-3xl font-black mb-3 text-white">Bạn là ai?</h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed font-medium">
                Chọn tên của bạn trong <strong className="text-white">Nhóm Hảo Hán</strong>, hoặc nhập một bí danh khác ở bên dưới:
              </p>

              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {['Nguyễn Duy Tân', 'Trần Thế Dũng', 'Nguyễn Thế Quyết', 'Nguyễn Văn Tuyển', 'Lê Thị Xuân Thu', 'Nguyễn Khắc Hiếu', 'Trần Hải Nam'].map(member => (
                  <button
                    key={member}
                    type="button"
                    onClick={() => setName(member)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${name === member ? 'bg-[var(--accent)] text-black border-[var(--accent)] shadow-[0_0_15px_rgba(255,204,0,0.3)]' : 'bg-white/5 text-white/70 border-white/10 hover:border-[var(--accent)]/50 hover:text-white'}`}
                  >
                    {member}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Bí danh của bạn (VD: Trành)..."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-white/5 px-6 py-4 rounded-2xl text-center text-lg font-bold text-[var(--accent)] border border-white/10 focus:border-[var(--accent)]/50 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,204,0,0.1)] outline-none transition-all placeholder-white/20"
                  autoFocus
                  required
                />

                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full bg-[var(--accent)] text-black font-black py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-white hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed uppercase tracking-wider text-sm mt-2 shadow-[0_10px_30px_rgba(255,204,0,0.2)]"
                >
                  Bắt Đầu Hành Trình <ArrowRight size={18} strokeWidth={3} />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
