import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SSE Realtime Clients Tracking
const chatClients = {};

// Storage setup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const dbFile = path.join(__dirname, 'data.json');
if (!fs.existsSync(dbFile)) {
  const initialData = {
    trips: [
      { id: 'tam-chuc', title: 'Hành trình tĩnh lặng: Tam Chúc - Hà Nam', color: '#2d4f1e', bg: '#081205' },
      { id: 'ha-giang', title: 'Chinh phục Mã Pì Lèng, Hà Giang', color: '#688ca8', bg: '#080d12' }
    ],
    messages: {},
    photos: {}
  };
  fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2));
}

function readDB() {
  const data = fs.readFileSync(dbFile, 'utf-8');
  return JSON.parse(data);
}

function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// API: Get Trips
app.get('/api/trips', (req, res) => {
  const db = readDB();
  res.json(db.trips);
});

// API: Create new Trip
app.post('/api/trips', upload.single('cover'), (req, res) => {
  const { title, date, color, bg } = req.body;
  if (!title) return res.status(400).json({ error: 'Missing title' });

  const coverUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const db = readDB();
  const id = 'trip-' + Date.now().toString();
  const newTrip = {
    id,
    title,
    date: date || 'Sắp tới',
    color: color || '#ffcc00',
    bg: bg || '#0a0f0b',
    coverUrl
  };
  
  db.trips.push(newTrip);
  // Initialize nested arrays for the new trip
  db.messages[id] = [];
  db.photos[id] = [];
  
  writeDB(db);
  res.json(newTrip);
});

// API: Get specific trip
app.get('/api/trips/:id', (req, res) => {
  const db = readDB();
  const trip = db.trips.find(t => t.id === req.params.id);
  if (trip) res.json(trip);
  else res.status(404).json({ error: 'Trip not found' });
});

// API: Get messages for a trip
app.get('/api/trips/:id/messages', (req, res) => {
  const db = readDB();
  res.json(db.messages[req.params.id] || []);
});

// API: Listen for REALTIME messages (Server-Sent Events)
app.get('/api/trips/:id/messages/stream', (req, res) => {
  const { id } = req.params;
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  if (!chatClients[id]) chatClients[id] = [];
  chatClients[id].push(res);
  
  req.on('close', () => {
    chatClients[id] = chatClients[id].filter(client => client !== res);
  });
});

// API: Post message to a trip
app.post('/api/trips/:id/messages', (req, res) => {
  const { id } = req.params;
  const { author, content } = req.body;
  if (!author || !content) {
    return res.status(400).json({ error: 'Missing author or content' });
  }

  const db = readDB();
  if (!db.messages[id]) {
    db.messages[id] = [];
  }
  
  const newMessage = {
    id: Date.now().toString(),
    author,
    content,
    timestamp: new Date().toISOString()
  };
  
  db.messages[id].push(newMessage);
  writeDB(db);
  
  // Real-time broadcast to all connected clients
  if (chatClients[id]) {
    chatClients[id].forEach(client => {
      client.write(`data: ${JSON.stringify({ type: 'NEW_MESSAGE', data: newMessage })}\n\n`);
    });
  }
  
  res.json(newMessage);
});

// API: Delete message from a trip
app.delete('/api/trips/:id/messages/:msgId', (req, res) => {
  const { id, msgId } = req.params;
  const { author } = req.body;
  const db = readDB();
  
  if (!db.messages[id]) return res.status(404).json({ error: 'Trip not found' });
  
  const msgIndex = db.messages[id].findIndex(m => m.id === msgId);
  if (msgIndex === -1) return res.status(404).json({ error: 'Message not found' });
  
  const msg = db.messages[id][msgIndex];
  if (msg.author !== author) return res.status(403).json({ error: 'Unauthorized to delete this message' });
  
  db.messages[id].splice(msgIndex, 1);
  writeDB(db);
  
  // Broadcast deletion via SSE
  if (chatClients[id]) {
    chatClients[id].forEach(client => {
      client.write(`data: ${JSON.stringify({ type: 'DELETE_MESSAGE', messageId: msgId })}\n\n`);
    });
  }
  
  res.json({ success: true, messageId: msgId });
});

// API: Get photos for a trip
app.get('/api/trips/:id/photos', (req, res) => {
  const db = readDB();
  res.json(db.photos[req.params.id] || []);
});

// API: Upload MULTIPLE photos to a trip
app.post('/api/trips/:id/photos', upload.array('photos', 50), (req, res) => {
  const { id } = req.params;
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No photos provided' });
  }

  const { title, author } = req.body;
  const db = readDB();
  if (!db.photos[id]) {
    db.photos[id] = [];
  }
  
  const newPhotos = req.files.map((file, index) => ({
    id: Date.now().toString() + '-' + index,
    url: `/uploads/${file.filename}`,
    title: title || 'Ảnh kỉ niệm',
    author: author || 'Khách',
    likes: [],
    timestamp: new Date().toISOString()
  }));
  
  // Prepend new photos so they appear first
  db.photos[id] = [...newPhotos, ...db.photos[id]];
  writeDB(db);
  
  res.json(newPhotos);
});

// API: Delete photo
app.delete('/api/trips/:id/photos/:photoId', (req, res) => {
  const { id, photoId } = req.params;
  const { author } = req.body;
  const db = readDB();
  
  if (!db.photos[id]) return res.status(404).json({ error: 'Trip not found' });
  
  const photoIndex = db.photos[id].findIndex(p => p.id === photoId);
  if (photoIndex === -1) return res.status(404).json({ error: 'Photo not found' });
  
  const photo = db.photos[id][photoIndex];
  if (photo.author !== author) return res.status(403).json({ error: 'Unauthorized to delete this photo' });
  
  // Physically delete file
  const filePath = path.join(__dirname, photo.url.replace('/uploads/', 'uploads/'));
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (e) { console.error("Del err", e); }
  }
  
  db.photos[id].splice(photoIndex, 1);
  writeDB(db);
  
  res.json({ success: true, photoId });
});

// API: Toggle like on photo
app.post('/api/trips/:id/photos/:photoId/like', (req, res) => {
  const { id, photoId } = req.params;
  const { author } = req.body; // who is liking
  if (!author) return res.status(400).json({ error: 'Missing author' });

  const db = readDB();
  if (!db.photos[id]) return res.status(404).json({ error: 'Trip not found' });
  
  const photo = db.photos[id].find(p => p.id === photoId);
  if (!photo) return res.status(404).json({ error: 'Photo not found' });
  
  if (!photo.likes) photo.likes = [];
  
  const likeIndex = photo.likes.indexOf(author);
  if (likeIndex > -1) {
    photo.likes.splice(likeIndex, 1); // Unlike
  } else {
    photo.likes.push(author); // Like
  }
  
  writeDB(db);
  res.json(photo);
});

// --- PHỤC VỤ STATIC FRONTEND TRONG MÔI TRƯỜNG PRODUCTION ---
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log("Production mode: Phục vụ Frontend từ thư mục /dist");
  app.use(express.static(distPath));
  
  // Mọi request không trúng API sẽ được gửi về React index.html để xử lý Client-side Routing
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Local Backend chạy tại http://localhost:${PORT}`);
});
