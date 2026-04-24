import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, searchProducts, getProductsByCategory, getCategories } from '../api/catalogApi';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const categoryId = searchParams.get('categoryId');

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data || []));
  }, []);

  useEffect(() => {
    let req;
    if (keyword) req = searchProducts(keyword, page);
    else if (categoryId) req = getProductsByCategory(categoryId, page);
    else req = getProducts(page);

    req.then((res) => {
      const data = res.data.data;
      setProducts(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    });
  }, [keyword, categoryId, page]);

  return (
    <div>
      <h2>Products</h2>
      <div>
        {categories.map((cat) => (
          <Link key={cat.id} to={`/products?categoryId=${cat.id}`}>{cat.name}</Link>
        ))}
      </div>
      <div>
        {products.map((p) => (
          <div key={p.id}>
            <Link to={`/products/${p.id}`}>
              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <p>{p.categoryName}</p>
            </Link>
          </div>
        ))}
      </div>
      <div>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i)} disabled={page === i}>{i + 1}</button>
        ))}
      </div>
    </div>
  );
}
