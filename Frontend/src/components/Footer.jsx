import React from 'react';
import { Package, Globe, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Package size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Ecom<span className="text-indigo-400">Billel</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              La meilleure plateforme e-commerce en Algérie. Découvrez nos produits exclusifs avec livraison rapide sur 58 wilayas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors"><Globe size={20} /></a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Liens Rapides</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Tous les Produits</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">À Propos</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Politique de retour</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Suivi de commande</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Conditions d'utilisation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                <span>123 Rue de l'Indépendance, Alger, Algérie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-indigo-400 shrink-0" />
                <span>+213 555 123 456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-indigo-400 shrink-0" />
                <span>contact@ecombillel.dz</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} EcomBillel. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">Termes</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
