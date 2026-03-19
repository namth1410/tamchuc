import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Image as ImageIcon, Map } from 'lucide-react';
import ChatDrawer from './ChatDrawer';
import PhotoGalleryModal from './PhotoGalleryModal';
import MapModal from './MapModal';

export default function TripDock({ tripId }: { tripId: string }) {
  const [activeItem, setActiveItem] = useState<'map' | 'routeMap' | 'chat' | 'gallery'>('map');

  // Prevent background scrolling when a modal is active
  useEffect(() => {
    if (activeItem !== 'map') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; // Re-enable normal scroll
    }
    
    return () => { document.body.style.overflow = 'auto'; };
  }, [activeItem]);

  return (
    <>
      {/* Floating Dock */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 p-2 bg-black/60 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        <DockButton 
          icon={<Map size={20} />} 
          label="Lộ Trình" 
          active={activeItem === 'routeMap'} 
          onClick={() => setActiveItem('routeMap')} 
        />
        <div className="w-px h-8 bg-white/10 mx-1"></div>
        <DockButton 
          icon={<MessageSquare size={20} />} 
          label="Thảo Luận" 
          active={activeItem === 'chat'} 
          onClick={() => setActiveItem('chat')} 
          glow
        />
        <div className="w-px h-8 bg-white/10 mx-1"></div>
        <DockButton 
          icon={<ImageIcon size={20} />} 
          label="Cảnh Sắc" 
          active={activeItem === 'gallery'} 
          onClick={() => setActiveItem('gallery')} 
        />
      </motion.div>

      {/* Overlays */}
      <AnimatePresence>
        {activeItem === 'chat' && (
          <ChatDrawer tripId={tripId} onClose={() => setActiveItem('map')} />
        )}
        {activeItem === 'gallery' && (
          <PhotoGalleryModal tripId={tripId} onClose={() => setActiveItem('map')} />
        )}
        {activeItem === 'routeMap' && (
          <MapModal tripId={tripId} onClose={() => setActiveItem('map')} />
        )}
      </AnimatePresence>
    </>
  );
}

function DockButton({ icon, label, active, onClick, glow }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all duration-300 overflow-hidden ${active ? 'text-black bg-[var(--accent)] shadow-[0_0_20px_var(--accent)]' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
    >
      {glow && !active && (
        <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse border border-black z-10"></span>
      )}
      <span className="relative z-10">{icon}</span>
      <span className={`relative z-10 whitespace-nowrap ${active ? 'inline-block' : 'hidden md:inline-block'}`}>{label}</span>
      
      {active && (
        <motion.div 
          layoutId="dock-active-bg"
          className="absolute inset-0 bg-[var(--accent)] rounded-full -z-0"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}
