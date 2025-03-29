"use client";

import { ClerkProvider } from "@clerk/nextjs"; // Named import qilish kerak

export function Providers({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
