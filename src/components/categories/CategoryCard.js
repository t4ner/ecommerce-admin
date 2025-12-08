import Image from "next/image";

export default function CategoryCard({
  category, // Gösterilecek kategori
  level = 0, // Kategorinin derinlik seviyesi (alt kategori için)
  index = 0, // Animasyon için sıra numarası
  onEdit, // Düzenleme fonksiyonu
  onDelete, // Silme fonksiyonu
}) {
  // Alt kategori var mı kontrol et
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="mb-4 font-[Parkinsans]">
      <div
        className={`group relative flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300 ${
          level > 0 ? "ml-10" : "" // Alt kategori ise sağa kaydır
        }`}
      >
        {/* 🌲 Alt kategori ise bağlantı çizgisi göster */}
        {level > 0 && (
          <div className="absolute -left-10 top-1/2 flex items-center">
            {/* Yatay çizgi */}
            <div className="h-[2px] w-10 bg-linear-to-r from-gray-400 to-transparent rounded-full"></div>
          </div>
        )}

        {/* 📝 Kategori Bilgileri */}
        <div className="flex flex-1 items-center gap-5">
          {/* 🎨 Kategori Görseli veya İkonu */}
          {category.imageUrl ? (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-md ">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="h-full w-full object-fill"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
              {category.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* 📋 Kategori Detayları */}
          <div className="flex-1 min-w-0">
            {/* Kategori adı ve alt kategori sayısı */}
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>

              {/* Görünürlük durumu */}
              {category.isVisible !== undefined && (
                <span
                  className={`inline-flex items-center rounded-full p-1 text-xs font-medium ${
                    category.isVisible
                      ? "bg-green-400 text-green-700"
                      : "bg-red-400 text-red-700"
                  }`}
                >
                  {category.isVisible ? "" : ""}
                </span>
              )}

              {/* Alt kategori varsa göster */}
              {hasChildren && (
                <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                  {category.children.length} alt kategori
                </span>
              )}
            </div>

            {/* Slug ve açıklama */}
            <div className="mt-2 flex items-center gap-3 flex-wrap">
              {/* URL slug */}
              <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-xs font-mono text-gray-700">
                /{category.slug}
              </span>

              {/* Açıklama varsa göster */}
              {category.description && (
                <p className="text-sm tracking-wide text-gray-600 line-clamp-1 max-w-md ">
                  {category.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 🎯 Aksiyon Butonları */}
        <div className="flex gap-3">
          {/* Düzenle Butonu */}
          <button
            onClick={() => onEdit(category)}
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
            onClick={() => onDelete(category._id)}
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

      {/* 🔄 Alt Kategorileri Recursive (Özyinelemeli) Olarak Göster */}
      {/* Bu teknik önemli: CategoryCard kendini çağırarak alt kategorileri gösterir */}
      {hasChildren && (
        <div className="relative mt-4 ml-2 pl-8">
          {/* Dikey bağlantı çizgisi - Modern ve net görünüm */}
          <div className="absolute left-0 top-0 bottom-4 w-[3px] bg-gray-200 rounded-full"></div>

          {category.children.map((child, childIndex) => (
            <CategoryCard
              key={child._id}
              category={child}
              level={level + 1} // Seviye bir artırılır
              index={childIndex}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
