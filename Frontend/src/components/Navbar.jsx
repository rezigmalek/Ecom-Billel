import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Package, Search, Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isHome ? 'glass' : 'bg-white shadow-sm border-b border-slate-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <Package size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Ecom<span className="text-indigo-600">Billel</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Accueil</Link>
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Produits</Link>
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Catégories</Link>
            <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Contact</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-5">
            <button className="text-slate-500 hover:text-indigo-600 transition-colors hidden sm:block">
              <Search size={22} />
            </button>
            <Link to="/cart" className="relative p-2 text-slate-500 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="md:hidden text-slate-500 hover:text-indigo-600">
              <Menu size={24} />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
