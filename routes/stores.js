const express = require('express');
const Store = require('../models/Store');
const { verifyStore } = require('../middleware/auth');

const router = express.Router();

// Get all stores (public)
router.get('/', async (req, res) => {
  try {
    const stores = await Store.find({ isActive: true }).select('-password');
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stores', error: err.message });
  }
});

// Get store by ID
router.get('/:id', async (req, res) => {
  try {
    const store = await Store.findById(req.params.id).select('-password');
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching store', error: err.message });
  }
});

// Get store dashboard (store owner)
router.get('/dashboard/:storeId', verifyStore, async (req, res) => {
  try {
    if (req.store.id !== req.params.storeId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json(store);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching dashboard', error: err.message });
  }
});

// Update store profile
router.put('/:id', verifyStore, async (req, res) => {
  try {
    if (req.store.id !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const { description, phone, address } = req.body;
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { description, phone, address, updatedAt: Date.now() },
      { new: true }
    ).select('-password');
    
    res.json({ message: 'Store updated successfully', store });
  } catch (err) {
    res.status(500).json({ message: 'Error updating store', error: err.message });
  }
});

// Get store statistics
router.get('/stats/:storeId', verifyStore, async (req, res) => {
  try {
    if (req.store.id !== req.params.storeId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({
      totalSales: store.totalSales,
      totalProductsSold: store.totalProductsSold,
      totalRevenue: store.totalRevenue,
      rating: store.rating,
      reviewCount: store.reviewCount,
      visibilityPercentage: store.visibilityPercentage,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching statistics', error: err.message });
  }
});

module.exports = router;
