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

// Serve static files from the dist directory (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mock authentication endpoints for production
app.post('/api/auth/login', (req, res) => {
  try {
    const { instagramUsername, password } = req.body;
    
    if (!instagramUsername || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    // Mock user creation for production demo
    const mockUser = {
      id: Math.floor(Math.random() * 10000),
      uid: "UID" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      instagramUsername,
      walletBalance: "10.00",
      bonusClaimed: false
    };

    res.json({
      success: true,
      user: mockUser
    });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

app.get('/api/auth/user', (req, res) => {
  // For production demo, return mock unauthorized
  res.status(401).json({ error: 'Not authenticated' });
});

// API routes
app.get('/api/services', (req, res) => {
  const services = [
    { id: 1, name: 'Indian Followers', category: 'Followers', rate: 6, minOrder: 100, maxOrder: 10000, deliveryTime: '0-6 Hours', active: true },
    { id: 2, name: 'USA Followers', category: 'Followers', rate: 7, minOrder: 100, maxOrder: 10000, deliveryTime: '0-6 Hours', active: true },
    { id: 3, name: 'HQ Non Drop Followers', category: 'Followers', rate: 11, minOrder: 100, maxOrder: 10000, deliveryTime: '0-12 Hours', active: true },
    { id: 4, name: 'Bot Likes', category: 'Likes', rate: 2, minOrder: 100, maxOrder: 50000, deliveryTime: '0-1 Hour', active: true },
    { id: 5, name: 'Girl Account Likes', category: 'Likes', rate: 6, minOrder: 100, maxOrder: 10000, deliveryTime: '0-6 Hours', active: true },
    { id: 6, name: 'Mixed HQ Likes', category: 'Likes', rate: 5, minOrder: 100, maxOrder: 10000, deliveryTime: '0-3 Hours', active: true },
    { id: 7, name: 'Random Comments', category: 'Comments', rate: 8, minOrder: 10, maxOrder: 1000, deliveryTime: '0-6 Hours', active: true },
    { id: 8, name: 'Custom Comments', category: 'Comments', rate: 12, minOrder: 10, maxOrder: 500, deliveryTime: '0-12 Hours', active: true },
    { id: 9, name: 'Story Views', category: 'Views', rate: 3, minOrder: 100, maxOrder: 50000, deliveryTime: '0-2 Hours', active: true },
    { id: 10, name: 'Reel Views', category: 'Views', rate: 4, minOrder: 100, maxOrder: 100000, deliveryTime: '0-3 Hours', active: true },
    { id: 11, name: 'Video Views', category: 'Views', rate: 4, minOrder: 100, maxOrder: 100000, deliveryTime: '0-3 Hours', active: true },
    { id: 12, name: 'Profile Visits', category: 'Other', rate: 5, minOrder: 100, maxOrder: 10000, deliveryTime: '0-6 Hours', active: true },
    { id: 13, name: 'Saves', category: 'Other', rate: 6, minOrder: 50, maxOrder: 5000, deliveryTime: '0-6 Hours', active: true },
    { id: 14, name: 'Shares', category: 'Other', rate: 7, minOrder: 50, maxOrder: 5000, deliveryTime: '0-6 Hours', active: true }
  ];
  res.json(services);
});

// Mock bonus claim endpoint
app.post('/api/bonus/claim', (req, res) => {
  res.json({ 
    success: true, 
    newBalance: "20.00",
    message: "₹10 bonus claimed successfully!" 
  });
});

// Mock orders endpoints
app.post('/api/orders', (req, res) => {
  res.json({ 
    success: true, 
    order: {
      id: Math.floor(Math.random() * 10000),
      orderId: "ORDER" + Date.now(),
      serviceName: req.body.serviceName,
      quantity: req.body.quantity,
      price: req.body.price,
      status: "Processing"
    }
  });
});

app.get('/api/orders', (req, res) => {
  res.json([]);
});

// Mock payments endpoints
app.post('/api/payments', (req, res) => {
  res.json({ 
    success: true, 
    payment: {
      id: Math.floor(Math.random() * 10000),
      amount: req.body.amount,
      utrNumber: req.body.utrNumber,
      paymentMethod: req.body.paymentMethod,
      status: "Pending"
    }
  });
});

app.get('/api/payments', (req, res) => {
  res.json([]);
});

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Use PORT environment variable provided by Render, fallback to 10000
const PORT = process.env.PORT || 10000;

// Bind to 0.0.0.0 for Render deployment
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`✅ Server successfully bound to port ${PORT}`);
});
