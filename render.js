import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for all origins in production
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, 'client')));

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock authentication endpoints
app.post('/api/auth/login', (req, res) => {
  const { instagramUsername, password } = req.body;
  if (!instagramUsername || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const mockUser = {
    id: Math.floor(Math.random() * 10000),
    uid: "UID" + Math.random().toString(36).substr(2, 9).toUpperCase(),
    instagramUsername,
    walletBalance: "10.00",
    bonusClaimed: false
  };

  res.json({ success: true, user: mockUser });
});

// Catch-all handler to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Use PORT environment variable provided by Render, fallback to 5000
const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 for Render deployment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
});
