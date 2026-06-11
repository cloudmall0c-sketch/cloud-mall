import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, setUser, cartCount }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">🛍️ Cloud Mall</Link>
        
        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-600">الرئيسية</Link>
          <Link to="/shops" className="hover:text-blue-600">المتا��ر</Link>
          
          {!user ? (
            <Link to="/login" className="btn-primary">دخول</Link>
          ) : (
            <>
              {user.role === 'customer' && (
                <>
                  <Link to="/cart" className="relative hover:text-blue-600">
                    🛒 السلة ({cartCount})
                  </Link>
                </>
              )}
              {user.role === 'store' && (
                <Link to="/store-owner" className="btn-primary">لوحة المتجر</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="btn-primary">لوحة التحكم</Link>
              )}
              <button onClick={handleLogout} className="btn-secondary">خروج</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
