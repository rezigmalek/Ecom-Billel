import React, { useEffect, useState } from 'react';
import AccountsNavbar from './AccountsNavbar';
import DeleteConfirmationModal from '../../../components/common/DeleteConfirmationModal';
import {
  Shield,
  User,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiUrl, adminToken } from '../../../data/mockData';

const AccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modification
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [editData, setEditData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'confirmatrice',
  });

  // Suppression
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // =========================================================
  // Récupérer les comptes
  // =========================================================

  const fetchAccounts = async () => {
    try {
      const token = adminToken();

      const response = await fetch(`${apiUrl}/users`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message || 'Impossible de récupérer les comptes.'
        );
        return;
      }

      setAccounts(result.users || []);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération des comptes :',
        error
      );

      toast.error(
        'Impossible de contacter le serveur. Vérifiez votre connexion.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // =========================================================
  // Formatage de la date
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // =========================================================
  // Ouvrir la fenêtre de modification
  // =========================================================

  const handleEdit = (account) => {
    setSelectedAccount(account);

    setEditData({
      name: account.name || '',
      email: account.email || '',
      password: '',
      role: account.role || 'confirmatrice',
    });

    setIsEditModalOpen(true);
  };

  // =========================================================
  // Fermer la fenêtre de modification
  // =========================================================

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }

    setIsEditModalOpen(false);
    setSelectedAccount(null);

    setEditData({
      name: '',
      email: '',
      password: '',
      role: 'confirmatrice',
    });
  };

  // =========================================================
  // Modifier les champs
  // =========================================================

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Modifier un compte
  // =========================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedAccount) {
      return;
    }

    if (!editData.name.trim()) {
      toast.error('Le nom et prénom sont obligatoires.');
      return;
    }

    if (!editData.email.trim()) {
      toast.error("L'adresse email est obligatoire.");
      return;
    }

    if (editData.password && editData.password.length < 8) {
      toast.error(
        'Le mot de passe doit contenir au moins 8 caractères.'
      );
      return;
    }

    setIsUpdating(true);

    try {
      const token = adminToken();

      const dataToSend = {
        name: editData.name,
        email: editData.email,
        role: editData.role,
      };

      if (editData.password.trim()) {
        dataToSend.password = editData.password;
      }

      const response = await fetch(
        `${apiUrl}/users/${selectedAccount.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 422 && result.errors) {
          const firstError = Object.values(result.errors)[0]?.[0];

          toast.error(
            firstError ||
            'Veuillez vérifier les informations saisies.'
          );
        } else {
          toast.error(
            result.message ||
            'Impossible de modifier le compte.'
          );
        }

        return;
      }

      toast.success(
        result.message || 'Compte modifié avec succès !'
      );

      setAccounts((prevAccounts) =>
        prevAccounts.map((account) =>
          account.id === selectedAccount.id
            ? {
              ...account,
              name: editData.name,
              email: editData.email,
              role: editData.role,
            }
            : account
        )
      );

      handleCloseEditModal();
    } catch (error) {
      console.error(
        'Erreur lors de la modification du compte :',
        error
      );

      toast.error(
        'Impossible de contacter le serveur. Vérifiez votre connexion.'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  // =========================================================
  // Ouvrir la confirmation de suppression
  // =========================================================

  const handleDelete = (account) => {
    setAccountToDelete(account);
    setIsDeleteModalOpen(true);
  };

  // =========================================================
  // Fermer la confirmation de suppression
  // =========================================================

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setIsDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  // =========================================================
  // Confirmer la suppression
  // =========================================================

  const confirmDelete = async () => {
    if (!accountToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      const token = adminToken();

      const response = await fetch(
        `${apiUrl}/users/${accountToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message ||
          'Impossible de supprimer le compte.'
        );
        return;
      }

      toast.success(
        result.message || 'Compte supprimé avec succès !'
      );

      setAccounts((prevAccounts) =>
        prevAccounts.filter(
          (account) => account.id !== accountToDelete.id
        )
      );

      handleCloseDeleteModal();
    } catch (error) {
      console.error(
        'Erreur lors de la suppression du compte :',
        error
      );

      toast.error(
        'Impossible de contacter le serveur. Vérifiez votre connexion.'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Gestion des Comptes
        </h1>

        <p className="text-sm text-slate-500">
          Gérez les administrateurs et les confirmatrices du système
        </p>
      </div>

      <AccountsNavbar />

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-500">

                <th className="py-4 px-6 font-semibold">
                  Utilisateur
                </th>

                <th className="py-4 px-6 font-semibold">
                  Rôle
                </th>

                <th className="py-4 px-6 font-semibold">
                  Date d'ajout
                </th>

                <th className="py-4 px-6 font-semibold text-right">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {/* Chargement */}
              {isLoading && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    Chargement des comptes...
                  </td>
                </tr>
              )}

              {/* Aucun compte */}
              {!isLoading && accounts.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    Aucun compte trouvé.
                  </td>
                </tr>
              )}

              {/* Liste des comptes */}
              {!isLoading &&
                accounts.map((account) => (
                  <tr
                    key={account.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >

                    {/* Utilisateur */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                          {account.name
                            ? account.name
                              .charAt(0)
                              .toUpperCase()
                            : '?'}
                        </div>

                        <div>
                          <div className="font-semibold text-slate-900">
                            {account.name}
                          </div>

                          <div className="text-sm text-slate-500">
                            {account.email}
                          </div>
                        </div>

                      </div>
                    </td>

                    {/* Rôle */}
                    <td className="py-4 px-6">

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${account.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-emerald-100 text-emerald-700'
                          }`}
                      >

                        {account.role === 'admin' ? (
                          <Shield size={14} />
                        ) : (
                          <User size={14} />
                        )}

                        {account.role === 'admin'
                          ? 'Administrateur'
                          : 'Confirmatrice'}

                      </span>

                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-sm text-slate-600">
                      {formatDate(account.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">

                      <div className="flex justify-end gap-2">

                        {/* Modifier */}
                        <button
                          type="button"
                          onClick={() => handleEdit(account)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>

                        {/* Supprimer */}
                        <button
                          type="button"
                          onClick={() => handleDelete(account)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* =====================================================
          MODALE DE MODIFICATION
          ===================================================== */}

      {isEditModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={handleCloseEditModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Modifier le compte
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Modifiez les informations du compte
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseEditModal}
                disabled={isUpdating}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>

            </div>

            {/* Formulaire */}
            <form
              onSubmit={handleUpdate}
              className="p-6 space-y-5"
            >

              {/* Nom */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nom & Prénom *
                </label>

                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ex: Sara Kadi"
                  disabled={isUpdating}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Adresse Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="sara@ecombillel.dz"
                  disabled={isUpdating}
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nouveau mot de passe
                </label>

                <input
                  type="password"
                  name="password"
                  value={editData.password}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Laisser vide pour conserver l'actuel"
                  disabled={isUpdating}
                />

                <p className="text-xs text-slate-400 mt-1">
                  Laissez ce champ vide si vous ne souhaitez pas
                  modifier le mot de passe.
                </p>
              </div>

              {/* Rôle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rôle *
                </label>

                <select
                  name="role"
                  value={editData.role}
                  onChange={handleEditChange}
                  disabled={isUpdating}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="confirmatrice">
                    Confirmatrice
                  </option>

                  <option value="admin">
                    Administrateur
                  </option>
                </select>
              </div>

              {/* Boutons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">

                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  disabled={isUpdating}
                  className="px-5 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save size={18} />

                  {isUpdating
                    ? 'Modification...'
                    : 'Enregistrer'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* =====================================================
          COMPOSANT RÉUTILISABLE DE CONFIRMATION
          ===================================================== */}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        itemName={accountToDelete?.name}
        onClose={handleCloseDeleteModal}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        title="Supprimer le compte"
        message="Êtes-vous sûr de vouloir supprimer le compte de"
      />

    </div>
  );
};

export default AccountsList;