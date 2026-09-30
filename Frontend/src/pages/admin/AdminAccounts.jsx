import React, { useState } from 'react';
import { UserPlus, Save, Shield, User } from 'lucide-react';

const AdminAccounts = () => {
  const [accountData, setAccountData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'confirmatrice'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(accountData.password !== accountData.password_confirmation) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    alert('Compte créé avec succès!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nouveau Compte</h1>
          <p className="text-sm text-slate-500">Ajouter un administrateur ou une confirmatrice</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Nom & Prénom *</label>
              <input 
                type="text" 
                name="name"
                required
                value={accountData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: Sara Kadi"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse Email *</label>
              <input 
                type="email" 
                name="email"
                required
                value={accountData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="sara@ecombillel.dz"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe *</label>
                <input 
                  type="password" 
                  name="password"
                  required
                  value={accountData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirmer le mot de passe *</label>
                <input 
                  type="password" 
                  name="password_confirmation"
                  required
                  value={accountData.password_confirmation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-4">Rôle du compte *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <label className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${accountData.role === 'confirmatrice' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="confirmatrice" 
                    className="sr-only"
                    checked={accountData.role === 'confirmatrice'}
                    onChange={handleChange}
                  />
                  <div className={`p-3 rounded-full ${accountData.role === 'confirmatrice' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <User size={24} />
                  </div>
                  <div className="text-center">
                    <div className={`font-bold ${accountData.role === 'confirmatrice' ? 'text-indigo-900' : 'text-slate-700'}`}>Confirmatrice</div>
                    <div className="text-xs text-slate-500 mt-1">Accès limité (Gestion des commandes)</div>
                  </div>
                </label>
                
                <label className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${accountData.role === 'admin' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="admin" 
                    className="sr-only"
                    checked={accountData.role === 'admin'}
                    onChange={handleChange}
                  />
                  <div className={`p-3 rounded-full ${accountData.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Shield size={24} />
                  </div>
                  <div className="text-center">
                    <div className={`font-bold ${accountData.role === 'admin' ? 'text-indigo-900' : 'text-slate-700'}`}>Administrateur</div>
                    <div className="text-xs text-slate-500 mt-1">Accès total au système</div>
                  </div>
                </label>

              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2">
                <UserPlus size={20} /> Créer le compte
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAccounts;
