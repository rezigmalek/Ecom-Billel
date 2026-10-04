
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Lock, Mail, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { apiUrl } from '../../data/mockData';
import { adminToken } from '../../data/mockData';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const handleLogin = async (data) => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const message =
          result.message || 'Email ou mot de passe incorrect.';

        toast.error(message);
        setServerError(message);

        return;
      }

      // Stocker le token retourné par Laravel
      localStorage.setItem('token-billel', result.token);

      // Afficher le message de succès
      toast.success('Connexion réussie !');

      // Redirection après connexion
      navigate('/admin/orders');

    } catch (error) {
      console.error('Erreur de connexion :', error);

      toast.error(
        'Impossible de contacter le serveur. Vérifiez que API Laravel est démarrée.'
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center gap-2 mb-8">
          <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
            <Package size={32} />
          </div>

          <span className="font-extrabold text-3xl tracking-tight text-slate-900">
            Ecom<span className="text-indigo-600">Billel</span>
          </span>
        </div>

        <h2 className="mt-2 text-center text-2xl font-bold text-slate-900">
          Connexion à l'espace Admin
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">

          <form
            className="space-y-6"
            onSubmit={handleSubmit(handleLogin)}
          >

            {/* Message d'erreur serveur */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {serverError}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Adresse Email
              </label>

              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>

                <input
                  type="email"
                  {...register('email', {
                    required: 'L’adresse email est obligatoire.',
                  })}
                  className={`pl-10 block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm ${errors.email
                    ? 'border-red-400'
                    : 'border-slate-300'
                    }`}
                  placeholder="admin@ecombillel.dz"
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Mot de passe
              </label>

              <div className="mt-2 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>

                <input
                  type="password"
                  {...register('password', {
                    required: 'Le mot de passe est obligatoire.',
                  })}
                  className={`pl-10 block w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm ${errors.password
                    ? 'border-red-400'
                    : 'border-slate-300'
                    }`}
                  placeholder="••••••••"
                />
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Mot de passe oublié */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            {/* Bouton */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  'Connexion...'
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
