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
          {/* 🎨 Kategori İkonu (İlk harf) */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
            {category.name.charAt(0).toUpperCase()}
          </div>

          {/* 📋 Kategori Detayları */}
          <div className="flex-1 min-w-0">
            {/* Kategori adı ve alt kategori sayısı */}
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>

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
        <div className="flex gap-2.5">
          {/* Düzenle Butonu */}
          <button
            onClick={() => onEdit(category)}
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
            onClick={() => onDelete(category._id)}
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
