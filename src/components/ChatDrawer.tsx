import React, { useState, useEffect, useRef } from 'react';
import { Send, UserCircle2, X, Trash2 } from 'lucide-react';
import { fetchMessages, postMessage, deleteMessage, BASE_URL } from '../lib/api';
import { motion } from 'framer-motion';

export default function ChatDrawer({ tripId, onClose }: { tripId: string, onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [author, setAuthor] = useState(localStorage.getItem('travel_user') || 'Người ẩn danh');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const firstLoadRef = useRef(true);

  const loadMessages = () => {
    fetchMessages(tripId).then(data => {
      setMessages(data);
      setLoading(false);
      
      // Smart Auto-scroll: Only scroll to bottom if user is already near bottom, or if it is the very first load
      if (scrollRef.current) {
        const el = scrollRef.current;
        const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 200;
        
        if (firstLoadRef.current || isNearBottom) {
          setTimeout(() => {
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }, 50);
          firstLoadRef.current = false;
        }
      }
    });
  };

  useEffect(() => {
    // 1. Tải toàn bộ tin nhắn lịch sử
    loadMessages();
    
    // 2. Mở cổng kết nối Realtime SSE
    const eventSource = new EventSource(`${BASE_URL}/api/trips/${tripId}/messages/stream`);
    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      
      if (eventData.type === 'NEW_MESSAGE') {
        const newMsg = eventData.data;
        setMessages(prev => {
          if (prev.find(m => m.id === newMsg.id || (m.timestamp === newMsg.timestamp && m.author === newMsg.author))) return prev;
          return [...prev, newMsg];
        });
        
        // Auto-scroll nếu đang ở đáy
        if (scrollRef.current) {
          const el = scrollRef.current;
          const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 250;
          if (isNearBottom) {
            setTimeout(() => {
              if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }, 50);
          }
        }
      } else if (eventData.type === 'DELETE_MESSAGE') {
        const { messageId } = eventData;
        setMessages(prev => prev.filter(m => m.id !== messageId));
      }
    };

    const handleIdentityChange = () => {
      setAuthor(localStorage.getItem('travel_user') || 'Người ẩn danh');
    };
    window.addEventListener('identity_updated', handleIdentityChange);
    
    return () => {
      eventSource.close();
      window.removeEventListener('identity_updated', handleIdentityChange);
    };
  }, [tripId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;
    
    const sender = author.trim();
    const text = content.trim();
    setContent('');
    
    // Optimistic UI update
    const tempMsg = { id: Date.now().toString(), author: sender, content: text, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);
    
    // Always force scroll to bottom when user sends their own message
    setTimeout(() => {
      if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);

    postMessage(tripId, sender, text).catch(err => {
      console.error('Lỗi khi gửi:', err);
      loadMessages();
    });
  };

  const handleDelete = async (msgId: string) => {
    // Optimistic Delete
    setMessages(prev => prev.filter(m => m.id !== msgId));
    try {
      await deleteMessage(tripId, msgId, author);
    } catch (err) {
      console.error('Failed to delete', err);
      loadMessages(); // Revert
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[105] bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 w-full md:w-[450px] h-[100svh] z-[110] bg-[#0a0f0b]/95 backdrop-blur-3xl border-l border-white/10 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2 text-[var(--accent)]">
               Kênh Thảo Luận
            </h3>
            <p className="text-xs text-white/50 mt-1">Bàn luận trước, trong và sau chuyến đi</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 p-6 overflow-y-auto space-y-6 scroll-smooth"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
        >
          {loading ? (
            <div className="text-center text-white/40 text-sm mt-10">Đang đồng bộ dữ liệu...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-white/30 text-sm italic mt-10">Phòng thảo luận trống. Khởi động câu chuyện ngay nào!</div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 group"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center flex-shrink-0 border border-[var(--accent)]/30">
                    <UserCircle2 size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[var(--accent)]">{msg.author}</span>
                      <span className="text-[10px] text-white/30 font-semibold">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      {msg.author === author && (
                        <button 
                          onClick={() => handleDelete(msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-white/30 hover:text-red-500 rounded-md hover:bg-white/5 ml-auto"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="bg-white/5 p-4 rounded-b-2xl rounded-tr-2xl text-sm leading-relaxed border border-white/5 shadow-sm inline-block max-w-[95%]">
                      {msg.content}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-6 bg-black/40 border-t border-white/10 flex flex-col gap-3 pb-24 md:pb-6 relative z-10">
          <div className="flex items-center gap-2 px-1 mb-2">
            <UserCircle2 size={16} className="text-white/40" />
            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">Đang nhắn dưới tên:</span>
            <span className="text-xs text-[var(--accent)] font-black">{author}</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nhắn tin vào nhóm..." 
              value={content}
              onChange={e => setContent(e.target.value)}
              className="flex-1 bg-white/5 text-sm px-4 py-3 rounded-xl focus:bg-white/10 outline-none font-medium text-white placeholder-white/30 border border-white/5 focus:border-[var(--accent)]/50 transition-colors"
              required
              autoFocus
            />
            <button 
              type="submit" 
              disabled={!content.trim() || !author.trim()}
              className="bg-[var(--accent)] text-black aspect-square w-[46px] rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:scale-[1.05] transition-all shadow-[0_0_15px_var(--accent)]"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </motion.div>
    </>
  );
}
