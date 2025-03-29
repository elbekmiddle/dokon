"use client";

import { useEffect, useState } from "react";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
      fetchCart(storedEmail);
    }
  }, []);

  const fetchCart = async (email: string) => {
    const res = await fetch(`/api/cart?email=${email}`);
    const data = await res.json();
    setCartItems(data);
  };

  // if (!userEmail) {
  //   return (
  //     <div className="text-center -mt-[500px]">
  //       <p className="text-lg font-semibold">Savatingizni ko`rish uchun tizimga kiring</p>
  //       <a href="/login">
  //         <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg">
  //           Tizimga kirish
  //         </button>
  //       </a>
  //     </div>
  //   );
  // }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg -mt-[680px]">
      <h2 className="text-2xl font-bold mb-4">Savat</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item._id} className="flex items-center justify-between border-b py-3">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md" />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p className="text-gray-600">1 × {item.price} so`m</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">Savatingiz bo`sh</p>
      )}
    </div>
  );
}
