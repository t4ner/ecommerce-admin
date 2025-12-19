export default function UserCard({
  user, // Gösterilecek kullanıcı
  index = 0, // Animasyon için sıra numarası
}) {
  // Tarih formatla
  const formatDate = (dateString) => {
    if (!dateString) return "Bilinmiyor";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // İsim baş harfini al
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mb-4 font-[Parkinsans]">
      <div className="group relative flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
        {/* 📝 Kullanıcı Bilgileri */}
        <div className="flex flex-1 items-center gap-5">
          {/* 🎨 Kullanıcı Avatar */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-black text-xl tracking-wider font-semibold text-white shadow-md transition-transform group-hover:scale-105">
            {getInitials(user.name)}
          </div>

          {/* 📋 Kullanıcı Detayları */}
          <div className="flex-1 min-w-0">
            {/* Kullanıcı adı ve email */}
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold tracking-wider text-gray-900">
                {user.name || "İsimsiz Kullanıcı"}
              </h3>
              {/* Role Badge */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium tracking-wider ${
                  user.role === "admin"
                    ? "bg-purple-50 text-purple-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    user.role === "admin" ? "bg-purple-500" : "bg-gray-400"
                  }`}
                />
                {user.role === "admin" ? "Admin" : "Kullanıcı"}
              </span>
            </div>

            {/* Email ve Diğer Bilgiler */}
            <div className="mt-2 flex items-center gap-4 flex-wrap">
              {/* Email */}
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium tracking-wider text-blue-700">
              
                {user.email}
              </span>

              {/* Oluşturulma Tarihi */}
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1 text-sm font-medium tracking-wider text-gray-700">
               
                {formatDate(user.createdAt)}
              </span>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

