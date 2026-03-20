import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, X, Loader2, Maximize2, Heart, Trash2 } from 'lucide-react';
import { fetchPhotos, uploadPhotos, deletePhoto, togglePhotoLike, BASE_URL } from '../lib/api';
import { compressImage } from '../lib/imageCompression';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const MediaItem = ({ photo, currentUser, onToggleLike, onDelete, onSelect }: any) => {
  const [loaded, setLoaded] = useState(false);
  const isVideo = photo.url.match(/\.(mp4|webm|ogg|mov)$/i);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={() => onSelect(`${BASE_URL}${photo.url}`)}
      className="relative rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer bg-white/[0.02] break-inside-avoid shadow-xl border border-white/10 group hover:!opacity-100 group-hover/masonry:opacity-30 transition-all duration-500 min-h-[200px]"
    >
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 animate-pulse">
          <Loader2 size={24} className="text-white/20 animate-spin" />
        </div>
      )}
      
      {isVideo ? (
        <video 
          src={`${BASE_URL}${photo.url}`} 
          className={`w-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
        />
      ) : (
        <img 
          src={`${BASE_URL}${photo.url}`} 
          alt="Memory" 
          className={`w-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 md:p-6 pointer-events-none">
        <div className="flex flex-col gap-2 relative z-10 pointer-events-auto">
          <div className="flex gap-2">
            <button onClick={onToggleLike} className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border outline-none transition-all ${photo.likes?.includes(currentUser) ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/20 text-white border-white/20 hover:bg-white/40'}`}>
              <Heart size={14} className={photo.likes?.includes(currentUser) ? 'fill-current' : ''} />
            </button>
            <span className="text-white/80 text-xs font-bold leading-8">{photo.likes?.length || 0}</span>
            
            {photo.author === currentUser && (
              <button onClick={onDelete} className="w-8 h-8 ml-2 rounded-full flex items-center justify-center bg-white/20 text-white border border-white/20 hover:bg-red-500/80 transition-all">
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <span className="text-[10px] text-white/90 font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 w-max">
            {photo.author} • {new Date(photo.timestamp).toLocaleDateString()}
          </span>
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 pointer-events-auto hover:bg-white hover:text-black transition-colors" onClick={() => onSelect(`${BASE_URL}${photo.url}`)}>
          <Maximize2 size={16} />
        </div>
      </div>
    </motion.div>
  );
};

export default function PhotoGalleryModal({ tripId, onClose }: { tripId: string, onClose: () => void }) {
  const [photos, setPhotos] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = () => {
    fetchPhotos(tripId).then(data => {
      setPhotos(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadPhotos();
  }, [tripId]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (visibleCount < photos.length) {
        setVisibleCount(prev => prev + 12);
      }
    }
  }, [visibleCount, photos.length]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const compressedFilesArray = await Promise.all(
        Array.from(files).map(file => compressImage(file))
      );
      
      const author = localStorage.getItem('travel_user') || 'Khách';
      await uploadPhotos(tripId, compressedFilesArray, 'Uploaded photo', author);
      loadPhotos();
    } catch (err) {
      console.error('Lỗi khi tải ảnh:', err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleToggleLike = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    const author = localStorage.getItem('travel_user') || 'Khách';
    // Optimistic UI
    setPhotos(prev => prev.map(p => {
      if (p.id !== photoId) return p;
      const likes = p.likes || [];
      const newLikes = likes.includes(author) ? likes.filter((l: string) => l !== author) : [...likes, author];
      return { ...p, likes: newLikes };
    }));
    await togglePhotoLike(tripId, photoId, author);
  };

  const handleDelete = async (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation();
    const author = localStorage.getItem('travel_user') || 'Khách';
    // Optimistic UI
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    try {
      await deletePhoto(tripId, photoId, author);
    } catch {
      loadPhotos();
    }
  };

  const currentUser = localStorage.getItem('travel_user') || 'Khách';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className={`fixed inset-0 z-[110] bg-[#050a06]/95 backdrop-blur-3xl ${selectedPhoto ? 'overflow-hidden' : 'overflow-y-auto'}`}
      style={{ scrollbarWidth: 'none' }}
      onScroll={handleScroll}
    >
      <div className="sticky top-0 z-[120] flex justify-between items-center p-6 md:p-10 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <h2 className="text-2xl md:text-4xl font-black text-white pointer-events-auto drop-shadow-lg tracking-tight">
          Khoảnh Khắc & <span className="text-[var(--accent)]">Kỷ Niệm</span>
        </h2>
        <div className="flex items-center gap-2 md:gap-4 pointer-events-auto">
          <input 
            type="file" 
            accept="image/*" 
            multiple
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleUpload} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-[var(--accent)] text-black font-bold px-4 py-2 md:px-6 md:py-3 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_var(--accent)] flex items-center gap-2 text-sm md:text-base"
          >
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            <span className="hidden md:inline">Thêm Kỷ Niệm</span>
            <span className="md:hidden">Thêm</span>
          </button>
          <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-black border border-white/20 transition-all">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-32 pt-4">
        {loading ? (
          <div className="flex h-[50vh] items-center justify-center text-white/50 animate-pulse font-medium">
            Đang tải dữ liệu bộ sưu tập...
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col h-[50vh] items-center justify-center text-white/40 border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] mt-8">
            <Upload size={64} className="mb-6 opacity-30" />
            <p className="text-xl font-medium">Chuyến đi này chưa có hình ảnh nào.</p>
            <p className="text-sm opacity-60 mt-2">Hãy là người đầu tiên chia sẻ khoảnh khắc!</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6 group/masonry">
            {photos.slice(0, visibleCount).map((photo) => (
              <MediaItem 
                key={photo.id} 
                photo={photo} 
                currentUser={currentUser} 
                onToggleLike={(e: React.MouseEvent) => handleToggleLike(e, photo.id)} 
                onDelete={(e: React.MouseEvent) => handleDelete(e, photo.id)} 
                onSelect={setSelectedPhoto} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Immersive View */}
      {createPortal(
        <AnimatePresence>
        {selectedPhoto && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-10"
            onClick={() => setSelectedPhoto(null)}
          >
            <button className="absolute top-6 right-6 w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors border border-white/20 z-[210]">
              <X size={24} />
            </button>
            {selectedPhoto.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <motion.video 
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                src={selectedPhoto} 
                className="w-full h-full max-w-full max-h-full rounded-2xl md:rounded-[2rem] shadow-[0_0_100px_rgba(255,255,255,0.05)] object-contain"
                controls
                autoPlay
                playsInline
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <motion.img 
                initial={{ scale: 0.8, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 40 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                src={selectedPhoto} 
                className="w-full h-full max-w-full max-h-full rounded-2xl md:rounded-[2rem] shadow-[0_0_100px_rgba(255,255,255,0.05)] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </motion.div>
        )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
