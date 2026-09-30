import React, { useState } from 'react';
import { Filter, Eye, CheckCircle, XCircle, Clock, Truck, MapPin } from 'lucide-react';
import { mockWilayas, mockProducts } from '../../data/mockData';

const mockOrders = [
  { id: 1001, customer: "Amine Benali", wilaya: "Alger", status: "pending_confirmation", date: "2026-09-28", total: 4500.00, product: "Premium Wireless Headphones" },
  { id: 1002, customer: "Sara Kadi", wilaya: "Oran", status: "confirmed", date: "2026-09-27", total: 12500.00, product: "Smart Fitness Watch" },
  { id: 1003, customer: "Karim Ziani", wilaya: "Constantine", status: "shipped", date: "2026-09-22", total: 3200.00, product: "Minimalist Desk Lamp" },
  { id: 1004, customer: "Lina Merzoug", wilaya: "Annaba", status: "delivered", date: "2026-09-21", total: 8900.00, product: "Mechanical Gaming Keyboard" },
  { id: 1005, customer: "Youssef Touati", wilaya: "Tlemcen", status: "cancelled", date: "2026-09-28", total: 1500.00, product: "Premium Wireless Headphones" },
];

const AdminOrders = () => {
  const [filterWilaya, setFilterWilaya] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending_confirmation': return <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14} /> En attente</span>;
      case 'confirmed': return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14} /> Confirmé</span>;
      case 'shipped': return <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck size={14} /> Expédié</span>;
      case 'delivered': return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14} /> Livré</span>;
      case 'cancelled': return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><XCircle size={14} /> Annulé</span>;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Gestion des Commandes</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
          <Filter size={20} /> Filtres Avancés
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Par Produit</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
            >
              <option value="">Tous les produits</option>
              {mockProducts.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Par Wilaya</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={filterWilaya}
              onChange={(e) => setFilterWilaya(e.target.value)}
            >
              <option value="">Toutes les wilayas</option>
              {mockWilayas.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Par Période</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            >
              <option value="">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="yesterday">Hier</option>
              <option value="last_week">Semaine passée</option>
              <option value="last_month">Mois passé</option>
            </select>
          </div>

        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Cmd</th>
                <th className="px-6 py-4 font-semibold">Client</th>
                <th className="px-6 py-4 font-semibold">Produit (Aperçu)</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">#{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">{order.customer}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={12} /> {order.wilaya}
                    </p>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate">{order.product}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4 font-bold text-indigo-600">{order.total.toFixed(2)} DA</td>
                  <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 p-2 rounded-lg transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
