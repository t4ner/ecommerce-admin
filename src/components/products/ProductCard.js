import Image from "next/image";

export default function ProductCard({
  product, // Gösterilecek ürün
  index = 0, // Animasyon için sıra numarası
  onEdit, // Düzenleme fonksiyonu
  onDelete, // Silme fonksiyonu
}) {
  return (
    <div className="mb-4 font-[Parkinsans]">
      <div className="group relative flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
        {/* 📝 Ürün Bilgileri */}
        <div className="flex flex-1 items-center gap-5">
          {/* 🎨 Ürün Görseli veya İkonu */}
          {product.images && product.images.length > 0 ? (
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-md">
              <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-fill"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-900 text-xl font-bold text-white shadow-md transition-transform group-hover:scale-105">
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* 📋 Ürün Detayları */}
          <div className="flex-1 min-w-0">
            {/* Ürün başlığı */}
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-gray-900">
                {product.name}
              </h3>
              {/* Öne Çıkan Yıldız */}
              {product.isFeatured && (
                <svg className="h-5 w-5 fill-yellow-500" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </div>

            {/* Slug ve Diğer Bilgiler */}
            <div className="mt-2 flex items-center gap-4 flex-wrap">
              {/* URL slug */}
              <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-sm font-mono text-gray-700">
                /{product.slug}
              </span>

              {/* Kategori */}
              {product.category?.name && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-green-50 px-3 py-1 text-sm font-medium tracking-wider text-green-700">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {product.category.name}
                </span>
              )}

              {/* Durum Badge */}
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-sm font-medium tracking-wider ${
                  product.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <span
                  className={`h-1 w-1 rounded-full ${
                    product.isActive ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
                {product.isActive ? "Aktif" : "Pasif"}
              </span>

              {/* Fiyat */}
              <span className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium tracking-wider text-blue-700">
                ₺
                {product.price
                  ? product.price.toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}
              </span>

              {/* Stok */}
              <span
                className={`inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium tracking-wider ${
                  (product.stock || 0) === 0
                    ? "bg-red-50 text-red-700"
                    : (product.stock || 0) < 10
                    ? "bg-orange-50 text-orange-700"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                Stok: {product.stock || 0}
              </span>

              {/* Görsel Sayısı */}
              {product.images && product.images.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-3 py-1 text-sm font-medium tracking-wider text-purple-700">
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {product.images.length} görsel
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 🎯 Aksiyon Butonları */}
        <div className="flex gap-3">
          {/* Düzenle Butonu */}
          <button
            onClick={() => onEdit(product)}
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
            onClick={() => onDelete(product._id)}
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
