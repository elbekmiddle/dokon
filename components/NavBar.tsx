"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../public/logo.svg";
import SearchIcon from "../public/serch.svg";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/nextjs";

export default function NavBar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Mobil versiya uchun
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ClerkProvider>
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        {/* ✅ Logo & Bosh sahifa */}
        <nav className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image className="w-6 h-6" src={Logo} alt="Logo" />
            <h2 className="text-lg font-bold text-gray-900">Qurilish mollari</h2>
          </Link>
        </nav>

        {/* ✅ Qidiruv va Savatcha */}
        {!isMobile && (
          <div className="flex items-center gap-4">
            {/* 🔎 Qidiruv paneli */}
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
              <Image src={SearchIcon} alt="Search" className="w-4 h-4" />
              <Input
                placeholder="Mahsulotni qidiring..."
                className="bg-transparent border-none focus:ring-0 px-2 text-sm text-gray-900"
              />
            </div>

            {/* 🛒 Savat */}
            <Link href="/cart">
              <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold">
                Savatingiz
              </button>
            </Link>
          </div>
        )}

        {/* ✅ Foydalanuvchi Paneli */}
        <div className="flex items-center gap-4">
          {/* Agar foydalanuvchi kirmagan bo‘lsa */}
          <SignedOut>
            <SignInButton>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                Kirish
              </button>
            </SignInButton>
          </SignedOut>

          {/* Agar foydalanuvchi tizimga kirgan bo‘lsa */}
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </ClerkProvider>
  );
}
