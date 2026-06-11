const express = require('express');
const Order = require('../models/Order');
const { verifyToken, verifyStore } = require('../middleware/auth');

const router = express.Router();

// Create order (customer)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { storeId, items, totalAmount, shippingAddress, paymentMethod } = req.body;
    
    const order = new Order({
      customerId: req.user.id,
      storeId,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });
    
    await order.save();
    
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});

// Get customer orders
router.get('/customer', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).populate('storeId', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// Get store orders
router.get('/store/:storeId', verifyStore, async (req, res) => {
  try {
    if (req.store.id !== req.params.storeId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const orders = await Order.find({ storeId: req.params.storeId }).populate('customerId', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
});

// Update order status (store owner)
router.put('/:orderId/status', verifyStore, async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.storeId.toString() !== req.store.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    
    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
});

module.exports = router;
