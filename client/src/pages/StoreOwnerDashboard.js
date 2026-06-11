import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StoreOwnerDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    sizes: 'S,M,L,XL',
    colors: 'أسود,أبيض',
    stock: '',
  });

  const token = localStorage.getItem('token');
  const storeId = localStorage.getItem('storeId');

  useEffect(() => {
    if (storeId) {
      fetchData();
    }
  }, [storeId]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, statsRes] = await Promise.all([
        axios.get(`/api/products?storeId=${storeId}`),
        axios.get(`/api/orders/store/${storeId}`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`/api/stores/stats/${storeId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/products', {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sizes: formData.sizes.split(',').map(s => s.trim()),
        colors: formData.colors.split(',').map(c => c.trim()),
      }, { headers: { Authorization: `Bearer ${token}` } });

      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Men',
        sizes: 'S,M,L,XL',
        colors: 'أسود,أبيض',
        stock: '',
      });
      setShowProductForm(false);
      fetchData();
    } catch (err) {
      console.error('Error adding product', err);
    }
  };

  const handleAddOffer = async (productId) => {
    const percentage = prompt('أدخل نسبة الخصم (%):');
    if (percentage) {
      try {
        await axios.post(`/api/products/${productId}/offer`, {
          offerPercentage: parseInt(percentage),
          offerStartDate: new Date(),
          offerEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }, { headers: { Authorization: `Bearer ${token}` } });
        fetchData();
      } catch (err) {
        console.error('Error adding offer', err);
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (err) {
      console.error('Error updating order', err);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">لوحة تحكم المتجر</h1>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <p className="text-gray-600">إجمالي المبيعات</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalProductsSold}</p>
            </div>
            <div className="card">
              <p className="text-gray-600">الإيرادات</p>
              <p className="text-3xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} ر.س</p>
            </div>
            <div className="card">
              <p className="text-gray-600">التقييم</p>
              <p className="text-3xl font-bold text-yellow-600">⭐ {stats.rating}/5</p>
            </div>
            <div className="card">
              <p className="text-gray-600">ظهور المتجر</p>
              <p className="text-3xl font-bold text-purple-600">{stats.visibilityPercentage}%</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'products' ? 'border-blue-600 text-blue-600' : 'border-transparent'
            }`}
          >
            المنتجات
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-blue-600 text-blue-600' : 'border-transparent'
            }`}
          >
            الطلبات
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <button
              onClick={() => setShowProductForm(!showProductForm)}
              className="btn-primary mb-6"
            >
              {showProductForm ? 'إلغاء' : '+ إضافة منتج جديد'}
            </button>

            {showProductForm && (
              <form onSubmit={handleAddProduct} className="card mb-8">
                <input
                  type="text"
                  placeholder="اسم المنتج"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none"
                  required
                />
                <textarea
                  placeholder="الوصف"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none"
                  rows="3"
                />
                <input
                  type="number"
                  placeholder="السعر"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none"
                  required
                />
                <input
                  type="number"
                  placeholder="الكمية"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none"
                  required
                />
                <button type="submit" className="btn-primary w-full">إضافة المنتج</button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="card">
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                  <p className="text-blue-600 font-semibold mb-2">{product.price} ر.س</p>
                  <p className="text-gray-600 text-sm mb-4">المتاح: {product.stock}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddOffer(product._id)}
                      className="flex-1 btn-secondary py-1 text-sm"
                    >
                      عرض
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <p className="text-center text-gray-600 py-8">لا توجد طلبات</p>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">طلب #{order.orderNumber}</h3>
                        <p className="text-gray-600 text-sm">{new Date(order.createdAt).toLocaleDateString('ar-EG')}</p>
                      </div>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="px-3 py-1 border rounded focus:outline-none"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="shipped">مشحون</option>
                        <option value="delivered">تم التسليم</option>
                      </select>
                    </div>
                    <p className="text-lg font-bold text-blue-600">{order.totalAmount} ر.س</p>
                    <p className="text-sm text-gray-600">العنوان: {order.shippingAddress}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
