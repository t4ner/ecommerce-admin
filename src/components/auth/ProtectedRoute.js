"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, accessToken } = useAuthStore();

  useEffect(() => {
    // Login sayfasındaysa kontrol etme
    if (pathname === "/login") {
      // Eğer zaten giriş yapılmışsa dashboard'a yönlendir
      if (isAuthenticated || accessToken) {
        router.push("/dashboard");
      }
      return;
    }

    // Diğer sayfalarda auth kontrolü
    const token = accessToken || localStorage.getItem("accessToken");
    if (!token && pathname !== "/login") {
      router.push("/login");
    }
  }, [isAuthenticated, accessToken, pathname, router]);

  // Login sayfasındaysa direkt göster
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Token yoksa loading göster (yönlendirme yapılırken)
  const token =
    accessToken ||
    (typeof window !== "undefined"
      ? localStorage.getItem("accessToken")
      : null);
  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
