/**
 * ProductImage — renders a product image with:
 * - lazy loading for performance
 * - onError fallback to a reliable placeholder (no infinite loop)
 * - consistent sizing via className prop
 */

// Reliable fallback from picsum.photos — always returns a real image
const FALLBACK_URL = 'https://picsum.photos/seed/product/400/400';

export default function ProductImage({ src, alt, className = 'w-full h-full object-cover' }) {
  const handleError = (e) => {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = FALLBACK_URL;
  };

  return (
    <img
      src={src || FALLBACK_URL}
      alt={alt || 'Product'}
      loading="lazy"
      onError={handleError}
      className={className}
    />
  );
}
