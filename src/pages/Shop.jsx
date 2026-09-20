import { useEffect, useState } from "react";

const API_URL = "https://fakestoreapi.com/products";
const STORAGE_KEY = "brandku-shop-products";

function Shop() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    return savedProducts ? JSON.parse(savedProducts) : [];
  });
  const [isLoading, setIsLoading] = useState(products.length === 0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Gagal memuat produk");
        }

        const latestProducts = await response.json();
        setProducts(latestProducts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(latestProducts));
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (isLoading) {
    return <p className="px-4 py-12 text-center text-slate-600">Memuat produk...</p>;
  }

  if (error && products.length === 0) {
    return <p className="px-4 py-12 text-center text-red-600">{error}</p>;
  }

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
      {products.map((product) => (
        <article
          key={product.id}
          className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="flex h-56 items-center justify-center rounded-lg bg-slate-50 p-6">
            <img
              src={product.image}
              alt={product.title}
              className="h-full max-w-full object-contain"
            />
          </div>
          <h2 className="mt-4 line-clamp-2 font-semibold text-slate-900">
            {product.title}
          </h2>
          <p className="mt-2 text-lg font-bold text-emerald-600">
            ${product.price.toFixed(2)}
          </p>
        </article>
      ))}
    </main>
  );
}

export default Shop;