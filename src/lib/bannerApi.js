import axios from "axios";

const API_BASE_URL = "http://localhost:5858/api/banners";

/**
 * Tüm bannerları getir
 */
export const getAllBanners = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllBanners`);
    return response.data.data || [];
  } catch (error) {
    console.error("getAllBanners error:", error);
    throw error;
  }
};

/**
 * Yeni banner oluştur
 */
export const createBanner = async (bannerData) => {
  try {
    const payload = {
      ...bannerData,
    };
    console.log("📤 Gönderilen veri:", payload);

    const response = await axios.post(`${API_BASE_URL}/createBanner`, payload);
    return response.data;
  } catch (error) {
    console.error("❌ createBanner error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(error.response?.data?.message || "Banner oluşturulamadı");
  }
};

/**
 * Banner güncelle
 */
export const updateBanner = async (id, bannerData) => {
  try {
    const payload = {
      ...bannerData,
    };
    console.log("📤 Güncelleme verisi:", payload);

    const response = await axios.put(
      `${API_BASE_URL}/updateBanner/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ updateBanner error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(error.response?.data?.message || "Banner güncellenemedi");
  }
};

/**
 * Banner sil
 */
export const deleteBanner = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteBanner/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteBanner error:", error);
    throw new Error(error.response?.data?.message || "Banner silinemedi");
  }
};
