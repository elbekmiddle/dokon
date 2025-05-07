"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../public/logo.svg";
import SearchIcon from "../public/serch.svg";
import { ShoppingCart, User, LogOut, LayoutDashboard, ListOrdered } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
    } & CustomUser;
  }
}
import { signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session } = useSession();
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const admin = session?.user?.role === "admin";

  return (
    <div className="relative">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        {/* Logo va sahifa nomi */}
        <nav className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Image className="w-6 h-6" src={Logo} alt="Logo" />
            <h2 className="text-lg font-bold text-gray-900">Qurilish mollari</h2>
          </Link>
        </nav>

        {/* Qidiruv va Savatcha */}
        {!isMobile && (
          <div className="flex items-center gap-4 w-full max-w-lg">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg gap-5 w-full">
              <Image src={SearchIcon} alt="Search" className="w-4 h-4" />
              <Input
                placeholder="Mahsulotni qidiring..."
                className="bg-transparent border-none outline-none focus:ring-0 px-2 text-sm text-gray-900 w-full"
              />
            </div>
          </div>
        )}

        {/* Foydalanuvchi Paneli */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-900" />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </Link>
          
          {session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 focus:outline-none"
              >
                {admin ? (
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <LayoutDashboard className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium">Admin</span>
                  </div>
                ) : session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100">
                  {admin ? (
                    <>
                      <Link
                        href="/admin"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                      <Link
                        href="/admin/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <ListOrdered className="w-4 h-4" />
                        Buyurtmalar
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <ListOrdered className="w-4 h-4" />
                      Mening buyurtmalarim
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Tizimdan chiqish
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/sign-in">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                Tizimga kirish
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}