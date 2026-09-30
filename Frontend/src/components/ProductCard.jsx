import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col h-full animate-in">
      <Link to={`/product/${product.id}`} className="relative overflow-hidden aspect-square block">
        <img 
          src={product.main_image || "https://placehold.co/600x400?text=Produit"} 
          alt={product.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.old_price && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
          </div>
        )}
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-300"} />
          ))}
          <span className="text-xs text-slate-400 ml-1">(4.0)</span>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-slate-800 mb-1 line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-bold text-xl text-indigo-600">{product.price.toFixed(2)} DZD</span>
            {product.old_price && (
              <span className="text-sm text-slate-400 line-through">{product.old_price.toFixed(2)} DZD</span>
            )}
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors shadow-sm hover:shadow-indigo-500/30"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
