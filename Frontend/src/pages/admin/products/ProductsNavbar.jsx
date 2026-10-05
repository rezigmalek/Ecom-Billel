import React from 'react'
import { NavLink } from 'react-router-dom'
import { Users, UserPlus } from 'lucide-react'
const ProductsNavbar = () => {
    return (
        <div className="flex space-x-8 mb-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <NavLink
                to="/admin/products"
                end
                className={({ isActive }) =>
                    `flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                    }`
                }
            >
                <Users size={20} />
                Liste des produits
            </NavLink>
            <NavLink
                to="/admin/products/create"
                className={({ isActive }) =>
                    `flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${isActive
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
                    }`
                }
            >
                <UserPlus size={20} />
                Créer un produit
            </NavLink>
        </div>
    );
}

export default ProductsNavbar