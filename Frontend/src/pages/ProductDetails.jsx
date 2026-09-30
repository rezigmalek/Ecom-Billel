import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts, mockWilayas } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = mockProducts.find(p => p.id === parseInt(id)) || mockProducts[0]; // Fallback for demo
  
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleOptionSelect = (optionName, value) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedOptions);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Retour aux produits
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-12 p-1">
            
            {/* Image Gallery */}
            <div className="bg-slate-100/50 p-6 md:p-12 flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-md animate-in">
                <img 
                  src={product.main_image} 
                  alt={product.title} 
                  className="w-full h-full object-cover rounded-2xl shadow-lg mix-blend-multiply"
                />
                {product.old_price && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-current" />)}
                </div>
                <span className="text-sm text-slate-500">(128 avis)</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.title}</h1>
              
              <div className="flex items-end gap-4 mb-6">
                <span className="text-4xl font-extrabold text-indigo-600">{product.price.toFixed(2)} DZD</span>
                {product.old_price && (
                  <span className="text-xl text-slate-400 line-through mb-1">{product.old_price.toFixed(2)} DZD</span>
                )}
              </div>

              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Options */}
              {product.options && product.options.map(option => (
                <div key={option.name} className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">{option.name}</h3>
                  <div className="flex flex-wrap gap-3">
                    {option.values.map(val => (
                      <button
                        key={val}
                        onClick={() => handleOptionSelect(option.name, val)}
                        className={`px-5 py-2.5 rounded-xl border-2 font-medium transition-all ${
                          selectedOptions[option.name] === val
                            ? 'border-indigo-600 text-indigo-600 bg-indigo-50'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-slate-100">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 font-bold py-4 px-8 rounded-xl hover:bg-indigo-50 transition-all flex justify-center items-center gap-2"
                >
                  Ajouter au panier
                </button>
                <button 
                  onClick={() => setShowOrderForm(true)}
                  className="flex-1 bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all flex justify-center items-center gap-2"
                >
                  Commander direct
                </button>
              </div>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center border-t border-slate-100 pt-8">
                <div className="flex flex-col items-center">
                  <Truck className="text-indigo-500 mb-2" size={24} />
                  <span className="text-xs text-slate-500 font-medium">Livraison Express</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="text-indigo-500 mb-2" size={24} />
                  <span className="text-xs text-slate-500 font-medium">Paiement Sécurisé</span>
                </div>
                <div className="flex flex-col items-center">
                  <RotateCcw className="text-indigo-500 mb-2" size={24} />
                  <span className="text-xs text-slate-500 font-medium">Retour 7 Jours</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Embedded Checkout Form (IFrame simulation) */}
        {showOrderForm && (
          <div className="mt-12 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in" id="order-form">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Finaliser la commande</h2>
              <button onClick={() => setShowOrderForm(false)} className="text-slate-400 hover:text-white">Fermer</button>
            </div>
            
            <div className="p-8">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <p className="text-amber-800 text-sm font-medium">
                  Remplissez le formulaire ci-dessous pour confirmer votre commande pour: <strong className="text-amber-900">{product.title}</strong>
                </p>
              </div>
              
              {/* This represents the iFrame content the user asked for */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 bg-slate-50 relative">
                <div className="absolute -top-3 left-6 bg-slate-50 px-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Formulaire Intégré (iFrame)
                </div>
                
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => { e.preventDefault(); alert('Commande passée avec succès!'); setShowOrderForm(false); }}>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nom Complet</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="Votre nom et prénom" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                    <input type="tel" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="0555 12 34 56" required />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Wilaya</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" required>
                      <option value="">Sélectionnez une wilaya</option>
                      {mockWilayas.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse de livraison (Optionnelle)</label>
                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" placeholder="Rue, Bâtiment..." />
                  </div>
                  
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Type de livraison</label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className="flex items-center p-4 border border-indigo-200 bg-indigo-50 rounded-xl cursor-pointer">
                        <input type="radio" name="delivery" defaultChecked className="text-indigo-600 focus:ring-indigo-500 w-5 h-5 mr-3" />
                        <div>
                          <span className="block font-bold text-indigo-900">À Domicile</span>
                          <span className="text-xs text-indigo-700">+ 600 DZD</span>
                        </div>
                      </label>
                      <label className="flex items-center p-4 border border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                        <input type="radio" name="delivery" className="text-indigo-600 focus:ring-indigo-500 w-5 h-5 mr-3" />
                        <div>
                          <span className="block font-bold text-slate-900">Stop Desk (Bureau)</span>
                          <span className="text-xs text-slate-500">+ 400 DZD</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 pt-6 mt-2 border-t border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Total à payer (avec livraison)</p>
                      <p className="text-2xl font-black text-slate-900">{(product.price + 600).toFixed(2)} DZD</p>
                    </div>
                    <button type="submit" className="bg-indigo-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center gap-2">
                      Confirmer <Check size={20} />
                    </button>
                  </div>

                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
