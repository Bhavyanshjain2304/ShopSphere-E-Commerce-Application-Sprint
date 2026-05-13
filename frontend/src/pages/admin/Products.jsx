import { useEffect, useState } from 'react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../../api/adminApi';
import { getCategories } from '../../api/catalogApi';

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' };

const inputCls = 'w-full border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    getAdminProducts(page).then((res) => {
      const data = res.data.data;
      setProducts(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    });
  };

  useEffect(() => { fetchProducts(); }, [page]);
  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data || []));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Enter valid price';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0) e.stock = 'Enter valid stock';
    if (!form.categoryId) e.categoryId = 'Select a category';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setErrors({}); setModalOpen(true); };
  const openEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description || '', price: p.price, stock: p.stock, imageUrl: p.imageUrl || '', categoryId: p.categoryId || '' });
    setErrors({});
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setEditId(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      if (editId) await updateProduct(editId, form);
      else await createProduct(form);
      closeModal();
      fetchProducts();
    } catch {
      setErrors({ api: 'Failed to save product. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    fetchProducts();
  };

  const f = (key) => ({
    value: form[key],
    onChange: (e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Products</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} products</p>
        </div>
        <button onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition flex items-center gap-2">
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {products.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No products found</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                        {p.imageUrl
                          ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{p.name}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[180px]">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold text-gray-800 dark:text-white">₹{p.price}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{p.categoryName || '—'}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={() => openEdit(p)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950 transition mr-1">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100 dark:border-gray-800">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition ${page === i ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-bold text-gray-800 dark:text-white">{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition text-xl leading-none">×</button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errors.api && <div className="bg-red-50 dark:bg-red-950 text-red-600 text-sm px-4 py-3 rounded-lg">{errors.api}</div>}

              {/* Image preview */}
              {form.imageUrl && (
                <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Product Name *</label>
                <input {...f('name')} placeholder="e.g. Nike Air Max" className={inputCls} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description</label>
                <textarea {...f('description')} rows={2} placeholder="Short product description" className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Price (₹) *</label>
                  <input type="number" {...f('price')} placeholder="999" className={inputCls} />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Stock *</label>
                  <input type="number" {...f('stock')} placeholder="50" className={inputCls} />
                  {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Image URL</label>
                <input {...f('imageUrl')} placeholder="https://..." className={inputCls} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category *</label>
                <select {...f('categoryId')} className={inputCls}>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition">
                  {saving ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
