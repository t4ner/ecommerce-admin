import { useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";

/**
 * Resim yükleme işlemlerini yöneten custom hook
 * @param {Object} options - Hook seçenekleri
 * @param {Function} options.onSuccess - Başarılı upload sonrası callback
 * @param {Function} options.onError - Hata durumunda callback
 * @param {string} options.acceptedTypes - Kabul edilen dosya tipleri
 * @returns {Object} Upload state ve fonksiyonları
 */
export function useImageUpload({ onSuccess, onError, acceptedTypes = "image/*" } = {}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Tek bir resim yükle
   */
  const uploadSingle = useCallback(async (file) => {
    if (!file) return null;

    // Dosya tipi kontrolü
    if (!file.type.startsWith("image/")) {
      const errorMsg = "Lütfen sadece resim dosyası yükleyin";
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      return null;
    }

    try {
      setUploading(true);
      setError(null);

      // FormData oluştur
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      // API'ye gönder
      const response = await apiClient.post("/upload/single", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Response'dan URL'i çıkar
      const imageUrl =
        response.data?.url ||
        response.data?.imageUrl ||
        response.data?.data?.url ||
        response.data?.data?.imageUrl ||
        (typeof response.data === "string" ? response.data : null);

      if (!imageUrl) {
        throw new Error("Response'da URL bulunamadı");
      }

      onSuccess?.(imageUrl);
      return imageUrl;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Resim yüklenirken bir hata oluştu";
      setError(errorMessage);
      onError?.(err);
      return null;
    } finally {
      setUploading(false);
    }
  }, [onSuccess, onError]);

  /**
   * Birden fazla resim yükle
   */
  const uploadMultiple = useCallback(async (files) => {
    if (!files || files.length === 0) return [];

    const uploadedUrls = [];
    const errors = [];

    try {
      setUploading(true);
      setError(null);

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          errors.push(`${file.name || "Dosya"}: Geçersiz dosya tipi`);
          continue;
        }

        try {
          // FormData oluştur
          const formDataUpload = new FormData();
          formDataUpload.append("image", file);

          // API'ye gönder
          const response = await apiClient.post("/upload/single", formDataUpload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Response'dan URL'i çıkar
          const imageUrl =
            response.data?.url ||
            response.data?.imageUrl ||
            response.data?.data?.url ||
            response.data?.data?.imageUrl ||
            (typeof response.data === "string" ? response.data : null);

          if (imageUrl) {
            uploadedUrls.push(imageUrl);
          } else {
            errors.push(`${file.name || "Dosya"}: URL alınamadı`);
          }
        } catch (err) {
          const errorMsg =
            err.response?.data?.message || err.message || "Yükleme hatası";
          errors.push(`${file.name || "Dosya"}: ${errorMsg}`);
        }
      }
    } finally {
      setUploading(false);
    }

    if (errors.length > 0) {
      const errorMessage = errors.join(", ");
      setError(errorMessage);
      onError?.(new Error(errorMessage));
    }

    return uploadedUrls;
  }, [onError]);

  return {
    uploading,
    error,
    uploadSingle,
    uploadMultiple,
  };
}

