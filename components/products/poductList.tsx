"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
  _id: number;
  name: string;
  price: number;
  imageUrl: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("Serverdan noto'g'ri javob");
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError("Mahsulotlarni yuklashda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = async (product: Product) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) throw new Error("Savatga qo`shishda xatolik");
      alert("✅ Mahsulot savatga qo`shildi!");
    } catch (error) {
      console.error("❌ Xatolik:", error);
      alert("Savatga qo`shishda muammo yuz berdi");
    }
  };

  if (loading)
    return <p className="text-center text-lg -mt-[600px]">⏳ Yuklanmoqda...</p>;
  if (error)
    return <p className="text-center text-red-500 -mt-[600px]">❌ {error}</p>;
  if (products.length === 0)
    return <p className="text-center text-gray-500 -mt-[600px]">📭 Mahsulotlar yo`q</p>;

  return (
    <div className="max-w-[960px] mx-auto p-6 -mt-[700px] m-auto ml-auto">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(258px,1fr))] gap-4">
        {products.map((product) => (
          <div key={product._id} className="border p-4 rounded-lg shadow-md">
            <Link href={`/product/${product._id}`}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full aspect-square rounded-xl"
              />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">{product.price} so`m</p>
            </Link>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Savatga qo`shish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
