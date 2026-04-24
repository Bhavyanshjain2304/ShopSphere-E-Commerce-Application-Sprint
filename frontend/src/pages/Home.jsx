import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts, getCategories } from '../api/catalogApi';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getFeaturedProducts().then((res) => setFeatured(res.data.data?.content || []));
    getCategories().then((res) => setCategories(res.data.data || []));
  }, []);

  return (
    <div>
      <h1>Welcome to ShopSphere</h1>

      <h2>Categories</h2>
      <div>
        {categories.map((cat) => (
          <Link key={cat.id} to={`/products?categoryId=${cat.id}`}>
            {cat.name}
          </Link>
        ))}
      </div>

      <h2>Featured Products</h2>
      <div>
        {featured.map((product) => (
          <div key={product.id}>
            <Link to={`/products/${product.id}`}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
