import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getProducts, searchProducts, getProductsByCategory, getCategories } from '../api/catalogApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import ProductImage from '../components/ProductImage';

const StarRating = ({ rating = 4 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => <span key={i} className={`text-xs ${i <= rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
  </div>
);

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 animate-pulse">
    <div className="bg-gray-100 dark:bg-gray-800 h-48" />
    <div className="p-4 space-y-2">
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
    </div>
  </div>
);

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addItem, updateItem, removeItem, cart } = useCart();
  const { user } = useAuth();

  const keyword = searchParams.get('keyword');
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setPage(0);
  }, [keyword, categoryId]);

  useEffect(() => {
    setLoading(true);
    const req = keyword ? searchProducts(keyword, page)
      : categoryId ? getProductsByCategory(categoryId, page)
      : getProducts(page);
    req.then(r => {
      const d = r.data.data;
      setProducts(d?.content || []);
      setTotalPages(d?.totalPages || 0);
    }).finally(() => setLoading(false));
  }, [keyword, categoryId, page]);

  const handleAddToCart = async (e, p) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setAddingId(p.id);
    try {
      await addItem(p.id, p.name, p.price, 1);
      toast.success(`${p.name} added to cart!`);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingId(null);
    }
  };

  const handleCartQtyChange = async (e, p, newQty) => {
    e.preventDefault();
    if (newQty === 0) {
      await removeItem(p.id);
    } else {
      await updateItem(p.id, newQty);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 dark:bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {keyword ? `Results for "${keyword}"` : categoryId ? categories.find(c => String(c.id) === categoryId)?.name || 'Products' : 'All Products'}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{products.length} products found</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 hidden md:block">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sticky top-20">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-4">Categories</h3>
            <ul className="space-y-1">
              <li>
                <Link to="/products"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${!categoryId && !keyword ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                  🛍️ All Products
                </Link>
              </li>
              {categories.map((cat, i) => (
                <li key={cat.id}>
                  <Link to={`/products?categoryId=${cat.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${categoryId === String(cat.id) ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                    {['📱','👗','🏠','⚽','📚','💄','🎮','🍕'][i % 8]} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-400 mb-6">Try a different search or browse all products</p>
              <Link to="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold text-sm hover:bg-indigo-700 transition">
                Browse All
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((p) => {
                const cartItem = cart.find(i => String(i.productId) === String(p.id));
                const cartQty = cartItem ? cartItem.quantity : 0;
                return (
                <Link key={p.id} to={`/products/${p.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  <div className="relative bg-gray-50 dark:bg-gray-800 h-44 overflow-hidden">
                    <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    {/* Cart overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                      {cartQty > 0 ? (
                        <div className="bg-indigo-600 flex items-center justify-between px-3 py-2">
                          <button onClick={(e) => handleCartQtyChange(e, p, cartQty - 1)}
                            className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition">−</button>
                          <span className="text-white text-xs font-bold">{cartQty} in cart</span>
                          <button onClick={(e) => handleCartQtyChange(e, p, cartQty + 1)}
                            className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition">+</button>
                        </div>
                      ) : (
                        <button onClick={(e) => handleAddToCart(e, p)} disabled={addingId === p.id}
                          className="w-full bg-indigo-600 text-white py-2.5 text-xs font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-1">
                          {addingId === p.id ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '🛒'} Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-indigo-500 font-medium mb-0.5">{p.categoryName}</p>
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate text-sm">{p.name}</h3>
                    <StarRating />
                    <div className="flex items-center justify-between mt-1.5">
                      <p className="text-indigo-600 font-bold text-sm">₹{p.price}</p>
                      <span className={`text-xs font-medium ${p.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {cartQty > 0 ? `${cartQty} in cart` : p.stock > 0 ? 'In stock' : 'Out of stock'}
                      </span>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-indigo-400 transition">
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition ${page === i ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-400'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:border-indigo-400 transition">
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
