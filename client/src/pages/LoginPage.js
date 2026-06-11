import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customer');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let endpoint = '';
      let payload = {};

      if (activeTab === 'customer') {
        endpoint = isLogin ? '/api/auth/customer/login' : '/api/auth/customer/register';
        payload = isLogin 
          ? { email: formData.email, password: formData.password }
          : { name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword };
      } else if (activeTab === 'store') {
        endpoint = isLogin ? '/api/auth/store/login' : '/api/auth/store/register';
        payload = isLogin
          ? { email: formData.email, password: formData.password }
          : { name: formData.name, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword, phone: formData.phone, address: formData.address };
      } else if (activeTab === 'admin') {
        endpoint = '/api/auth/admin/login';
        payload = { email: formData.email, password: formData.password };
      }

      const response = await axios.post(endpoint, payload);
      localStorage.setItem('token', response.data.token);
      const userData = { email: formData.email, role: activeTab };
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      navigate(activeTab === 'admin' ? '/admin' : activeTab === 'store' ? '/store-owner' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في العملية');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto max-w-md">
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'customer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
              }`}
            >
              عميل
            </button>
            <button
              onClick={() => setActiveTab('store')}
              className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'store' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
              }`}
            >
              متجر
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2 font-semibold border-b-2 transition-colors ${
                activeTab === 'admin' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600'
              }`}
            >
              مسؤول
            </button>
          </div>

          {/* Admin Login Info */}
          {activeTab === 'admin' && isLogin && (
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 text-sm">
              <p><strong>البريد:</strong> 000@gmail.com</p>
              <p><strong>كلمة المرور:</strong> 000</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && activeTab !== 'admin' && (
              <input
                type="text"
                name="name"
                placeholder="الاسم الكامل"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
              required
            />

            {!isLogin && (
              <>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="تأكيد كلمة المرور"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                  required
                />
                {activeTab === 'store' && (
                  <>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="رقم الهاتف"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                    />
                    <input
                      type="text"
                      name="address"
                      placeholder="العنوان"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600"
                    />
                  </>
                )}
              </>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'جاري...' : isLogin ? 'دخول' : 'إنشاء حساب'}
            </button>
          </form>

          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full mt-4 text-blue-600 font-semibold"
          >
            {isLogin ? 'ليس لديك حساب؟ إنشاء واحد' : 'لديك حساب؟ دخول'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
