"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  // Login sayfasında sidebar gösterme
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Diğer sayfalarda sidebar ile birlikte göster
  return (
    <div className="flex max-h-screen overflow-hidden bg-[#eeeef2]">
      <Sidebar />
      <div className="flex w-full max-h-screen flex-col overflow-hidden py-5 pr-5">
        <main className="h-full w-full overflow-auto rounded-xl border-2 border-gray-300 bg-white p-7 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}
