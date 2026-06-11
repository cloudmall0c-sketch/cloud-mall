import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">🛍️ مرحباً بك في Cloud Mall</h1>
          <p className="text-xl mb-8">أكبر منصة لبيع الملابس من أفضل المتاجر</p>
          <Link 
            to="/shops" 
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            🛒 Shop Now - ابدأ التسوق الآن
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">لماذا اختيار Cloud Mall؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold mb-2">أفضل الأسعار</h3>
              <p>عروضات حصرية وخصومات يومية على أحدث الملابس</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-2">توصيل سريع</h3>
              <p>تسليم في الوقت المحدد مع خدمة عملاء متميزة</p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-2">آمان وضمان</h3>
              <p>عمليات دفع آمنة وضمان على جودة المنتجات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="py-16 bg-gray-100">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">500+</div>
              <p className="mt-2">متجر معتمد</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <p className="mt-2">منتج فريد</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">100K+</div>
              <p className="mt-2">عميل راضي</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">24/7</div>
              <p className="mt-2">خدمة عملاء</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
