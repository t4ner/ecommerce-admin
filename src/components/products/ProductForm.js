import { useState, useEffect, forwardRef, useRef } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { getAllCategories } from "@/lib/categoryApi";
import axios from "axios";

const ProductForm = forwardRef(function ProductForm(
  { isOpen, onClose, onSubmit, editingProduct },
  ref
) {
  // 📝 Form verilerini tutan state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    images: [],
    category: "",
    subCategory: "",
    isActive: true,
    isFeatured: false,
    stock: "",
  });

  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // 🔄 Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Kategoriler yüklenemedi:", error);
      }
    };
    fetchCategories();
  }, []);

  // 🔄 Form açıldığında veya düzenleme ürünü değiştiğinde formu güncelle
  useEffect(() => {
    if (isOpen) {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || "",
          slug: editingProduct.slug || "",
          description: editingProduct.description || "",
          price: editingProduct.price || "",
          images: editingProduct.images || [],
          category:
            editingProduct.category?._id || editingProduct.category || "",
          subCategory: editingProduct.subCategory || "",
          isActive: editingProduct.isActive ?? true,
          isFeatured: editingProduct.isFeatured ?? false,
          stock: editingProduct.stock || "",
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          description: "",
          price: "",
          images: [],
          category: "",
          subCategory: "",
          isActive: true,
          isFeatured: false,
          stock: "",
        });
        setIsDropdownOpen(false);
      }
      setUploading(false);
      setDragActive(false);
    }
  }, [editingProduct, isOpen]);

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

  // 📝 Ürün adı değiştiğinde slug'ı otomatik oluştur
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  // 🖼️ Resim yükleme fonksiyonu (Multiple)
  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls = [];

      for (const file of files) {
        // Dosya tipi kontrolü
        if (!file.type.startsWith("image/")) {
          alert("Lütfen sadece resim dosyası yükleyin (PNG, JPG, GIF)");
          continue;
        }

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

        // Dönen URL'i al
        let imageUrl = null;

        if (response.data) {
          imageUrl =
            response.data.url ||
            response.data.imageUrl ||
            response.data.data?.url ||
            response.data.data?.imageUrl ||
            (typeof response.data === "string" ? response.data : null);
        }

        if (imageUrl) {
          uploadedUrls.push(imageUrl);
          console.log("✅ Resim URL'i kaydedildi:", imageUrl);
        } else {
          console.error("❌ Response'da URL bulunamadı:", response.data);
        }
      }

      // Yüklenen resimleri forma ekle
      if (uploadedUrls.length > 0) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...uploadedUrls],
        }));
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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleImageUpload(files);
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

    const files = Array.from(e.dataTransfer.files || []);
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  // 📂 Dosya seçici aç
  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // 🗑️ Resim sil
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // 📌 Seçili kategorinin adını bul
  const selectedCategoryName = formData.category
    ? categories.find((cat) => cat._id === formData.category)?.name ||
      "Kategori Seçin"
    : "Kategori Seçin";

  // 🎯 Kategori seç
  const handleSelectCategory = (categoryId) => {
    setFormData({ ...formData, category: categoryId });
    setIsDropdownOpen(false);
  };

  // 💾 Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
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
          {/* 📝 Ürün Adı ve Slug - Yan Yana */}
          <div className="grid grid-cols-2 gap-6">
            {/* Ürün Adı */}
            <div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide border border-gray-300 px-4 py-2.5 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                placeholder="Ürün Adı"
              />
            </div>

            {/* Slug (URL dostu isim) */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono">
                  /
                </span>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide border border-gray-300 px-4 pl-7 py-2.5 font-mono focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                  placeholder="urun-slug"
                />
              </div>
            </div>
          </div>

          {/* 📄 Açıklama */}
          <div>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide border border-gray-300 px-4 py-2.5 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
              placeholder="Ürün açıklaması..."
            />
          </div>

          {/* 💰 Fiyat, Stok ve Kategori - Yan Yana */}
          <div className="grid grid-cols-3 gap-6">
            {/* Fiyat */}
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                  ₺
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide border border-gray-300 px-4 pl-8 py-2.5 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                  placeholder="Fiyat"
                />
              </div>
            </div>

            {/* Stok */}
            <div>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide border border-gray-300 px-4 py-2.5 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                placeholder="Stok Adedi"
              />
            </div>

            {/* Kategori */}
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
                        formData.category
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
                      {categories.length > 0
                        ? categories.map((cat) => (
                            <button
                              key={cat._id}
                              type="button"
                              onClick={() => handleSelectCategory(cat._id)}
                              className={`w-full px-4 py-3 text-left transition-colors ${
                                formData.category === cat._id
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{cat.name}</span>
                                {formData.category === cat._id && (
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

          {/* 🎯 Aktif/Pasif ve Öne Çıkan - Minimal Toggle with Gradient */}
          <div className="grid grid-cols-2 gap-6">
            {/* Aktif/Pasif Toggle */}
            <div className="flex items-center justify-between rounded-lg bg-linear-to-br from-green-50 to-emerald-50 p-4 border border-green-100">
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-gray-900 cursor-pointer tracking-wide"
              >
                Ürün Aktif
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, isActive: !formData.isActive })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  formData.isActive
                    ? "bg-green-500 focus:ring-green-500"
                    : "bg-gray-200 focus:ring-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    formData.isActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Öne Çıkan Toggle */}
            <div className="flex items-center justify-between rounded-lg bg-linear-to-br from-yellow-50 to-amber-50 p-4 border border-yellow-100">
              <label
                htmlFor="isFeatured"
                className="text-sm font-medium text-gray-900 cursor-pointer tracking-wide"
              >
                Öne Çıkan Ürün
              </label>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    isFeatured: !formData.isFeatured,
                  })
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  formData.isFeatured
                    ? "bg-yellow-500 focus:ring-yellow-500"
                    : "bg-gray-200 focus:ring-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                    formData.isFeatured ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 🖼️ Resim Upload Alanı */}
          <div>
            {/* Gizli file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/gif"
              multiple
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
                      allowed (Multiple)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Yüklenen Resimler - Modern Grid */}
            {formData.images.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-medium text-gray-700">
                  Yüklenen Görseller ({formData.images.length})
                </p>
                <div className="grid grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div
                      key={index}
                      className="group relative aspect-square overflow-hidden rounded-xl border-2 border-gray-200 bg-gray-50 transition-all hover:border-gray-400 hover:shadow-lg"
                    >
                      {/* Resim */}
                      <img
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />

                      {/* Silme Butonu */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(index);
                        }}
                        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white opacity-0 shadow-lg transition-all hover:bg-red-600 group-hover:opacity-100"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>

                      {/* Resim Numarası */}
                      <div className="absolute bottom-2 left-2 rounded-lg bg-white bg-opacity-90 px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                        #{index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default ProductForm;
