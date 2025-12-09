import Image from "next/image";

export default function AnnouncementCard({
  announcement, // Gösterilecek announcement
  index = 0, // Animasyon için sıra numarası
  onEdit, // Düzenleme fonksiyonu
  onDelete, // Silme fonksiyonu
}) {
  // Tarih formatla
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mb-4 font-[Parkinsans]">
      <div className="group relative flex items-start justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
        {/* 📝 Announcement Bilgileri */}
        <div className="flex flex-1 items-start gap-5">
          {/* 🎨 İkon */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-xl font-bold text-blue-600 shadow-md transition-transform group-hover:scale-105">
       <Image src="/announcement.svg" alt="Announcement" width={32} height={32} className="text-blue-600" unoptimized />
          </div>

          {/* 📋 Announcement Detayları */}
          <div className="flex-1 min-w-0">
            {/* Mesaj */}
            <div className="mb-3">
              <p className="text-lg font-semibold text-gray-900 leading-relaxed whitespace-pre-wrap">
                {announcement.message}
              </p>
            </div>
          </div>
        </div>

        {/* 🎯 Aksiyon Butonları */}
        <div className="flex gap-3">
          {/* Düzenle Butonu */}
          <button
            onClick={() => onEdit(announcement)}
            className="flex items-center justify-center rounded-2xl bg-orange-100 p-4 hover:bg-orange-200 cursor-pointer transition-colors"
          >
            <Image
              src="/edit.svg"
              alt="Edit"
              width={20}
              height={20}
              className="text-orange-600"
              unoptimized
            />
          </button>

          {/* Sil Butonu */}
          <button
            onClick={() => onDelete(announcement._id)}
            className="flex items-center justify-center rounded-2xl bg-red-100 p-4 hover:bg-red-200 cursor-pointer transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-700"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
