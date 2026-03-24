import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaneTakeoff, X, CheckCircle2, Upload, Trash2 } from 'lucide-react';
import { createTrip, updateTrip, BASE_URL } from '../lib/api';

export default function CreateTripModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  tripToEdit,
  adminPass
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSuccess: () => void,
  tripToEdit?: any,
  adminPass?: string
}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [theme, setTheme] = useState('yellow');
  const [loading, setLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Predefined gorgeous color themes
  const THEMES = [
    { id: 'yellow', name: 'Nắng Ban Mai', color: '#ffcc00', bg: '#0a0f0b' },
    { id: 'green', name: 'Trường Lâm', color: '#65bd90', bg: '#050a06' },
    { id: 'blue', name: 'Băng Thạch', color: '#688ca8', bg: '#080d12' },
    { id: 'sunset', name: 'Hoàng Hôn', color: '#f97316', bg: '#100a08' },
    { id: 'purple', name: 'Tinh Vân', color: '#c084fc', bg: '#0a0510' }
  ];

  // Sync state if editing
  React.useEffect(() => {
    if (tripToEdit && isOpen) {
      setTitle(tripToEdit.title || '');
      setDate(tripToEdit.date || '');
      const matchedTheme = THEMES.find(t => t.color.toLowerCase() === tripToEdit.color?.toLowerCase());
      setTheme(matchedTheme ? matchedTheme.id : 'yellow');
      
      if (tripToEdit.coverUrl) {
        setPreview(tripToEdit.coverUrl.startsWith('http') ? tripToEdit.coverUrl : `${BASE_URL}${tripToEdit.coverUrl}`);
      } else {
        setPreview(null);
      }
    } else if (!tripToEdit && isOpen) {
      setTitle('');
      setDate('');
      setTheme('yellow');
      setPreview(null);
    }
    setCoverFile(null);
  }, [tripToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    const selectedTheme = THEMES.find(t => t.id === theme) || THEMES[0];
    
    try {
      if (tripToEdit && adminPass) {
        await updateTrip(
          tripToEdit.id,
          {
            title: title.trim(),
            date: date.trim(),
            color: selectedTheme.color,
            bg: selectedTheme.bg,
            // If preview was cleared by user, empty the url. Focus only on url update here.
            coverUrl: preview ? tripToEdit.coverUrl : ""
          },
          coverFile,
          adminPass
        );
      } else {
        await createTrip({
          title: title.trim(),
          date: date.trim() || 'Sắp khởi hành',
          color: selectedTheme.color,
          bg: selectedTheme.bg
        }, coverFile);
      }
      
      if (!tripToEdit) {
        setTitle('');
        setDate('');
        setTheme('yellow');
        setCoverFile(null);
        setPreview(null);
      }
      onSuccess();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            className="w-full max-w-lg max-h-[90vh] bg-[#111] border border-white/10 rounded-[2rem] shadow-2xl relative overflow-y-auto overflow-x-hidden m-auto"
          >
            <div className="sticky top-0 right-0 w-full h-20 bg-gradient-to-b from-[#111] via-[#111]/80 to-transparent pointer-events-none z-[5]" />
            
            <div className="p-8 pb-4 flex justify-between items-center relative z-10 -mt-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <PlaneTakeoff size={20} />
                </div>
                <h2 className="text-xl font-black text-white">
                  {tripToEdit ? 'Chỉnh Sửa Hành Trình' : 'Tạo Hành Trình Mới'}
                </h2>
              </div>
              <button type="button" onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white shrink-0">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6 relative z-10">
              {/* Photo Upload Section */}
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Ảnh Bìa Hành Trình (Tùy chọn)</label>
                <div className="flex items-center gap-4">
                  {preview ? (
                    <div className="relative w-24 h-24 rounded-2xl border border-white/10 overflow-hidden shrink-0 group">
                      <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                      <button 
                        type="button" 
                        onClick={() => { setCoverFile(null); setPreview(null); }} 
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity w-full h-full"
                      >
                        <Trash2 size={24} className="text-red-400" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all shrink-0">
                      <Upload size={24} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white/80">Chọn ảnh lưu bút</p>
                    <p className="text-xs text-white/40 mt-1">Ảnh đẹp giúp sổ tay sinh động hơn rât nhiều.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Tên Chuyến Đi</label>
                <input 
                  type="text" 
                  placeholder="Vd: Xuyên Việt 2026..." 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white/5 px-5 py-4 rounded-xl text-white font-semibold border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all placeholder-white/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-2">Thời gian (Tuỳ chọn)</label>
                <input 
                  type="text" 
                  placeholder="Vd: Tháng 10/2026" 
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-white/5 px-5 py-4 rounded-xl text-white font-medium border border-white/10 focus:border-white/30 focus:bg-white/10 outline-none transition-all placeholder-white/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Màu Sắc Chủ Đạo (Theme)</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${theme === t.id ? 'bg-white/10 border-white/30 shadow-lg' : 'bg-transparent border-transparent hover:bg-white/5'}`}
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full shadow-inner" style={{ backgroundColor: t.color }} />
                      <span className="text-[10px] md:text-xs font-bold text-white/80 text-center">{t.name}</span>
                      {theme === t.id && (
                        <div className="absolute -top-2 -right-2 bg-white text-black rounded-full p-0.5">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="w-full bg-white text-black font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-wider text-sm"
                >
                  {loading ? 'Đang xử lý...' : (tripToEdit ? 'Cập Nhật Nhật Ký' : 'Lưu Vào Sổ Nhật Ký')}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
