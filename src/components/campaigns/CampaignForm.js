import { useState, useEffect, forwardRef, useCallback } from "react";
import { generateSlug } from "@/utils/generateSlug";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import ImageUploadArea from "@/components/shared/ImageUploadArea";

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

  // 🖼️ Resim yükleme hook'u
  const { uploading, uploadSingle } = useImageUpload({
    onSuccess: useCallback((imageUrl) => {
      setFormData((prev) => ({ ...prev, imageUrl }));
    }, []),
    onError: useCallback((error) => {
      alert(error.message || "Resim yüklenirken bir hata oluştu");
    }, []),
  });

  // 🎯 Drag & Drop hook'u
  const { dragActive, handleDrag, handleDrop: handleDropBase } = useDragAndDrop(
    useCallback((files) => {
      const file = files[0];
      if (file) {
        uploadSingle(file);
      }
    }, [uploadSingle])
  );

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
    }
  }, [editingCampaign, isOpen]);

  // 📝 Campaign adı değiştiğinde slug'ı otomatik oluştur
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
    (file) => {
      if (file) {
        uploadSingle(file);
      }
    },
    [uploadSingle]
  );

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
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide border border-gray-300 px-4 pl-7 py-2.5 font-mono focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
                  placeholder="kampanya-slug"
                />
              </div>
            </div>
          </div>

          {/* 🖼️ Resim Upload Alanı */}
          <ImageUploadArea
            imageUrl={formData.imageUrl}
            uploading={uploading}
            dragActive={dragActive}
            onFileSelect={handleFileSelect}
            onDrag={handleDrag}
            onDrop={handleDropBase}
            recommendedSize="1550 x 700 (2.2:1)"
            allowedTypes="PNG, JPG, GIF and WEBP"
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

export default CampaignForm;
