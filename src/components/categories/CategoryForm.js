import { useState, useEffect, forwardRef } from "react";
import { generateSlug } from "@/utils/generateSlug";

const CategoryForm = forwardRef(function CategoryForm(
  { isOpen, onClose, onSubmit, editingCategory, allCategories },
  ref
) {
  // 📝 Form verilerini tutan state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    description: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 🔄 Form açıldığında veya düzenleme kategorisi değiştiğinde formu güncelle
  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name || "",
          slug: editingCategory.slug || "",
          parentId: editingCategory.parentId || "",
          description: editingCategory.description || "",
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          parentId: "",
          description: "",
        });
        setIsDropdownOpen(false);
      }
    }
  }, [editingCategory, isOpen]);

  // 🖱️ Dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  // 📝 Kategori adı değiştiğinde slug'ı otomatik oluştur
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      // Slug her zaman otomatik oluşturulur
      slug: generateSlug(name),
    }));
  };

  // 💾 Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // ⛔ Düzenlenen kategoriyi parent seçeneklerinden çıkar (kendinin altına taşınamaz)
  const availableCategories = allCategories.filter(
    (cat) => cat._id !== editingCategory?._id
  );

  // 📌 Seçili parent kategorinin adını bul
  const selectedCategoryName = formData.parentId
    ? allCategories.find((cat) => cat._id === formData.parentId)?.name ||
      "Ana Kategori"
    : "Ana Kategori";

  // 🎯 Parent kategori seç
  const handleSelectCategory = (categoryId) => {
    setFormData({ ...formData, parentId: categoryId });
    setIsDropdownOpen(false);
  };

  // Form kapalıysa hiçbir şey gösterme
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm "
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8">
        <div className="space-y-6">
          {/* 📝 Kategori Adı ve Üst Kategori */}
          <div className="grid grid-cols-2 gap-6">
            {/* Kategori Adı Input */}
            <div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full rounded-lg placeholder:text-gray-400  placeholder:tracking-wide  border border-gray-300 px-4 py-2.5 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                placeholder="Kategori Adı"
              />
            </div>

            {/* 📂 Üst Kategori Dropdown */}
            <div className="dropdown-container">
              <div className="relative">
                {/* Dropdown Butonu */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full rounded-lg border px-4 py-2.5 text-left transition-all ${
                    isDropdownOpen
                      ? "border-gray-900 ring-2 ring-gray-900/10"
                      : "border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={
                        formData.parentId ? "text-gray-900 tracking-wide" : "text-gray-400 tracking-wide"
                      }
                    >
                      {selectedCategoryName}
                    </span>
                    <svg
                      className={`h-4 w-4 text-gray-500 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>

                {/* 📋 Dropdown Menü */}
                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-xl">
                    <div className="max-h-64 overflow-y-auto">
                      {/* Ana Kategori seçeneği */}
                      <button
                        type="button"
                        onClick={() => handleSelectCategory("")}
                        className={`w-full px-4 py-3 text-left transition-colors ${
                          !formData.parentId
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>Ana Kategori</span>
                          {!formData.parentId && (
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </button>

                      {availableCategories.length > 0
                        ? availableCategories.map((cat) => (
                            <button
                              key={cat._id}
                              type="button"
                              onClick={() => handleSelectCategory(cat._id)}
                              className={`w-full px-4 py-3 text-left transition-colors ${
                                formData.parentId === cat._id
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{cat.name}</span>
                                {formData.parentId === cat._id && (
                                  <svg
                                    className="h-4 w-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                            </button>
                          ))
                        : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 🔗 Slug (URL dostu isim) - Otomatik oluşturulur */}
          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">
                /
              </span>
              <input
                type="text"
                required
                value={formData.slug}
                readOnly
                className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide  border border-gray-200 bg-gray-50 px-4 pl-7 py-2.5 font-mono text-gray-600 cursor-not-allowed"
                placeholder="kategori-slug"
              />
            </div>
          </div>

          {/* 📄 Açıklama */}
          <div>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              className="w-full resize-none rounded-lg placeholder:text-gray-400 placeholder:tracking-wide  border border-gray-300 p-3 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
              placeholder="Kategori Açıklaması"
            />
          </div>
        </div>

        {/* 🎯 Butonlar */}
        <div className="mt-8 flex items-center justify-end gap-2.5 text-sm tracking-wide">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50 cursor-pointer font-[Parkinsans]"
          >
            İptal
          </button>
          <button
            type="submit"
            className="rounded-lg  px-6 py-2.5 font-medium border cursor-pointer font-[Parkinsans]"
          >
            {editingCategory ? "Güncelle" : "Oluştur"}
          </button>
        </div>
      </form>
    </div>
  );
});

export default CategoryForm;
