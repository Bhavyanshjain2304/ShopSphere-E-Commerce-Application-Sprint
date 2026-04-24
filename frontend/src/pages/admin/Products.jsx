import { useEffect, useState } from 'react';
import { getAdminProducts, createProduct, updateProduct, deleteProduct } from '../../api/adminApi';

const EMPTY_FORM = { name: '', description: '', price: '', stock: '', imageUrl: '', categoryId: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProducts = () => {
    getAdminProducts(page).then((res) => {
      const data = res.data.data;
      setProducts(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    });
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProduct(editId, form);
      } else {
        await createProduct(form);
      }
      setForm(EMPTY_FORM);
      setEditId(null);
      fetchProducts();
    } catch {
      alert('Failed to save product');
    }
  };

  const handleEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, stock: p.stock, imageUrl: p.imageUrl || '', categoryId: p.categoryId });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    fetchProducts();
  };

  return (
    <div>
      <h2>Manage Products</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        <input type="number" placeholder="Category ID" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required />
        <button type="submit">{editId ? 'Update' : 'Create'} Product</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm(EMPTY_FORM); }}>Cancel</button>}
      </form>

      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>${p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i)} disabled={page === i}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
}
