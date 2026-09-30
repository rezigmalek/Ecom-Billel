import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-indigo-100 p-6 rounded-full text-indigo-500 mb-6">
          <ShoppingBag size={64} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Votre panier est vide</h2>
        <p className="text-slate-500 mb-8 max-w-md text-center">
          Vous n'avez ajouté aucun produit à votre panier pour le moment. Explorez notre catalogue pour trouver ce dont vous avez besoin.
        </p>
        <Link to="/" className="bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-indigo-700 shadow-lg transition-all flex items-center gap-2">
          Continuer vos achats <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-in">
                
                <img 
                  src={item.main_image} 
                  alt={item.title} 
                  className="w-24 h-24 object-cover rounded-xl shrink-0 border border-slate-100"
                />
                
                <div className="flex-grow">
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-bold text-lg text-slate-900 hover:text-indigo-600 mb-1">{item.title}</h3>
                  </Link>
                  <p className="font-bold text-indigo-600 mb-3">{item.price.toFixed(2)} DZD</p>
                  
                  {Object.entries(item.options).length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {Object.entries(item.options).map(([k, v]) => (
                        <span key={k} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                          {k}: {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button 
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg transition-colors shadow-sm"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-bold text-slate-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg transition-colors shadow-sm"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sticky top-28">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Résumé de la commande</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-total ({cart.length} articles)</span>
                  <span className="font-semibold text-slate-900">{cartTotal.toFixed(2)} DZD</span>
                </div>
                <div className="flex justify-between text-slate-600 pb-4 border-b border-slate-100">
                  <span>Livraison estimée</span>
                  <span className="font-semibold text-slate-900">À calculer</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-black text-indigo-600">{cartTotal.toFixed(2)} DZD</span>
                </div>
              </div>

              <button className="w-full bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all flex justify-center items-center gap-2 mb-4">
                Procéder au paiement <ArrowRight size={20} />
              </button>
              
              <Link to="/" className="w-full bg-white text-slate-700 font-bold py-3 px-8 rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-all flex justify-center items-center">
                Continuer les achats
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
