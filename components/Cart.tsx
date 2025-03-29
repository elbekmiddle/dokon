"use client";

import { useState, useEffect } from "react";

const Cart = () => {
  interface CartItem {
    productId: string;
    name: string;
    price: number;
    imageUrl: string;
    quantity: number;
  }
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setUserEmail(storedEmail);
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      if (!userEmail) return;
      const res = await fetch(`/api/cart?email=${userEmail}`);
      const data = await res.json();
      setCartItems(data);
    };

    fetchCart();
  }, [userEmail]);

  const removeFromCart = async (productId: string) => {
    if (!userEmail) return;

    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, productId }),
    });

    setCartItems(cartItems.filter((item) => item.productId !== productId));
  };

  if (!userEmail) {
    return (
      <div className="text-center mt-10">
        <p className="text-lg font-semibold">Savatingizni ko`rish uchun tizimga kiring</p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">Tizimga kirish</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Savat</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item.productId} className="flex items-center justify-between border-b py-3">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md" />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600">
                  {item.quantity} × {item.price} so`m
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                O`chirish
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Savatingiz bo`sh</p>
      )}
    </div>
  );
};

export default Cart;
