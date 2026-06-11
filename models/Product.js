const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Accessories'],
    required: true,
  },
  sizes: [String], // ['S', 'M', 'L', 'XL', 'XXL']
  colors: [String],
  images: [String],
  
  // Store Reference
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  
  // Stock Management
  stock: {
    type: Number,
    default: 0,
  },
  
  // Offer/Discount
  hasOffer: {
    type: Boolean,
    default: false,
  },
  offerPercentage: {
    type: Number,
    min: 0,
    max: 100,
  },
  offerStartDate: Date,
  offerEndDate: Date,
  
  // Additional Info
  material: String,
  brand: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate final price
productSchema.methods.getFinalPrice = function() {
  if (this.hasOffer && this.offerPercentage) {
    return this.price * (1 - this.offerPercentage / 100);
  }
  return this.price;
};

module.exports = mongoose.model('Product', productSchema);
