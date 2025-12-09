import Image from "next/image";

export default function CampaignCard({
  campaign, // Gösterilecek campaign
  index = 0, // Animasyon için sıra numarası
  onEdit, // Düzenleme fonksiyonu
  onDelete, // Silme fonksiyonu
}) {
  return (
    <div className="mb-4 font-[Parkinsans]">
      <div className="group relative flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
        {/* 📝 Campaign Bilgileri */}
        <div className="flex flex-1 items-center gap-5">
          {/* 🎨 Campaign Görseli veya İkonu */}
          {campaign.imageUrl ? (
            <div className="flex h-16 w-28 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-md">
              <img
                src={campaign.imageUrl}
                alt={campaign.name}
                className="h-full w-full object-fill"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
              {campaign.name?.charAt(0).toUpperCase() || "C"}
            </div>
          )}

          {/* 📋 Campaign Detayları */}
          <div className="flex-1 min-w-0">
            {/* Campaign adı */}
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">
                {campaign.name}
              </h3>
            </div>

            {/* Slug */}
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              {/* URL slug */}
              <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-xs font-mono text-gray-700">
                /{campaign.slug}
              </span>
            </div>
          </div>
        </div>

        {/* 🎯 Aksiyon Butonları */}
        <div className="flex gap-3">
          {/* Düzenle Butonu */}
          <button
            onClick={() => onEdit(campaign)}
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
            onClick={() => onDelete(campaign._id)}
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
