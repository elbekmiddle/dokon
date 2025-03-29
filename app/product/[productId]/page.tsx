"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
}

export default function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    fetch(`/api/product/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Server xatosi");
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    setUserEmail(storedEmail);
  }, []);

  const addToCart = async () => {
    if (!userEmail) {
      toast.warn("Iltimos, tizimga kiring!", { position: "top-center" });
      return;
    }

    if (!product) return;

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, productId: product._id }),
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Mahsulot savatga qo`shildi!", { position: "top-center" });
    } else {
      toast.error(data.error || "Xatolik yuz berdi!", { position: "top-center" });
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p>Xatolik: {error}</p>;
  if (!product) return <p>Mahsulot topilmadi</p>;

  return (
    <div className="px-40 flex flex-1 justify-center py-5 -mt-[725px] m-auto ml-8">
      <ToastContainer />
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap gap-2 p-4">
          <a className="text-[#637588] text-base font-medium leading-normal" href="#">
            Qurilish materiallari
          </a>
          <span className="text-[#637588] text-base font-medium leading-normal"> / </span>
          <span className="text-[#111418] text-base font-medium leading-normal">
            {product.name}
          </span>
        </div>

        <div className="flex w-full grow bg-white @container p-4">
          <div className="w-full gap-1 overflow-hidden bg-white @[480px]:gap-2 aspect-[3/2] rounded-xl grid grid-cols-[2fr_1fr_1fr]">
            <div className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none row-span-2">
              <img className="max-w-[300px] rounded-xl h-full w-full" src={product.imageUrl} alt={product.name} />
            </div>
            <div className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none">
              <img className="max-w-[300px] h-auto rounded-xl" src={product.imageUrlv1} alt={product.name} />
            </div>
            <div className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none">
              <img className="max-w-[300px] h-auto rounded-xl" src={product.imageUrlv2} alt={product.name} />
            </div>
            <div className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none">
              <img className="max-w-[300px] h-auto rounded-xl" src={product.imageUrlv3} alt={product.name} />
            </div>
            <div className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none">
              <img className="max-w-[300px] h-auto rounded-xl" src={product.imageUrlv4} alt={product.name} />
            </div>
          </div>
        </div>

        <h2 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
          {product.name}
        </h2>
        <h1 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 text-left pb-3 pt-5">
          {product.price} so`m
        </h1>
        <p className="text-[#111418] text-base font-normal leading-normal pb-3 pt-1 px-4">
          {product.description}
        </p>
        <div className="flex px-4 py-3">
          <button
            onClick={addToCart}
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 bg-[#1980e6] text-white text-sm font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Savatga qo'shish</span>
          </button>
        </div>
      </div>
    </div>
  );
}
