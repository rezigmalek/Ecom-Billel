import React, { useState } from 'react';
import { History as HistoryIcon, User, Database, Clock, Search, Filter } from 'lucide-react';

const mockHistory = [
  { id: 1, user: "Amine Admin", role: "admin", action: "create", entity: "product", entity_id: 12, description: "Création du produit 'Écouteurs'", time: "Aujourd'hui, 10:23" },
  { id: 2, user: "Sara Confirmatrice", role: "confirmatrice", action: "update", entity: "order", entity_id: 1001, description: "Commande #1001 confirmée", time: "Aujourd'hui, 09:45" },
  { id: 3, user: "Sara Confirmatrice", role: "confirmatrice", action: "update", entity: "order", entity_id: 1002, description: "Commande #1002 annulée", time: "Hier, 16:30" },
  { id: 4, user: "Amine Admin", role: "admin", action: "delete", entity: "product", entity_id: 8, description: "Suppression de l'ancien clavier", time: "Hier, 14:10" },
  { id: 5, user: "Amine Admin", role: "admin", action: "create", entity: "user", entity_id: 5, description: "Création du compte confirmatrice", time: "25 Sept 2026, 11:00" },
];

const AdminHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const getActionBadge = (action) => {
    switch(action) {
      case 'create': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold uppercase tracking-wider">Création</span>;
      case 'update': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold uppercase tracking-wider">Mise à jour</span>;
      case 'delete': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold uppercase tracking-wider">Suppression</span>;
      default: return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-bold uppercase tracking-wider">{action}</span>;
    }
  };

  const getEntityIcon = (entity) => {
    switch(entity) {
      case 'product': return <Database size={16} className="text-indigo-500" />;
      case 'order': return <Clock size={16} className="text-orange-500" />;
      case 'user': return <User size={16} className="text-emerald-500" />;
      default: return <Database size={16} className="text-slate-500" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HistoryIcon size={28} className="text-indigo-600" /> Historique des Actions
          </h1>
          <p className="text-sm text-slate-500 mt-1">Tracez toutes les activités des utilisateurs sur la plateforme</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-slate-400" />
          </span>
          <input 
            type="text" 
            placeholder="Rechercher un utilisateur, une action..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium w-full md:w-auto justify-center">
            <Filter size={16} /> Filtrer par Rôle
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium w-full md:w-auto justify-center">
            <Clock size={16} /> Aujourd'hui
          </button>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        
        <div className="relative border-l border-slate-200 ml-3 md:ml-6 space-y-8 pb-4">
          
          {mockHistory.map((log) => (
            <div key={log.id} className="relative pl-6 md:pl-8">
              
              {/* Timeline dot */}
              <div className="absolute -left-[5px] md:-left-[5px] top-1.5 w-[11px] h-[11px] rounded-full bg-white border-2 border-indigo-500"></div>

              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                    {log.user.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{log.user}</span>
                    <span className="ml-2 text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {log.role}
                    </span>
                  </div>
                </div>
                <div className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full w-fit">
                  {log.time}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 ml-0 md:ml-10">
                <div className="flex items-center gap-3 mb-2">
                  {getActionBadge(log.action)}
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                    {getEntityIcon(log.entity)}
                    <span>{log.entity} #{log.entity_id}</span>
                  </div>
                </div>
                <p className="text-slate-700 text-sm">{log.description}</p>
              </div>

            </div>
          ))}

        </div>
        
        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm">
            Charger plus d'historique
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminHistory;
