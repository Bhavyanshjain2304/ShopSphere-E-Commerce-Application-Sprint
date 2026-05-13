import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../api/catalogApi';
import { useSearchBar } from '../context/SearchBarContext';
import ProductImage from '../components/ProductImage';

const CATEGORY_ICONS = ['🛍️', '📱', '👗', '🏠', '⚽', '📚', '💄', '🎮'];

const StarRating = ({ rating = 4 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`text-xs ${i <= rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
    ))}
  </div>
);

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { setHeroVisible } = useSearchBar();

  useEffect(() => {
    Promise.all([
      getFeaturedProducts().then(r => setFeatured(r.data.data?.content || [])),
      getCategories().then(r => setCategories(r.data.data || [])),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0.1 });
    if (heroRef.current) observer.observe(heroRef.current);
    return () => { observer.disconnect(); setHeroVisible(false); };
  }, [setHeroVisible]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/products?keyword=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="dark:bg-gray-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
            🎉 Free shipping on orders over ₹999
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
            Discover Your<br />
            <span className="text-yellow-300">Perfect Style</span>
          </h1>
          <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
            Shop thousands of products across every category. Fast delivery, easy returns.
          </p>

          <form ref={heroRef} onSubmit={handleSearch} className="flex max-w-xl mx-auto gap-2 mb-8">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products, brands and more..."
              className="flex-1 px-5 py-3.5 rounded-2xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg" />
            <button type="submit"
              className="bg-white text-indigo-600 px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition shadow-lg">
              Search
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/products"
              className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition shadow-lg">
              Shop Now →
            </Link>
            <Link to="/products"
              className="border-2 border-white/50 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-white/10 transition">
              Explore Categories
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">

        {/* Categories */}
        {categories.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Shop by Category</h2>
              <Link to="/products" className="text-indigo-600 text-sm font-semibold hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <Link key={cat.id} to={`/products?categoryId=${cat.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl p-4 text-center shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="text-3xl mb-2">{CATEGORY_ICONS[i % CATEGORY_ICONS.length]}</div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{cat.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Featured Products</h2>
              <p className="text-sm text-gray-400 mt-1">Handpicked just for you</p>
            </div>
            <Link to="/products" className="text-indigo-600 text-sm font-semibold hover:underline">View all →</Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-2xl h-72 animate-pulse" />)}
            </div>
          ) : featured.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🛍️</p>
              <p className="text-gray-400">No featured products yet</p>
              <Link to="/products" className="mt-4 inline-block text-indigo-600 font-semibold hover:underline">Browse all products</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <Link key={p.id} to={`/products/${p.id}`}
                  className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                  <div className="relative bg-gray-50 dark:bg-gray-800 h-48 overflow-hidden">
                    <ProductImage src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">NEW</div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-indigo-500 font-medium mb-1">{p.categoryName}</p>
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate text-sm mb-1">{p.name}</h3>
                    <StarRating />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-indigo-600 font-bold">₹{p.price}</p>
                      <span className="text-xs text-green-600 font-medium">Free delivery</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Banner */}
        <section className="mt-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">Get 20% off your first order</h3>
            <p className="text-indigo-200 text-sm">Use code WELCOME20 at checkout</p>
          </div>
          <Link to="/products"
            className="bg-white text-indigo-600 px-8 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition shrink-0">
            Shop Now
          </Link>
        </section>
      </div>
    </div>
  );
}
