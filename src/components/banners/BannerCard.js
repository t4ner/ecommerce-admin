import Image from "next/image";

export default function BannerCard({
  banner, // Gösterilecek banner
  index = 0, // Animasyon için sıra numarası
  onEdit, // Düzenleme fonksiyonu
  onDelete, // Silme fonksiyonu
}) {
  return (
    <div className="mb-4 font-[Parkinsans]">
      <div className="group relative flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
        {/* 📝 Banner Bilgileri */}
        <div className="flex flex-1 items-center gap-5">
          {/* 🎨 Banner Görseli veya İkonu */}
          {banner.imageUrl ? (
            <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-md ">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="h-full w-full object-fill"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
              {banner.title.charAt(0).toUpperCase()}
            </div>
          )}

          {/* 📋 Banner Detayları */}
          <div className="flex-1 min-w-0">
            {/* Banner başlığı */}
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">
                {banner.title}
              </h3>
            </div>

            {/* Slug */}
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              {/* URL slug */}
              <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-xs font-mono text-gray-700">
                /{banner.slug}
              </span>
            </div>
          </div>
        </div>

        {/* 🎯 Aksiyon Butonları */}
        <div className="flex gap-2.5">
          {/* Düzenle Butonu */}
          <button
            onClick={() => onEdit(banner)}
            className="flex items-center gap-2 rounded-xl border border-black bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 cursor-pointer tracking-wide"
          >
            <Image
              src="/edit.svg"
              alt="Edit"
              width={20}
              height={20}
              className="h-5 w-5"
              unoptimized
            />
            Düzenle
          </button>

          {/* Sil Butonu */}
          <button
            onClick={() => onDelete(banner._id)}
            className="flex items-center gap-2 rounded-xl border border-red-500 bg-white px-5 py-2.5 text-sm font-medium  hover:bg-red-50 cursor-pointer tracking-wide"
          >
            <Image
              src="/delete.svg"
              alt="Delete"
              width={16}
              height={16}
              className="h-5 w-5"
              unoptimized
            />
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}
