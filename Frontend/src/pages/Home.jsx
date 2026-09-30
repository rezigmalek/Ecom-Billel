import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { mockProducts } from '../data/mockData';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Truck } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'electronics', label: 'Électronique' },
    { id: 'fashion', label: 'Mode' },
    { id: 'home', label: 'Maison' }
  ];

  const filteredProducts = mockProducts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/80 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col justify-center min-h-[500px]">
          <div className="max-w-2xl animate-in">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-sm font-semibold mb-6 border border-indigo-400/30">
              <Sparkles size={16} /> Nouvelle Collection 2026
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              Découvrez nos produits <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">exclusifs</span>
            </h1>
            <p className="text-lg text-indigo-100 mb-10 max-w-xl leading-relaxed">
              Explorez notre catalogue varié et profitez des meilleures offres. Livraison rapide partout en Algérie.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-white text-indigo-900 font-bold rounded-xl shadow-lg hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Acheter Maintenant <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600"><Truck size={24} /></div>
              <div>
                <h4 className="font-bold text-slate-800">Livraison Rapide</h4>
                <p className="text-sm text-slate-500">Sur les 58 wilayas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><ShieldCheck size={24} /></div>
              <div>
                <h4 className="font-bold text-slate-800">Paiement Sécurisé</h4>
                <p className="text-sm text-slate-500">À la livraison</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><TrendingUp size={24} /></div>
              <div>
                <h4 className="font-bold text-slate-800">Meilleurs Prix</h4>
                <p className="text-sm text-slate-500">Garantis sur le marché</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h2 className="text-3xl font-bold text-slate-900">Nos Produits</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Rechercher un produit..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              />
            </div>
            
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucun produit trouvé</h3>
              <p className="text-slate-500">Essayez de modifier votre recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
