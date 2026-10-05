import React, { useEffect, useState } from 'react';
import ProductsNavbar from './ProductsNavbar';
import {
  Edit,
  Trash2,
  X,
  Save,
  AlertTriangle,
  Package,
  Tag,
  Boxes,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiUrl, adminToken } from '../../../data/mockData';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    price: '',
    old_price: '',
  });

  /*
   * ============================================================
   * FETCH PRODUCTS
   * ============================================================
   */

  const fetchProducts = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/products`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${adminToken()}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(
          result.message || 'Erreur lors du chargement des produits.'
        );
        return;
      }

      setProducts(result.products || []);
    } catch (error) {
      console.error(error);
      toast.error('Impossible de contacter le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /*
   * ============================================================
   * HELPERS
   * ============================================================
   */

  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') {
      return '-';
    }

    return `${Number(price).toLocaleString('fr-FR')} DA`;
  };

  const formatDate = (date) => {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    return `${apiUrl.replace('/api', '')}/storage/${imagePath}`;
  };

  /*
   * Le stock est directement disponible dans product.quantity.
   * Les variants ne sont pas utilisés ici.
   */
  const getTotalStock = (product) => {
    return Number(product.quantity || 0);
  };

  const getStockStatus = (quantity) => {
    if (quantity <= 0) {
      return {
        label: 'Rupture de stock',
        className: 'bg-red-100 text-red-700',
        dotClassName: 'bg-red-500',
      };
    }

    if (quantity <= 10) {
      return {
        label: 'Stock faible',
        className: 'bg-orange-100 text-orange-700',
        dotClassName: 'bg-orange-500',
      };
    }

    return {
      label: 'En stock',
      className: 'bg-emerald-100 text-emerald-700',
      dotClassName: 'bg-emerald-500',
    };
  };

  const getProductOptions = (product) => {
    const options = [];

    if (product.option1) {
      options.push(product.option1.name);
    }

    if (product.option2) {
      options.push(product.option2.name);
    }

    return options;
  };

  /*
   * ============================================================
   * EDIT
   * ============================================================
   */

  const openEditModal = (product) => {
    setSelectedProduct(product);

    setEditForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price || '',
      old_price: product.old_price || '',
    });

    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    if (isUpdating) return;

    setIsEditModalOpen(false);
    setSelectedProduct(null);

    setEditForm({
      title: '',
      description: '',
      price: '',
      old_price: '',
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!selectedProduct) return;

    if (!editForm.title.trim()) {
      toast.error('Le titre du produit est obligatoire.');
      return;
    }

    if (!editForm.price || Number(editForm.price) < 0) {
      toast.error('Veuillez saisir un prix valide.');
      return;
    }

    if (
      editForm.old_price !== '' &&
      Number(editForm.old_price) < 0
    ) {
      toast.error('Veuillez saisir un ancien prix valide.');
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `${apiUrl}/products/${selectedProduct.id}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken()}`,
          },
          body: JSON.stringify({
            title: editForm.title.trim(),
            description: editForm.description.trim(),
            price: Number(editForm.price),
            old_price:
              editForm.old_price === ''
                ? null
                : Number(editForm.old_price),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          const firstError = Object.values(result.errors)[0];

          if (Array.isArray(firstError) && firstError.length > 0) {
            toast.error(firstError[0]);
          } else {
            toast.error(
              result.message || 'Erreur lors de la modification.'
            );
          }
        } else {
          toast.error(
            result.message || 'Erreur lors de la modification du produit.'
          );
        }

        return;
      }

      /*
       * Certains backends retournent directement le produit,
       * d'autres retournent { product: ... }.
       */
      const updatedProduct = result.product || result;

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === selectedProduct.id
            ? {
              ...product,
              ...updatedProduct,
            }
            : product
        )
      );

      toast.success('Produit modifié avec succès.');

      closeEditModal();
    } catch (error) {
      console.error(error);
      toast.error('Impossible de contacter le serveur.');
    } finally {
      setIsUpdating(false);
    }
  };

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;

    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `${apiUrl}/products/${productToDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${adminToken()}`,
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        toast.error(
          result.message || 'Erreur lors de la suppression du produit.'
        );
        return;
      }

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.id !== productToDelete.id
        )
      );

      toast.success('Produit supprimé avec succès.');

      closeDeleteModal();
    } catch (error) {
      console.error(error);
      toast.error('Impossible de contacter le serveur.');
    } finally {
      setIsDeleting(false);
    }
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductsNavbar />

      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Produits
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Gérez les produits disponibles dans votre boutique.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Produit
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Prix
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Stock
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Options
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Date d'ajout
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />

                        <p className="mt-3 text-sm text-gray-500">
                          Chargement des produits...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center"
                    >
                      <Package
                        size={42}
                        className="mx-auto text-gray-300"
                      />

                      <p className="mt-3 text-sm font-medium text-gray-700">
                        Aucun produit
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Aucun produit n'est disponible pour le moment.
                      </p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const stock = getTotalStock(product);
                    const stockStatus = getStockStatus(stock);
                    const productOptions =
                      getProductOptions(product);
                    const imageUrl = getImageUrl(
                      product.main_image
                    );

                    return (
                      <tr
                        key={product.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        {/* Produit */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {/* Image */}
                            <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={product.title}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display =
                                      'none';
                                  }}
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package
                                    size={24}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Infos */}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-900">
                                {product.title}
                              </p>

                              <p className="mt-1 max-w-[280px] truncate text-sm text-gray-500">
                                {product.description ||
                                  'Aucune description'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Prix */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(product.price)}
                            </span>

                            {product.old_price && (
                              <span className="mt-1 text-xs text-gray-400 line-through">
                                {formatPrice(product.old_price)}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-start gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${stockStatus.className}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${stockStatus.dotClassName}`}
                              />

                              {stockStatus.label}
                            </span>

                            <span className="text-sm font-medium text-gray-700">
                              {stock}{' '}
                              {stock > 1 ? 'unités' : 'unité'}
                            </span>
                          </div>
                        </td>

                        {/* Options */}
                        <td className="px-6 py-4">
                          {productOptions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {productOptions.map(
                                (option, index) => (
                                  <span
                                    key={`${product.id}-${option}-${index}`}
                                    className="inline-flex items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-700"
                                  >
                                    <Tag size={13} />
                                    {option}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Aucune option
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(product.created_at)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(product)
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openDeleteModal(product)
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================================
          EDIT MODAL
          ======================================================== */}

      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Modifier le produit
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Modifiez les informations du produit.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={isUpdating}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateProduct}>
              <div className="space-y-5 px-6 py-6">
                {/* Title */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Titre
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={editForm.title}
                    onChange={handleEditChange}
                    disabled={isUpdating}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                    placeholder="Titre du produit"
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={editForm.description}
                    onChange={handleEditChange}
                    disabled={isUpdating}
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                    placeholder="Description du produit"
                  />
                </div>

                {/* Prices */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="price"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Prix
                    </label>

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.price}
                      onChange={handleEditChange}
                      disabled={isUpdating}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="old_price"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      Ancien prix
                    </label>

                    <input
                      id="old_price"
                      name="old_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.old_price}
                      onChange={handleEditChange}
                      disabled={isUpdating}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:bg-gray-100"
                      placeholder="6500"
                    />
                  </div>
                </div>

                {/* Stock information */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                      <Boxes
                        size={18}
                        className="text-gray-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Stock actuel
                      </p>

                      <p className="text-sm text-gray-500">
                        {getTotalStock(selectedProduct)}{' '}
                        {getTotalStock(selectedProduct) > 1
                          ? 'unités'
                          : 'unité'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={isUpdating}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Modification...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Enregistrer
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE MODAL
          ======================================================== */}

      {isDeleteModalOpen && productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-start gap-4 px-6 pt-6">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle
                  size={22}
                  className="text-red-600"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Supprimer le produit
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Cette action est irréversible.
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-sm leading-6 text-gray-600">
                Êtes-vous sûr de vouloir supprimer le produit{' '}
                <span className="font-semibold text-gray-900">
                  « {productToDelete.title} »
                </span>
                ?
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Suppression...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Supprimer
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;