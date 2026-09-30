import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, History, Package, Menu, Bell, Search, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin/orders', icon: <ShoppingBag size={20} />, label: 'Commandes' },
    { path: '/admin/products', icon: <Package size={20} />, label: 'Produits' },
    { path: '/admin/accounts', icon: <Users size={20} />, label: 'Comptes' },
    { path: '/admin/history', icon: <History size={20} />, label: 'Historique' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`bg-slate-900 text-white w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'ml-0' : '-ml-64'}`}>
        <div className="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
          <Package className="text-indigo-500 mr-2" size={24} />
          <span className="font-bold text-xl tracking-tight text-white">EcomAdmin</span>
        </div>
        
        <div className="p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 mt-2">Menu Principal</div>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-slate-800 bg-slate-900">
          <Link to="/login" className="flex items-center px-3 py-2 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3" />
            <span className="font-medium">Déconnexion</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-500 hover:text-indigo-600 focus:outline-none p-2 rounded-lg hover:bg-slate-100"
            >
              <Menu size={24} />
            </button>
            <div className="ml-4 relative hidden sm:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-slate-400" />
              </span>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                A
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-slate-700">Admin</p>
                <p className="text-xs text-slate-500">Superviseur</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
