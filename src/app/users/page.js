"use client"; // Bu sayfa tarayıcıda çalışacak (client component)

import { useState, useEffect } from "react";
import { getAllUsers } from "@/lib/userApi";
import UserList from "@/components/users/UserList";

export default function UsersPage() {
  // 📦 State Tanımlamaları - Verileri burada tutuyoruz
  const [users, setUsers] = useState([]); // Tüm kullanıcılar
  const [loading, setLoading] = useState(true); // Yükleme durumu

  // 🔄 Kullanıcıları API'den çeken fonksiyon
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
      alert(error.message || "Kullanıcılar yüklenemedi");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Component ilk yüklendiğinde kullanıcıları çek
  useEffect(() => {
    fetchUsers();
  }, []); // Boş array = sadece ilk yüklemede çalışır

  return (
    <div className="space-y-6 font-[Parkinsans]">
      {/* Başlık */}
      <div className="flex justify-end text-right items-center">
        <button
          onClick={fetchUsers}
          className="flex tracking-wider  items-center gap-2 rounded-2xl bg-blue-100 px-4 py-2 hover:bg-blue-200 cursor-pointer transition-colors text-blue-700 font-medium"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={loading ? "animate-spin" : ""}
          >
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" />
          </svg>
          {loading ? "Yükleniyor..." : "Yenile"}
        </button>
      </div>

      {/* Yükleme Durumu */}
      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Kullanıcılar yükleniyor...
          </p>
        </div>
      ) : (
        /* Kullanıcı Listesi */
        <UserList users={users} />
      )}
    </div>
  );
}
