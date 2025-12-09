import { useState, useEffect, forwardRef, useRef } from "react";
import { generateSlug } from "@/utils/generateSlug";
import axios from "axios";

const CampaignForm = forwardRef(function CampaignForm(
  { isOpen, onClose, onSubmit, editingCampaign },
  ref
) {
  // 📝 Form verilerini tutan state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    imageUrl: "",
  });

  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // 🔄 Form açıldığında veya düzenleme campaign değiştiğinde formu güncelle
  useEffect(() => {
    if (isOpen) {
      if (editingCampaign) {
        setFormData({
          name: editingCampaign.name || "",
          slug: editingCampaign.slug || "",
          imageUrl: editingCampaign.imageUrl || "",
        });
      } else {
        setFormData({
          name: "",
          slug: "",
          imageUrl: "",
        });
      }
      setUploading(false);
      setDragActive(false);
    }
  }, [editingCampaign, isOpen]);

  // 📝 Campaign adı değiştiğinde slug'ı otomatik oluştur
  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
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
          {/* 📝 Campaign Adı ve Slug - Yan Yana */}
          <div className="grid grid-cols-2 gap-6">
            {/* Campaign Adı */}
            <div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={handleNameChange}
                className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide border border-gray-300 px-4 py-2.5 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                placeholder="Kampanya Adı"
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
                  placeholder="kampanya-slug"
                />
              </div>
            </div>
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
                      1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are
                      allowed
                    </p>
                  </div>
                </div>
              )}
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

export default CampaignForm;
