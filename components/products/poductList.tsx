"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  if (loading)
    return <p className="text-center text-lg">⏳ Yuklanmoqda...</p>;
  if (error)
    return <p className="text-center text-red-500">❌ {error}</p>;
  if (products.length === 0)
    return <p className="text-center text-gray-500">📭 Mahsulotlar yo`q</p>;

  return (
    <div className="max-w-[960px] p-4 mx-auto">
      {/* Responsiv grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border p-4 rounded-lg shadow-md flex flex-col items-center"
          >
            <Link href={`/product/${product._id}`} className="block w-full">
              <div className="overflow-hidden rounded-xl">
                <img 
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-contain rounded-xl transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
              <div className="flex justify-between items-center w-full mt-2">
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <button className="text-gray-700 hover:text-blue-500">
                  <ShoppingCart className="w-6 h-6" />
                </button>
              </div>
              <p className="text-gray-600">{product.price} so`m</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
