const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Store = require('../models/Store');

const router = express.Router();

// Customer Registration
router.post('/customer/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    const user = new User({ name, email, password });
    await user.save();
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      message: 'Customer registered successfully', 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
});

// Customer Login
router.post('/customer/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Store Registration
router.post('/store/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, address } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }
    
    const existingStore = await Store.findOne({ email });
    if (existingStore) {
      return res.status(400).json({ message: 'Store email already registered' });
    }
    
    const store = new Store({ name, email, password, phone, address });
    await store.save();
    
    const token = jwt.sign(
      { id: store._id, email: store.email, name: store.name, role: 'store' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      message: 'Store registered successfully', 
      token,
      store: { id: store._id, name: store.name, email: store.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err.message });
  }
});

// Store Login
router.post('/store/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }
    
    const store = await Store.findOne({ email });
    if (!store) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isPasswordValid = await store.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: store._id, email: store.email, name: store.name, role: 'store' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      message: 'Login successful', 
      token,
      store: { id: store._id, name: store.name, email: store.email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

// Admin Login (Special)
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }
    
    const token = jwt.sign(
      { email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      message: 'Admin login successful', 
      token,
      admin: { email }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
});

module.exports = router;
