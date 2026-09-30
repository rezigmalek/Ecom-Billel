import React, { useState } from 'react';
import { Plus, Image as ImageIcon, Trash2, Save, Tag } from 'lucide-react';

const AdminProducts = () => {
  const [productData, setProductData] = useState({
    title: '',
    description: '',
    price: '',
    old_price: '',
    quantity: '',
    main_image: '',
    option_1: '',
    option_2: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Produit créé avec succès!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nouveau Produit</h1>
          <p className="text-sm text-slate-500">Ajouter un nouveau produit à votre catalogue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Tag size={20} className="text-indigo-500" /> Informations Générales
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Titre du produit *</label>
              <input 
                type="text" 
                name="title"
                required
                value={productData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: Écouteurs sans fil Premium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description *</label>
              <textarea 
                name="description"
                required
                value={productData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="Décrivez votre produit en détail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Prix de vente (DZD) *</label>
                <input 
                  type="number" 
                  name="price"
                  required
                  step="0.01"
                  value={productData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-bold text-indigo-700"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ancien Prix (DZD) - Optionnel</label>
                <input 
                  type="number" 
                  name="old_price"
                  step="0.01"
                  value={productData.old_price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-slate-500 line-through"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantité en stock *</label>
                <input 
                  type="number" 
                  name="quantity"
                  required
                  min="0"
                  value={productData.quantity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Ex: 50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <ImageIcon size={20} className="text-indigo-500" /> Image Principale
          </h2>
          
          <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-300" aria-hidden="true" />
              <div className="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                  <span>Télécharger un fichier</span>
                  <input type="file" className="sr-only" />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF jusqu'à 10MB</p>
            </div>
          </div>
          
          <div className="mt-4">
             <label className="block text-sm font-semibold text-slate-700 mb-2">Ou utiliser une URL d'image</label>
             <input 
                type="url" 
                name="main_image"
                value={productData.main_image}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                placeholder="https://exemple.com/image.jpg"
              />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Tag size={20} className="text-indigo-500" /> Options (Variations)
          </h2>
          <p className="text-sm text-slate-500 mb-4">Un produit peut avoir 0, 1 ou 2 options (Ex: Taille, Couleur).</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Option 1</label>
              <select 
                name="option_1"
                value={productData.option_1}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">-- Sans Option --</option>
                <option value="1">Couleur</option>
                <option value="2">Taille</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Option 2</label>
              <select 
                name="option_2"
                value={productData.option_2}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="">-- Sans Option --</option>
                <option value="1">Couleur</option>
                <option value="2">Taille</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button type="button" className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors">
            Annuler
          </button>
          <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2">
            <Save size={20} /> Enregistrer le produit
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminProducts;
