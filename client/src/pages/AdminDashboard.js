import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stores, setStores] = useState([]);
  const [overview, setOverview] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeAnalytics, setStoreAnalytics] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [storesRes, overviewRes] = await Promise.all([
        axios.get('/api/admin/stores', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/admin/analytics/overview', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setStores(storesRes.data);
      setOverview(overviewRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    }
  };

  const handleViewAnalytics = async (storeId) => {
    try {
      const response = await axios.get(`/api/admin/stores/${storeId}/analytics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedStore(storeId);
      setStoreAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics', err);
    }
  };

  const handleUpdateVisibility = async (storeId) => {
    const percentage = prompt('أدخل نسبة الظهور (%):');
    if (percentage) {
      try {
        await axios.put(
          `/api/admin/stores/${storeId}/visibility`,
          { visibilityPercentage: parseInt(percentage) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchData();
      } catch (err) {
        console.error('Error updating visibility', err);
      }
    }
  };

  const handleToggleActive = async (storeId, isActive) => {
    try {
      await axios.put(
        `/api/admin/stores/${storeId}/status`,
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchData();
    } catch (err) {
      console.error('Error toggling store status', err);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">لوحة تحكم المسؤول</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent'
            }`}
          >
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              activeTab === 'stores' ? 'border-blue-600 text-blue-600' : 'border-transparent'
            }`}
          >
            المتاجر
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && overview && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="card">
                <p className="text-gray-600">إجمالي المتاجر</p>
                <p className="text-3xl font-bold text-blue-600">{overview.totalStores}</p>
              </div>
              <div className="card">
                <p className="text-gray-600">المتاجر النشطة</p>
                <p className="text-3xl font-bold text-green-600">{overview.activeStores}</p>
              </div>
              <div className="card">
                <p className="text-gray-600">إجمالي الطلبات</p>
                <p className="text-3xl font-bold text-purple-600">{overview.totalOrders}</p>
              </div>
              <div className="card">
                <p className="text-gray-600">الإيرادات</p>
                <p className="text-3xl font-bold text-yellow-600">{overview.totalRevenue.toFixed(2)} ر.س</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card">
                <p className="text-gray-600">المنتجات المباعة</p>
                <p className="text-3xl font-bold">{overview.totalProductsSold}</p>
              </div>
              <div className="card">
                <p className="text-gray-600">إجمالي المنتجات</p>
                <p className="text-3xl font-bold">{overview.totalProducts}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stores Tab */}
        {activeTab === 'stores' && (
          <div>
            {storeAnalytics && selectedStore ? (
              <div>
                <button
                  onClick={() => setStoreAnalytics(null)}
                  className="btn-secondary mb-6"
                >
                  ← العودة
                </button>
                <div className="card">
                  <h2 className="text-2xl font-bold mb-6">{storeAnalytics.storeName}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div>
                      <p className="text-gray-600 mb-1">المنتجات</p>
                      <p className="text-3xl font-bold text-blue-600">{storeAnalytics.totalProducts}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">الطلبات المكتملة</p>
                      <p className="text-3xl font-bold text-green-600">{storeAnalytics.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">الإيرادات</p>
                      <p className="text-3xl font-bold text-yellow-600">{storeAnalytics.totalRevenue.toFixed(2)} ر.س</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {stores.map(store => (
                  <div key={store._id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{store.name}</h3>
                        <p className="text-gray-600 text-sm">{store.email}</p>
                        <p className="text-sm mt-2">
                          الحالة: <span className={store.isActive ? 'text-green-600' : 'text-red-600'}>
                            {store.isActive ? '✓ نشط' : '✗ معطل'}
                          </span>
                        </p>
                        <p className="text-sm">ظهور: {store.visibilityPercentage}%</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleViewAnalytics(store._id)}
                          className="btn-primary py-1 px-3 text-sm"
                        >
                          📊 تحليلات
                        </button>
                        <button
                          onClick={() => handleUpdateVisibility(store._id)}
                          className="btn-secondary py-1 px-3 text-sm"
                        >
                          📈 تحديث الظهور
                        </button>
                        <button
                          onClick={() => handleToggleActive(store._id, store.isActive)}
                          className={`py-1 px-3 text-sm rounded text-white ${
                            store.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {store.isActive ? 'تعطيل' : 'تفعيل'}
                        </button>
                      </div>
                    </div>
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

export default AdminDashboard;
