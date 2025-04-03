"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Light from "../public/light.svg";
import OnButton from "../public/on-button.svg";
import Key from "../public/key.svg";
import Home from "../public/home.svg";

const menuItems = [
  { name: "Avtomatika", href: "/category/avtomatika", icon: Light },
  { name: "Elektr", href: "/category/elektr", icon: OnButton },
  { name: "Inzheneriya", href: "/category/inzheneriya", icon: Key },
  { name: "Qurilish", href: "/category/qurilish", icon: Home },
];

export default function NavigationMenu() {
  const pathname = usePathname();
  
  // Agar joriy sahifa admin panelda bo'lsa, menyuni ko'rsatma
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm">
      {/* Desktop menyu */}
      <div className="hidden lg:flex justify-center gap-8 py-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors ${pathname.startsWith(item.href) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <Image src={item.icon} alt={item.name} width={24} height={24} />
            <span className="text-sm font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Mobile tab bar */}
      <div className="lg:hidden flex overflow-x-auto scrollbar-hide px-2 py-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-4 py-2 rounded-lg mx-1 ${pathname.startsWith(item.href) ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <Image src={item.icon} alt={item.name} width={20} height={20} />
            <span className="text-xs whitespace-nowrap">{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}