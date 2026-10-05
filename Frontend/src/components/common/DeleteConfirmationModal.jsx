import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({
    isOpen,
    itemName,
    onClose,
    onConfirm,
    isDeleting = false,
    title = 'Confirmer la suppression',
    message = 'Êtes-vous sûr de vouloir supprimer cet élément ?',
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

                {/* Contenu */}
                <div className="p-6">

                    {/* Icône */}
                    <div className="flex justify-center mb-5">
                        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                            <AlertTriangle size={28} />
                        </div>
                    </div>

                    {/* Texte */}
                    <div className="text-center">

                        <h2 className="text-xl font-bold text-slate-900">
                            {title}
                        </h2>

                        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                            {message}{' '}

                            {itemName && (
                                <span className="font-semibold text-slate-700">
                                    {itemName}
                                </span>
                            )}
                            ?
                        </p>

                        <p className="text-xs text-red-500 mt-2">
                            Cette action est irréversible.
                        </p>

                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3 mt-7">

                        {/* Annuler */}
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isDeleting}
                            className="flex-1 px-5 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-all disabled:opacity-50"
                        >
                            Annuler
                        </button>

                        {/* Supprimer */}
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isDeleting}
                            className="flex-1 px-5 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={18} />

                            {isDeleting
                                ? 'Suppression...'
                                : 'Supprimer'}
                        </button>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
