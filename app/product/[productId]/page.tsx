"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Minus, Plus } from "lucide-react";
import { useSession } from "next-auth/react";

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  imageUrlv1: string;
  imageUrlv2: string;
  imageUrlv3: string;
  imageUrlv4: string;
  colors?: { name: string; hex: string }[];
}

export default function ProductPage() {
  const { productId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false); // << Modal state

  // Modalni Escape bilan yopish
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  useEffect(() => {
    if (!productId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/product/${productId}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          setSelectedImage(data.imageUrl);
          if (data.colors && data.colors.length > 0) {
            setSelectedColor(data.colors[0].name);
          }
        } else {
          setError(data.error || "Mahsulot topilmadi");
        }
      } catch (err) {
        setError("Server xatosi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId]);

  const addToCart = async () => {
    if (status !== "authenticated") {
      toast.warning("Iltimos, avval tizimga kiring", {
        action: { label: "Kirish", onClick: () => router.push("/sign-in") },
      });
      return;
    }

    if (!product) {
      toast.error("Mahsulot ma'lumotlari yuklanmadi!");
      return;
    }

    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Iltimos, rangni tanlang!");
      return;
    }

    setAddingToCart(true);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          productId: product._id,
          selectedColor: selectedColor || null,
          quantity,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Mahsulot savatga qo'shildi`);
        router.push("/cart");
      } else {
        toast.error(data.error || "Xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Tarmoq xatosi yoki serverga ulanib bo'lmadi!");
    } finally {
      setAddingToCart(false);
    }
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {error || "Mahsulot topilmadi"}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 max-w-7xl">
      <div className="bg-white rounded-lg shadow-md p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {/* Kattalasadigan rasm */}
          <div
            className="w-full h-96 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={selectedImage || product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnaillar */}
          <div className="grid grid-cols-4 gap-2">
            {[product.imageUrl, product.imageUrlv1, product.imageUrlv2, product.imageUrlv3, product.imageUrlv4]
              .filter(Boolean)
              .map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.name}
                  className={`w-full h-20 object-cover rounded-md cursor-pointer hover:opacity-80 ${
                    selectedImage === img ? "border-2 border-blue-600" : ""
                  }`}
                  onClick={() => setSelectedImage(img ?? null)}
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-blue-600 mb-6">
              {product.price.toLocaleString()} so'm
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
{/* 
            {product.colors?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ranglar</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`px-4 py-2 rounded-full border ${
                        selectedColor === color.name
                          ? "border-blue-600 bg-blue-100"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )} */}

            <div className="flex items-center mb-6">
              <h3 className="text-lg font-semibold mr-4">Miqdor:</h3>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={addToCart}
            disabled={addingToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition disabled:opacity-70"
          >
            {addingToCart ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Qo'shilyapti...
              </span>
            ) : (
              "Savatga qo'shish"
            )}
          </button>
        </div>
      </div>

      {/* 🖼 Modal rasm */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
            <button
        className="cursor-pointer absolute top-2 right-2 text-white text-2xl font-bold z-50"
        onClick={() => setIsModalOpen(false)}
      >
        ×
      </button>
          <img
            src={selectedImage || product.imageUrl}
            alt="Kattalashtirilgan rasm"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
