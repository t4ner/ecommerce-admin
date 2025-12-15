import { useState, useEffect, forwardRef, useRef } from "react";
import { generateSlug } from "@/utils/generateSlug";
import axios from "axios";

const CategoryForm = forwardRef(function CategoryForm(
  { isOpen, onClose, onSubmit, editingCategory, allCategories = [] },
  ref
) {
  // 📝 Form verilerini tutan state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parentId: "",
    description: "",
    isVisible: false,
    imageUrl: "",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // 🔄 Form açıldığında veya düzenleme kategorisi değiştiğinde formu güncelle
  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name || "",
          slug: editingCategory.slug || "",
          parentId: editingCategory.parentId || "",
          description: editingCategory.description || "",
          isVisible:
            editingCategory.isVisible !== undefined
              ? editingCategory.isVisible
              : false,
          imageUrl: editingCategory.imageUrl || "",
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          parentId: "",
          description: "",
          isVisible: true,
          imageUrl: "",
        });
        setIsDropdownOpen(false);
      }
      setUploading(false);
      setDragActive(false);
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

  // 🖼️ Resim yükleme fonksiyonu
  const handleImageUpload = async (file) => {
    if (!file) return;

    // Dosya tipi kontrolü
    if (!file.type.startsWith("image/")) {
      alert("Lütfen sadece resim dosyası yükleyin (PNG, JPG, GIF)");
      return;
    }

    try {
      setUploading(true);

      // FormData oluştur
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      // API'ye gönder
      const response = await axios.post(
        "http://localhost:5858/api/upload/single",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("📸 Upload Response:", response.data);

      // Dönen URL'i forma yaz - Farklı response formatlarını kontrol et
      let imageUrl = null;

      if (response.data) {
        // Backend'den gelen farklı response formatlarını kontrol et
        imageUrl =
          response.data.url ||
          response.data.imageUrl ||
          response.data.data?.url ||
          response.data.data?.imageUrl ||
          (typeof response.data === "string" ? response.data : null);
      }

      if (imageUrl) {
        setFormData((prev) => ({
          ...prev,
          imageUrl: imageUrl,
        }));
        console.log("✅ Resim URL'i kaydedildi:", imageUrl);
      } else {
        console.error("❌ Response'da URL bulunamadı:", response.data);
        alert(
          "Resim yüklendi ancak URL alınamadı. Response formatı kontrol edilmeli."
        );
      }
    } catch (error) {
      console.error("❌ Resim yükleme hatası:", error);
      console.error("❌ Hata detayı:", error.response?.data);
      alert(
        error.response?.data?.message ||
          error.message ||
          "Resim yüklenirken bir hata oluştu"
      );
    } finally {
      setUploading(false);
    }
  };

  // 📁 Dosya seçildiğinde
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // 🎯 Drag & Drop işlemleri
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // 📂 Dosya seçici aç
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // 💾 Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // ⛔ Düzenlenen kategoriyi parent seçeneklerinden çıkar (kendinin altına taşınamaz)
  const availableCategories = (allCategories || []).filter(
    (cat) => cat._id !== editingCategory?._id
  );

  // 📌 Seçili parent kategorinin adını bul
  const selectedCategoryName = formData.parentId
    ? (allCategories || []).find((cat) => cat._id === formData.parentId)
        ?.name || "Ana Kategori"
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
                        formData.parentId
                          ? "text-gray-900 tracking-wide"
                          : "text-gray-400 tracking-wide"
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

          {/* 🖼️ Resim Upload Alanı */}
          <div>
            {/* Gizli file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Drag & Drop Alanı */}
            <div
              onClick={handleClickUpload}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all cursor-pointer ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
                  <p className="text-sm text-gray-600">Yükleniyor...</p>
                </div>
              ) : formData.imageUrl ? (
                <div className="flex flex-col items-center gap-4">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="max-h-48 rounded-lg object-cover"
                  />
                  <p className="text-sm text-gray-600">
                    Resmi değiştirmek için tıklayın
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <svg
                    className="h-16 w-16 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-700">
                      Drop your images here, or{" "}
                      <span className="text-blue-500">click to browse</span>
                    </p>
                    <p className="mt-3 text-gray-500">
                      500 x 500 (1:1) recommended. PNG, JPG and GIF files are
                      allowed
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 👁️ Görünürlük */}
          <div className="rounded-2xl border border-[#DCFFDC] bg-[#F0FFF0] p-4 w-[50%]">
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium tracking-wide">
               Popüler Kategorilerde Göster
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVisible}
                  onChange={(e) =>
                    setFormData({ ...formData, isVisible: e.target.checked })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-900/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#66CC33]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* 🎯 Butonlar */}
        <div className="mt-8 flex items-center justify-end gap-3">
          {/* İptal Butonu */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-2xl bg-gray-100 p-4 hover:bg-gray-200 cursor-pointer transition-colors"
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
              className="text-gray-700"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Kaydet Butonu */}
          <button
            type="submit"
            className="flex items-center justify-center rounded-2xl bg-green-100 p-4 hover:bg-green-200 cursor-pointer transition-colors"
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
              className="text-green-600"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
});

export default CategoryForm;
