import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, X } from 'lucide-react';

export default function AdminAuthModal({
  isOpen,
  onClose,
  onSuccess
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pass: string) => void;
}) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass.trim()) {
      if (pass === '01664157092a') {
        setError('');
        onSuccess(pass.trim());
        setPass('');
      } else {
        setError('Sai mật khẩu! Vui lòng thử lại.');
      }
    }
  };

  const handleClose = () => {
    setPass('');
    setError('');
    onClose();
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
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-black/40 border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,1)] relative overflow-hidden"
          >
            <button onClick={handleClose} type="button" className="absolute top-6 right-6 text-white/50 hover:text-white z-20 transition-colors bg-white/5 hover:bg-white/10 p-2 rounded-full">
              <X size={20} />
            </button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/15 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10 text-center">
              <div className="w-20 h-20 mx-auto bg-red-500/10 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,0,0,0.1)]">
                <Lock size={40} strokeWidth={1.5} />
              </div>

              <h2 className="text-3xl font-black mb-3 text-white">Chế Độ Quản Trị</h2>
              <p className="text-white/60 text-sm mb-6 leading-relaxed font-medium">
                Vui lòng nhập mật khẩu cấp cao để mở khóa quyền chỉnh sửa dữ liệu nhật ký trực tiếp:
              </p>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <div>
                  <input
                    type="password"
                    placeholder="Mật khẩu Admin..."
                    value={pass}
                    onChange={e => { setPass(e.target.value); setError(''); }}
                    className={`w-full bg-white/5 px-6 py-4 rounded-2xl text-center text-lg font-bold text-red-400 border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-red-500/50'} focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,0,0,0.1)] outline-none transition-all placeholder-white/20`}
                    autoFocus
                    required
                  />
                  {error && <p className="text-red-400 text-xs font-bold mt-2 animate-pulse">{error}</p>}
                </div>

                <button
                  type="submit"
                  disabled={!pass.trim()}
                  className="w-full bg-red-500 text-white font-black py-4 rounded-2xl flex justify-center items-center gap-2 hover:bg-red-400 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed uppercase tracking-wider text-sm mt-2 shadow-[0_10px_30px_rgba(255,0,0,0.2)]"
                >
                  Xác Nhận <ArrowRight size={18} strokeWidth={3} />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
