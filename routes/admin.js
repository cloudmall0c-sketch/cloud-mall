const express = require('express');
const Store = require('../models/Store');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { verifyAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all stores with analytics
router.get('/stores', verifyAdmin, async (req, res) => {
  try {
    const stores = await Store.find().select('-password');
    
    const storesWithAnalytics = await Promise.all(
      stores.map(async (store) => {
        const orders = await Order.find({ storeId: store._id });
        const products = await Product.find({ storeId: store._id });
        
        return {
          ...store.toObject(),
          totalOrders: orders.length,
          totalProducts: products.length,
        };
      })
    );
    
    res.json(storesWithAnalytics);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stores', error: err.message });
  }
});

// Update store visibility percentage
router.put('/stores/:storeId/visibility', verifyAdmin, async (req, res) => {
  try {
    const { visibilityPercentage } = req.body;
    
    if (visibilityPercentage < 0 || visibilityPercentage > 100) {
      return res.status(400).json({ message: 'Visibility must be between 0 and 100' });
    }
    
    const store = await Store.findByIdAndUpdate(
      req.params.storeId,
      { visibilityPercentage },
      { new: true }
    ).select('-password');
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({ message: 'Store visibility updated', store });
  } catch (err) {
    res.status(500).json({ message: 'Error updating visibility', error: err.message });
  }
});

// Activate/Deactivate store
router.put('/stores/:storeId/status', verifyAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const store = await Store.findByIdAndUpdate(
      req.params.storeId,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    res.json({ message: 'Store status updated', store });
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
});

// Get store analytics
router.get('/stores/:storeId/analytics', verifyAdmin, async (req, res) => {
  try {
    const store = await Store.findById(req.params.storeId);
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }
    
    const orders = await Order.find({ storeId: req.params.storeId });
    const products = await Product.find({ storeId: req.params.storeId });
    
    const completedOrders = orders.filter(o => o.status === 'delivered');
    
    let totalSalesCount = 0;
    let totalRevenue = 0;
    
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        totalSalesCount += item.quantity;
        totalRevenue += item.price * item.quantity;
      });
    });
    
    res.json({
      storeName: store.name,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalSalesCount,
      totalRevenue,
      visibilityPercentage: store.visibilityPercentage,
      isActive: store.isActive,
      rating: store.rating,
      reviewCount: store.reviewCount,
      orders: orders.map(o => ({
        orderNumber: o.orderNumber,
        status: o.status,
        totalAmount: o.totalAmount,
        createdAt: o.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics', error: err.message });
  }
});

// Get platform overview analytics
router.get('/analytics/overview', verifyAdmin, async (req, res) => {
  try {
    const stores = await Store.find();
    const orders = await Order.find();
    const products = await Product.find();
    
    let totalRevenue = 0;
    let totalProductsSold = 0;
    
    orders.forEach(order => {
      if (order.status === 'delivered') {
        order.items.forEach(item => {
          totalRevenue += item.price * item.quantity;
          totalProductsSold += item.quantity;
        });
      }
    });
    
    res.json({
      totalStores: stores.length,
      activeStores: stores.filter(s => s.isActive).length,
      totalOrders: orders.length,
      completedOrders: orders.filter(o => o.status === 'delivered').length,
      totalProducts: products.length,
      totalRevenue,
      totalProductsSold,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching overview', error: err.message });
  }
});

module.exports = router;
