const express = require('express');
const Product = require('../models/Product');
const { verifyStore } = require('../middleware/auth');

const router = express.Router();

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const { category, storeId, search } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (storeId) filter.storeId = storeId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    
    const products = await Product.find(filter).populate('storeId', 'name logo');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('storeId');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
});

// Create product (store owner)
router.post('/', verifyStore, async (req, res) => {
  try {
    const { name, description, price, category, sizes, colors, stock, material, brand } = req.body;
    
    const product = new Product({
      name,
      description,
      price,
      category,
      sizes,
      colors,
      stock,
      material,
      brand,
      storeId: req.store.id,
    });
    
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
});

// Update product (store owner)
router.put('/:id', verifyStore, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.storeId.toString() !== req.store.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    const { name, description, price, stock, sizes, colors } = req.body;
    
    Object.assign(product, { name, description, price, stock, sizes, colors, updatedAt: Date.now() });
    await product.save();
    
    res.json({ message: 'Product updated successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

// Add/Update offer on product
router.post('/:id/offer', verifyStore, async (req, res) => {
  try {
    const { offerPercentage, offerStartDate, offerEndDate } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.storeId.toString() !== req.store.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    product.hasOffer = true;
    product.offerPercentage = offerPercentage;
    product.offerStartDate = offerStartDate;
    product.offerEndDate = offerEndDate;
    
    await product.save();
    
    const finalPrice = product.getFinalPrice();
    
    res.json({ 
      message: 'Offer added successfully', 
      product,
      finalPrice 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error adding offer', error: err.message });
  }
});

// Remove offer from product
router.post('/:id/remove-offer', verifyStore, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.storeId.toString() !== req.store.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    product.hasOffer = false;
    product.offerPercentage = 0;
    product.offerStartDate = null;
    product.offerEndDate = null;
    
    await product.save();
    
    res.json({ message: 'Offer removed successfully', product });
  } catch (err) {
    res.status(500).json({ message: 'Error removing offer', error: err.message });
  }
});

// Delete product (store owner)
router.delete('/:id', verifyStore, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (product.storeId.toString() !== req.store.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
});

module.exports = router;
