
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 10000;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://instaboost_user:uX1YzKjiOETNhyYj@cluster0.tolxjiz.mongodb.net/instaboost?retryWrites=true&w=majority&appName=Cluster0';

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || process.env.JWT_SECRET || 'YJ!*NpP1@l|R5Iy)rG<y"-XyDf}#xn',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Serve static files from dist/public
app.use(express.static(path.join(__dirname, 'dist/public')));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Service Schema
const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  rate: { type: Number, required: true },
  minOrder: { type: Number, required: true },
  maxOrder: { type: Number, required: true },
  deliveryTime: { type: String, required: true },
  active: { type: Boolean, default: true }
});

const Service = mongoose.model('Service', serviceSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  link: { type: String, required: true },
  quantity: { type: Number, required: true },
  charge: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// Initialize services
async function initializeServices() {
  try {
    const existingServices = await Service.countDocuments();
    if (existingServices === 0) {
      const services = [
        { name: "Indian Followers", category: "Followers", rate: 6, minOrder: 100, maxOrder: 100000, deliveryTime: "0-1 Hours" },
        { name: "USA Followers", category: "Followers", rate: 7, minOrder: 100, maxOrder: 50000, deliveryTime: "0-2 Hours" },
        { name: "HQ Non Drop Followers", category: "Followers", rate: 11, minOrder: 100, maxOrder: 25000, deliveryTime: "1-6 Hours" },
        { name: "Bot Likes", category: "Likes", rate: 2, minOrder: 100, maxOrder: 100000, deliveryTime: "0-30 Minutes" },
        { name: "Girl Account Likes", category: "Likes", rate: 6, minOrder: 100, maxOrder: 50000, deliveryTime: "0-2 Hours" },
        { name: "HQ Likes", category: "Likes", rate: 4, minOrder: 100, maxOrder: 75000, deliveryTime: "0-1 Hours" },
        { name: "Real Views", category: "Views", rate: 1, minOrder: 1000, maxOrder: 1000000, deliveryTime: "0-30 Minutes" },
        { name: "HQ Views", category: "Views", rate: 3, minOrder: 1000, maxOrder: 500000, deliveryTime: "0-1 Hours" },
        { name: "Story Views", category: "Views", rate: 5, minOrder: 100, maxOrder: 10000, deliveryTime: "0-30 Minutes" },
        { name: "Auto Comments", category: "Comments", rate: 15, minOrder: 10, maxOrder: 1000, deliveryTime: "0-2 Hours" },
        { name: "Custom Comments", category: "Comments", rate: 25, minOrder: 5, maxOrder: 500, deliveryTime: "1-6 Hours" },
        { name: "Auto Shares", category: "Shares", rate: 8, minOrder: 50, maxOrder: 5000, deliveryTime: "0-1 Hours" },
        { name: "Story Shares", category: "Shares", rate: 12, minOrder: 25, maxOrder: 2500, deliveryTime: "0-2 Hours" },
        { name: "Saves", category: "Saves", rate: 10, minOrder: 50, maxOrder: 10000, deliveryTime: "0-1 Hours" }
      ];
      
      await Service.insertMany(services);
      console.log('✅ Services initialized successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing services:', error);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/services', async (req, res) => {
  try {
    const services = await Service.find({ active: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = new User({ username, email, password });
    await user.save();
    
    req.session.userId = user._id;
    res.json({ message: 'Registration successful', user: { id: user._id, username, email, balance: user.balance } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    req.session.userId = user._id;
    res.json({ message: 'Login successful', user: { id: user._id, username: user.username, email: user.email, balance: user.balance } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/user', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: { id: user._id, username: user.username, email: user.email, balance: user.balance } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
});

app.post('/api/orders', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const { serviceId, link, quantity } = req.body;
    
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    
    const charge = (quantity * service.rate) / 1000;
    
    const user = await User.findById(req.session.userId);
    if (user.balance < charge) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    
    const order = new Order({
      userId: req.session.userId,
      serviceId,
      link,
      quantity,
      charge
    });
    
    await order.save();
    
    // Deduct balance
    user.balance -= charge;
    await user.save();
    
    res.json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to place order' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const orders = await Order.find({ userId: req.session.userId })
      .populate('serviceId', 'name category')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Catch all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/public/index.html'));
});

// Start server
async function startServer() {
  try {
    await connectMongoDB();
    await initializeServices();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on 0.0.0.0:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
