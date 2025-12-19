import UserCard from "./UserCard";
import Image from "next/image";
export default function UserList({ users }) {
  // 📭 Kullanıcı yoksa boş durum mesajı göster
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-20 text-center">
        <p className="text-2xl font-medium text-gray-700">
          Henüz kullanıcı bulunmuyor.
        </p>
        <p className="mt-5 text-base text-gray-600">
          Kullanıcılar burada görüntülenecek
        </p>
      </div>
    );
  }

  // 📊 İstatistikler
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = users.filter((u) => u.role === "user").length;

  // 📋 Kullanıcıları listele
  return (
    <div className="space-y-6">
      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="tracking-wider font-medium text-gray-600">
                Toplam Kullanıcı
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {users.length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <Image src="/users.svg" alt="User" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="tracking-wider font-medium text-gray-600">Admin</p>
              <p className="text-2xl font-semibold text-purple-900 mt-1">
                {adminCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="tracking-wider font-medium text-gray-600">
                Kullanıcı
              </p>
              <p className="text-2xl font-semibold text-gray-900 mt-1">
                {userCount}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
              <Image src="/profile.svg" alt="User" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Kullanıcı Listesi */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Her kullanıcı için UserCard oluştur */}
        {users.map((user, index) => (
          <UserCard
            key={user._id} // React için benzersiz anahtar
            user={user} // Kullanıcı verisi
            index={index} // Sıra numarası
          />
        ))}
      </div>
    </div>
  );
}
