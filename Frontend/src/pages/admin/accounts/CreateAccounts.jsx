import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserPlus, Shield, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AccountsNavbar from './AccountsNavbar';
import { adminToken } from '../../../data/mockData';
import { apiUrl } from '../../../data/mockData';


const AdminAccounts = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'admin',
    },
  });

  const password = watch('password');
  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const token = adminToken();

      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Erreurs de validation Laravel
        if (response.status === 422 && result.errors) {
          const firstError = Object.values(result.errors)[0]?.[0];

          toast.error(
            firstError || 'Veuillez vérifier les informations saisies.'
          );
        } else {
          toast.error(
            result.message || 'Une erreur est survenue lors de la création.'
          );
        }

        return;
      }

      toast.success(result.message || 'Compte créé avec succès !');

      reset({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin',
      });
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);

      toast.error(
        'Impossible de contacter le serveur. Vérifiez votre connexion.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestion des Comptes
          </h1>

          <p className="text-sm text-slate-500">
            Ajouter un administrateur ou une confirmatrice
          </p>
        </div>
      </div>

      <AccountsNavbar />

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Nom */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nom & Prénom *
              </label>

              <input
                type="text"
                {...register('name', {
                  required: 'Le nom et prénom sont obligatoires.',
                  minLength: {
                    value: 3,
                    message: 'Le nom doit contenir au moins 3 caractères.',
                  },
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.name
                  ? 'border-red-500'
                  : 'border-slate-300'
                  }`}
                placeholder="Ex: Sara Kadi"
              />

              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Adresse Email *
              </label>

              <input
                type="email"
                {...register('email', {
                  required: "L'adresse email est obligatoire.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Veuillez saisir une adresse email valide.',
                  },
                })}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email
                  ? 'border-red-500'
                  : 'border-slate-300'
                  }`}
                placeholder="sara@ecombillel.dz"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mot de passe *
                </label>

                <input
                  type="password"
                  {...register('password', {
                    required: 'Le mot de passe est obligatoire.',
                    minLength: {
                      value: 8,
                      message:
                        'Le mot de passe doit contenir au moins 8 caractères.',
                    },
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.password
                    ? 'border-red-500'
                    : 'border-slate-300'
                    }`}
                  placeholder="••••••••"
                />

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirmer le mot de passe *
                </label>

                <input
                  type="password"
                  {...register('password_confirmation', {
                    required:
                      'La confirmation du mot de passe est obligatoire.',
                    validate: (value) =>
                      value === password ||
                      'Les mots de passe ne correspondent pas.',
                  })}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.password_confirmation
                    ? 'border-red-500'
                    : 'border-slate-300'
                    }`}
                  placeholder="••••••••"
                />

                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password_confirmation.message}
                  </p>
                )}
              </div>

            </div>

            {/* Rôle */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-4">
                Rôle du compte *
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Confirmatrice */}
                <label
                  className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${selectedRole === 'confirmatrice'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    value="confirmatrice"
                    {...register('role', {
                      required: 'Veuillez sélectionner un rôle.',
                    })}
                    className="sr-only"
                  />

                  <div
                    className={`p-3 rounded-full ${selectedRole === 'confirmatrice'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    <User size={24} />
                  </div>

                  <div className="text-center">
                    <div
                      className={`font-bold ${selectedRole === 'confirmatrice'
                        ? 'text-indigo-900'
                        : 'text-slate-700'
                        }`}
                    >
                      Confirmatrice
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Accès limité (Gestion des commandes)
                    </div>
                  </div>
                </label>

                {/* Administrateur */}
                <label
                  className={`cursor-pointer rounded-2xl border-2 p-4 flex flex-col items-center gap-3 transition-all ${selectedRole === 'admin'
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <input
                    type="radio"
                    value="admin"
                    {...register('role', {
                      required: 'Veuillez sélectionner un rôle.',
                    })}
                    className="sr-only"
                  />

                  <div
                    className={`p-3 rounded-full ${selectedRole === 'admin'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    <Shield size={24} />
                  </div>

                  <div className="text-center">
                    <div
                      className={`font-bold ${selectedRole === 'admin'
                        ? 'text-indigo-900'
                        : 'text-slate-700'
                        }`}
                    >
                      Administrateur
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Accès total au système
                    </div>
                  </div>
                </label>

              </div>

              {errors.role && (
                <p className="text-red-500 text-sm mt-2">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Bouton */}
            <div className="flex justify-end pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex items-center gap-2 ${isLoading
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:bg-indigo-700'
                  }`}
              >
                <UserPlus size={20} />

                {isLoading ? 'Création...' : 'Créer le compte'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAccounts;