import CategoryCard from "./CategoryCard";

export default function CategoryList({ categories, onEdit, onDelete }) {
  // 📭 Kategori yoksa boş durum mesajı göster
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-20 text-center">
        <p className="text-lg font-semibold text-gray-700">
          Henüz kategori eklenmemiş.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          İlk kategorinizi oluşturmak için yukarıdaki + butonuna tıklayın
        </p>
      </div>
    );
  }

  // 📋 Kategorileri listele
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Her kategori için CategoryCard oluştur */}
      {categories.map((category, index) => (
        <CategoryCard
          key={category._id} // React için benzersiz anahtar
          category={category} // Kategori verisi
          level={0} // Ana kategori seviyesi
          index={index} // Sıra numarası
          onEdit={onEdit} // Düzenleme fonksiyonu
          onDelete={onDelete} // Silme fonksiyonu
        />
      ))}
    </div>
  );
}
