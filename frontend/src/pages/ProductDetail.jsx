import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProduct, getProducts } from '../api/catalogApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/Toast';
import ProductImage from '../components/ProductImage';

const StarRating = ({ rating = 4, count = 128 }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => <span key={i} className={`text-base ${i <= rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
    </div>
    <span className="text-sm text-gray-400">({count} reviews)</span>
  </div>
);

const MOCK_REVIEWS = [
  { name: 'Rahul S.', rating: 5, comment: 'Excellent product! Exactly as described. Fast delivery too.', date: '2 days ago' },
  { name: 'Priya M.', rating: 4, comment: 'Good quality, happy with the purchase. Would recommend.', date: '1 week ago' },
  { name: 'Amit K.', rating: 4, comment: 'Value for money. Packaging was great.', date: '2 weeks ago' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addItem, updateItem, removeItem, cart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Sync quantity with cart
  const cartItem = cart.find(i => String(i.productId) === String(id));
  const cartQty = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    getProduct(id).then(r => {
      setProduct(r.data.data);
    }).catch(() => navigate('/products'));
    getProducts(0, 4).then(r => setRelated(r.data.data?.content || []));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      await addItem(product.id, product.name, product.price, quantity);
      setAdded(true);
      toast.success(`${product.name} added to cart!`);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const handleCartQtyChange = async (newQty) => {
    if (!user) { navigate('/login'); return; }
    if (newQty === 0) {
      await removeItem(product.id);
      toast.success('Removed from cart');
    } else {
      await updateItem(product.id, newQty);
    }
  };

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen dark:bg-gray-950">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="dark:bg-gray-950 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <span>/</span>
          <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main product */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/2 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-10 min-h-80">
              <div className="w-full h-80">
                <ProductImage src={product.imageUrl} alt={product.name} className="max-h-80 w-full object-contain rounded-2xl" />
              </div>
            </div>

            {/* Info */}
            <div className="md:w-1/2 p-8 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {product.categoryName}
                </span>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">{product.name}</h1>
                <StarRating />
                <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed text-sm">{product.description || 'Premium quality product with excellent craftsmanship.'}</p>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-indigo-600">₹{product.price}</span>
                  <span className="text-sm text-gray-400 line-through">₹{Math.round(product.price * 1.2)}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">20% OFF</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {/* Quantity selector (for initial add) */}
                {cartQty === 0 && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity</span>
                    <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-lg transition">−</button>
                      <span className="px-5 py-2 font-bold text-gray-800 dark:text-white">{quantity}</span>
                      <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                        className="px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-lg transition">+</button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {cartQty > 0 ? (
                    /* In-cart stepper — replaces Add to Cart button */
                    <div className="flex-1 flex items-center justify-between bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-600 rounded-2xl px-4 py-2">
                      <button onClick={() => handleCartQtyChange(cartQty - 1)}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 font-bold text-indigo-600 hover:bg-indigo-100 transition text-lg flex items-center justify-center">
                        −
                      </button>
                      <div className="text-center">
                        <p className="font-bold text-indigo-600 text-lg">{cartQty}</p>
                        <p className="text-xs text-indigo-400">in cart</p>
                      </div>
                      <button onClick={() => handleCartQtyChange(cartQty + 1)} disabled={cartQty >= product.stock}
                        className="w-9 h-9 rounded-xl bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 font-bold text-indigo-600 hover:bg-indigo-100 transition text-lg flex items-center justify-center disabled:opacity-40">
                        +
                      </button>
                    </div>
                  ) : (
                    <button onClick={handleAddToCart} disabled={loading || product.stock === 0}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none">
                      {loading
                        ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : added ? '✓ Added!' : '🛒 Add to Cart'}
                    </button>
                  )}
                  <Link to="/checkout"
                    className="flex-1 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-950 transition text-center flex items-center justify-center">
                    Buy Now
                  </Link>
                </div>

                <div className="flex items-center gap-6 text-xs text-gray-400 pt-2">
                  <span>🚚 Free delivery</span>
                  <span>↩️ Easy returns</span>
                  <span>🔒 Secure payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">Customer Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_REVIEWS.map((r, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.date}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related */}
        {related.filter(r => r.id !== product.id).length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-5">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.filter(r => r.id !== product.id).slice(0, 4).map(p => (
                <Link key={p.id} to={`/products/${p.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                  <div className="bg-gray-50 dark:bg-gray-800 h-36 overflow-hidden">
                    <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{p.name}</p>
                    <p className="text-indigo-600 font-bold text-sm mt-1">₹{p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
