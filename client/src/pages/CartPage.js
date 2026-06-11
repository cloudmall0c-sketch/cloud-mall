import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    if (quantity <= 0) {
      removeFromCart(index);
    } else {
      const updatedCart = [...cart];
      updatedCart[index].quantity = quantity;
      setCart(updatedCart);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = item.hasOffer
        ? item.price * (1 - item.offerPercentage / 100)
        : item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const handleCheckout = async () => {
    if (!shippingAddress) {
      alert('يرجى إدخال عنوان التوصيل');
      return;
    }

    if (cart.length === 0) {
      alert('السلة فارغة');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.hasOffer ? item.price * (1 - item.offerPercentage / 100) : item.price,
          quantity: item.quantity,
          size: item.selectedSize,
          color: item.selectedColor,
        })),
        totalAmount: calculateTotal(),
        shippingAddress,
        paymentMethod: 'credit_card',
        storeId: cart[0].storeId,
      };

      await axios.post('/api/orders', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('تم الطلب بنجاح! شكراً لك');
      setCart([]);
      navigate('/');
    } catch (err) {
      alert('حدث خطأ: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">سلتي 🛒</h1>

        {cart.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600 mb-4">السلة فارغة</p>
            <button
              onClick={() => navigate('/shops')}
              className="btn-primary"
            >
              العودة للتسوق
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.map((item, index) => {
                const price = item.hasOffer
                  ? item.price * (1 - item.offerPercentage / 100)
                  : item.price;
                return (
                  <div key={index} className="card mb-4 flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-2xl">
                      👕
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">الحجم: {item.selectedSize} | اللون: {item.selectedColor}</p>
                      <p className="text-blue-600 font-semibold">{price.toFixed(2)} ر.س</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-between">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                        className="w-12 px-2 py-1 border rounded text-center"
                      />
                      <button
                        onClick={() => removeFromCart(index)}
                        className="btn-secondary py-1 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Checkout */}
            <div>
              <div className="card sticky top-24">
                <h3 className="text-2xl font-bold mb-4">الملخص</h3>
                <div className="space-y-2 mb-6 pb-6 border-b">
                  <div className="flex justify-between">
                    <span>الإجمالي:</span>
                    <span className="font-bold text-lg text-blue-600">{calculateTotal().toFixed(2)} ر.س</span>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="عنوان التوصيل"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:border-blue-600"
                />

                <button
                  onClick={handleCheckout}
                  disabled={loading || cart.length === 0}
                  className="w-full btn-primary py-3 font-bold disabled:opacity-50"
                >
                  {loading ? 'جاري المعالجة...' : 'إتمام الشراء'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
