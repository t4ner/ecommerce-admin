import ProductCard from "./ProductCard";

export default function ProductList({ products, onEdit, onDelete }) {
  // 📭 Ürün yoksa boş durum mesajı göster
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-20 text-center">
        <p className="text-2xl font-medium text-gray-700">
          Henüz ürün eklenmemiş.
        </p>
        <p className="mt-5 text-base text-gray-600">
          İlk ürününüzü oluşturmak için yukarıdaki + butonuna tıklayın
        </p>
      </div>
    );
  }

  // 📋 Ürünleri listele
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Her ürün için ProductCard oluştur */}
      {products.map((product, index) => (
        <ProductCard
          key={product._id} // React için benzersiz anahtar
          product={product} // Ürün verisi
          index={index} // Sıra numarası
          onEdit={onEdit} // Düzenleme fonksiyonu
          onDelete={onDelete} // Silme fonksiyonu
        />
      ))}
    </div>
  );
}
