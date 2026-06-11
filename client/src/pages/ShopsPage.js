import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
    fetchProducts();
  }, []);

  const fetchShops = async () => {
    try {
      const response = await axios.get('/api/stores');
      setShops(response.data);
    } catch (err) {
      console.error('Error fetching shops', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products', err);
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesShop = !selectedShop || product.storeId === selectedShop;
    return matchesSearch && matchesShop;
  });

  return (
    <div className="py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8">جميع المتاجر والملابس</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="ابحث عن ملابس..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Shops Sidebar */}
          <div>
            <h3 className="text-xl font-bold mb-4">المتاجر</h3>
            <div className="card">
              <button
                onClick={() => setSelectedShop(null)}
                className={`block w-full text-right py-2 px-3 rounded mb-2 ${
                  selectedShop === null ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                جميع المتاجر
              </button>
              {shops.map(shop => (
                <button
                  key={shop._id}
                  onClick={() => setSelectedShop(shop._id)}
                  className={`block w-full text-right py-2 px-3 rounded mb-2 ${
                    selectedShop === shop._id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  {shop.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <p className="text-center py-8">جاري التحميل...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="card group"
                  >
                    <div className="bg-gray-200 h-40 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                      <span className="text-4xl">👕</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">المقاس: {product.sizes?.join(', ')}</p>
                    {product.hasOffer ? (
                      <div>
                        <p className="text-red-600 font-bold text-lg">
                          {(product.price * (1 - product.offerPercentage / 100)).toFixed(2)} ر.س
                        </p>
                        <p className="text-gray-400 line-through text-sm">{product.price} ر.س</p>
                        <p className="text-orange-600 font-semibold text-sm">خصم {product.offerPercentage}%</p>
                      </div>
                    ) : (
                      <p className="text-lg font-bold text-blue-600">{product.price} ر.س</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopsPage;
