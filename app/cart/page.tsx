"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Trash2, ChevronLeft, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface CartItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedColors?: string[];
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({});
  const [clickTimestamps, setClickTimestamps] = useState<Record<string, number>>({});

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart(session.user?.email || "");
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session]);

  const fetchCart = async (email: string) => {
    try {
      const res = await fetch(`/api/cart?email=${email}`);
      if (!res.ok) throw new Error("Savatni yuklab bo'lmadi");
      
      const data = await res.json();
      
      let formattedCart: CartItem[] = [];
      
      if (Array.isArray(data)) {
        formattedCart = data;
      } else if (data.cart && Array.isArray(data.cart)) {
        formattedCart = data.cart.map((item: any) => ({
          _id: item._id || item.productId?._id,
          productId: item.productId?._id || item.productId,
          name: item.productId?.name || item.name,
          price: item.productId?.price || item.price,
          imageUrl: item.productId?.imageUrl || item.imageUrl,
          quantity: item.quantity,
          selectedColors: item.selectedColors || []
        }));
      } else {
        throw new Error("Noto'g'ri savat formati");
      }
      
      setCartItems(formattedCart);
      saveCartToLocal(formattedCart);
    } catch (error) {
      console.error("Savatni olishda xatolik:", error);
      toast.error("Savatni yuklab bo'lmadi");
      try {
        const localCart = localStorage.getItem('cart_backup');
        if (localCart) {
          setCartItems(JSON.parse(localCart));
        }
      } catch (e) {
        console.error("Local savatni olishda xatolik", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveCartToLocal = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart_backup', JSON.stringify(items));
    } catch (e) {
      console.warn("LocalStorage ga saqlab bo'lmadi", e);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!session?.user?.email) {
      toast.error("Iltimos, avval tizimga kiring");
      return;
    }

    setUpdatingItems(prev => ({ ...prev, [productId]: true }));
    try {
      const res = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          productId
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "O'chirishda xatolik");
      }

      setCartItems(prev => prev.filter(item => item.productId !== productId));
      toast.success("Mahsulot savatdan olib tashlandi");
      saveCartToLocal(cartItems.filter(item => item.productId !== productId));
    } catch (error) {
      console.error("O'chirishda xatolik:", error);
      toast.error(error instanceof Error ? error.message : "Mahsulotni o'chirib bo'lmadi");
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    const now = Date.now();
    if (clickTimestamps[productId] && now - clickTimestamps[productId] < 500) {
      return; // Ignore rapid clicks
    }
    setClickTimestamps(prev => ({ ...prev, [productId]: now }));

    if (!session?.user?.email) {
      toast.error("Iltimos, avval tizimga kiring");
      return;
    }

    // Validate quantity
    const parsedQuantity = Math.max(1, Math.floor(newQuantity));
    if (isNaN(parsedQuantity)) {
      toast.error("Noto'g'ri miqdor formati");
      return;
    }

    setUpdatingItems(prev => ({ ...prev, [productId]: true }));

    try {
      const res = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          productId,
          quantity: parsedQuantity
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Miqdorni yangilashda xatolik");
      }

      // Optimistic update
      setCartItems(prev => 
        prev.map(item =>
          item.productId === productId ? { ...item, quantity: parsedQuantity } : item
        )
      );
      saveCartToLocal(cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: parsedQuantity } : item
      ));
    } catch (error) {
      console.error("Xatolik:", error);
      toast.error(error instanceof Error ? error.message : "Miqdorni yangilab bo'lmadi");
      
      // Re-fetch cart data to ensure sync with server
      fetchCart(session.user.email);
    } finally {
      setUpdatingItems(prev => ({ ...prev, [productId]: false }));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Savat</h2>
        <p className="mb-4">Savatni ko'rish uchun tizimga kiring</p>
        <Link
          href="/sign-in"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Kirish
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Sizning savatingiz</h1>
      
      {!Array.isArray(cartItems) || cartItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">Savatingiz bo'sh</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Mahsulotlar sahifasiga o'tish
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-start p-4 border-b last:border-b-0 gap-4"
              >
                <div className="w-full sm:w-24 flex-shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-24 sm:w-24 sm:h-24 rounded-md object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product.jpg';
                    }}
                  />
                </div>
                
                <div className="flex-1 w-full">
                  <h3 className="font-medium text-lg">{item.name}</h3>
                  
                  {item.selectedColors && item.selectedColors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Tanlangan ranglar:</p>
                      <div className="flex flex-wrap gap-2">
                        {item.selectedColors.map((color, index) => (
                          <span
                            key={index}
                            className="w-5 h-5 rounded-full inline-block border border-gray-300"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-gray-800 font-medium mt-2">
                    {item.price.toLocaleString()} so'm
                  </p>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        const newQty = Math.max(1, item.quantity - 1);
                        updateQuantity(item.productId, newQty);
                      }}
                      disabled={updatingItems[item.productId] || item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                      aria-label="Kamaytirish"
                    >
                      -
                    </button>
                    
                    <div className="relative">
                      {updatingItems[item.productId] ? (
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      ) : (
                        <>
                          <span className="w-8 text-center block">{item.quantity}</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                updateQuantity(item.productId, value);
                              }
                            }}
                            disabled={updatingItems[item.productId]}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-text"
                          />
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={updatingItems[item.productId]}
                      className="w-8 h-8 flex items-center justify-center border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                      aria-label="Ko'paytirish"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    disabled={updatingItems[item.productId]}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                    aria-label="O'chirish"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full">
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Buyurtma xulosasi</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Jami ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} mahsulot):</span>
                  <span className="font-medium">{calculateTotal().toLocaleString()} so'm</span>
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    disabled={cartItems.length === 0 || Object.values(updatingItems).some(Boolean)}
                  >
                    Buyurtma berish
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mt-4">
                  Yetkazib berish va soliqlar buyurtma berish sahifasida hisoblanadi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}