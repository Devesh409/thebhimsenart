import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'inquiries_db.json');

interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  brand?: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

function ensureLocalDb(): InquiryRecord[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading local inquiries database:', err);
    return [];
  }
}

function saveLocalDb(records: InquiryRecord[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local inquiries database:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '5mb' }));

  // Local Database API: Get all customer inquiries for Admin
  app.get('/api/inquiries', (_req, res) => {
    const records = ensureLocalDb();
    res.json({ inquiries: records });
  });

  // Local Database API: Store a new customer inquiry
  app.post('/api/inquiries', (req, res) => {
    const { name, email, brand, subject, message } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newInquiry: InquiryRecord = {
      id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: String(name).trim().slice(0, 120),
      email: String(email).trim().slice(0, 200),
      brand: String(brand || '').trim().slice(0, 150),
      subject: String(subject || 'Artwork Acquisition / Brand Collaboration').trim().slice(0, 200),
      message: String(message).trim().slice(0, 4000),
      createdAt: new Date().toISOString(),
      read: false
    };

    const records = ensureLocalDb();
    const updated = [newInquiry, ...records];
    saveLocalDb(updated);

    res.status(201).json({ inquiry: newInquiry });
  });

  // Local Database API: Mark inquiry as read
  app.patch('/api/inquiries/:id/read', (req, res) => {
    const { id } = req.params;
    const records = ensureLocalDb();
    const updated = records.map(item => (item.id === id ? { ...item, read: true } : item));
    saveLocalDb(updated);
    res.json({ ok: true });
  });

  // Local Database API: Delete an inquiry
  app.delete('/api/inquiries/:id', (req, res) => {
    const { id } = req.params;
    const records = ensureLocalDb();
    const updated = records.filter(item => item.id !== id);
    saveLocalDb(updated);
    res.json({ ok: true });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
