import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetailsPage = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0]);
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product', err);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('يرجى اختيار الحجم واللون');
      return;
    }
    onAddToCart({
      ...product,
      quantity,
      selectedSize,
      selectedColor,
    });
    alert('تم إضافة المنتج إلى السلة');
    navigate('/cart');
  };

  if (loading) {
    return <div className="py-12 text-center">جاري التحميل...</div>;
  }

  if (!product) {
    return <div className="py-12 text-center">المنتج غير موجود</div>;
  }

  const finalPrice = product.hasOffer
    ? (product.price * (1 - product.offerPercentage / 100))
    : product.price;

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="card flex items-center justify-center">
            <div className="text-9xl">👕</div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            {/* Price */}
            <div className="mb-6">
              {product.hasOffer ? (
                <>
                  <p className="text-3xl font-bold text-red-600">{finalPrice.toFixed(2)} ر.س</p>
                  <p className="text-lg text-gray-400 line-through">{product.price} ر.س</p>
                  <p className="text-lg text-orange-600 font-semibold">وفّر {product.offerPercentage}%</p>
                </>
              ) : (
                <p className="text-3xl font-bold text-blue-600">{product.price} ر.س</p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">{product.description}</p>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="mb-6">
                <label className="block font-semibold mb-2">اختر الحجم:</label>
                <div className="flex gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded border-2 ${
                        selectedSize === size
                          ? 'border-blue-600 bg-blue-100'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <label className="block font-semibold mb-2">اختر اللون:</label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded border-2 ${
                        selectedColor === color
                          ? 'border-blue-600 bg-blue-100'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">الكمية:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="px-4 py-2 border rounded-lg w-20 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Stock Info */}
            <p className={`mb-6 font-semibold ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              المتاح: {product.stock} قطعة
            </p>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full btn-primary py-3 text-lg font-bold disabled:opacity-50"
            >
              إضافة إلى السلة 🛒
            </button>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t">
              <p><strong>الماركة:</strong> {product.brand}</p>
              <p><strong>المادة:</strong> {product.material}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
