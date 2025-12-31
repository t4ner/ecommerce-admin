import { useState, useEffect, forwardRef, useCallback, useMemo } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { getAllCategories } from "@/lib/categoryApi";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import ImageUploadArea from "@/components/shared/ImageUploadArea";
import ImageGallery from "@/components/shared/ImageGallery";

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

  // 🖼️ Resim yükleme hook'u (Multiple)
  const { uploading, uploadMultiple } = useImageUpload({
    onSuccess: useCallback((imageUrl) => {
      // uploadMultiple zaten array döndürüyor, bu callback tek image için
    }, []),
    onError: useCallback((error) => {
      alert(error.message || "Resim yüklenirken bir hata oluştu");
    }, []),
  });

  // 🎯 Drag & Drop hook'u
  const { dragActive, handleDrag, handleDrop: handleDropBase } = useDragAndDrop(
    useCallback(
      async (files) => {
        const fileArray = Array.from(files);
        if (fileArray.length > 0) {
          const uploadedUrls = await uploadMultiple(fileArray);
          if (uploadedUrls.length > 0) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...uploadedUrls],
            }));
          }
        }
      },
      [uploadMultiple]
    )
  );

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
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

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
    }
  }, [editingProduct, isOpen]);

  // 🖱️ Dropdown dışına tıklanınca kapat
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  // 📝 Ürün adı değiştiğinde slug'ı otomatik oluştur
  const handleNameChange = useCallback((e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  }, []);

  // 📁 Dosya seçildiğinde
  const handleFileSelect = useCallback(
    async (files) => {
      const fileArray = Array.isArray(files) ? files : [files];
      if (fileArray.length > 0) {
        const uploadedUrls = await uploadMultiple(fileArray);
        if (uploadedUrls.length > 0) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...uploadedUrls],
          }));
        }
      }
    },
    [uploadMultiple]
  );

  // 🗑️ Resim sil
  const handleRemoveImage = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  // 📌 Seçili kategorinin adını bul
  const selectedCategoryName = useMemo(() => {
    if (!formData.category) return "Kategori Seçin";
    return (
      categories.find((cat) => cat._id === formData.category)?.name ||
      "Kategori Seçin"
    );
  }, [formData.category, categories]);

  // 🎯 Kategori seç
  const handleSelectCategory = useCallback((categoryId) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
    setIsDropdownOpen(false);
  }, []);

  // 💾 Formu gönder
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await onSubmit(formData);
    },
    [formData, onSubmit]
  );

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
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
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
                setFormData((prev) => ({ ...prev, description: e.target.value }))
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
                    setFormData((prev) => ({ ...prev, price: e.target.value }))
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
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
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
                      {categories.map((cat) => (
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
                      ))}
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
                  setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
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
                  setFormData((prev) => ({
                    ...prev,
                    isFeatured: !prev.isFeatured,
                  }))
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
          <ImageUploadArea
            imageUrl={null}
            uploading={uploading}
            dragActive={dragActive}
            onFileSelect={handleFileSelect}
            onDrag={handleDrag}
            onDrop={handleDropBase}
            multiple={true}
            recommendedSize="500 x 500 (1:1)"
            allowedTypes="PNG, JPG and GIF"
          />

          {/* Yüklenen Resimler */}
          <ImageGallery
            images={formData.images}
            onRemove={handleRemoveImage}
            showNumbers={true}
          />
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
