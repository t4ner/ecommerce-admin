import axios from "axios";

const API_BASE_URL = "http://localhost:5858/api/campaigns";

/**
 * Tüm campaign'leri getir
 */
export const getAllCampaigns = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllCampaigns`);
    return response.data.data || [];
  } catch (error) {
    console.error("getAllCampaigns error:", error);
    throw error;
  }
};

/**
 * Yeni campaign oluştur
 */
export const createCampaign = async (campaignData) => {
  try {
    const payload = {
      ...campaignData,
    };
    console.log("📤 Gönderilen veri:", payload);

    const response = await axios.post(
      `${API_BASE_URL}/createCampaign`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ createCampaign error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(error.response?.data?.message || "Campaign oluşturulamadı");
  }
};

/**
 * Campaign güncelle
 */
export const updateCampaign = async (id, campaignData) => {
  try {
    const payload = {
      ...campaignData,
    };
    console.log("📤 Güncelleme verisi:", payload);

    const response = await axios.put(
      `${API_BASE_URL}/updateCampaign/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ updateCampaign error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(error.response?.data?.message || "Campaign güncellenemedi");
  }
};

/**
 * Campaign sil
 */
export const deleteCampaign = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteCampaign/${id}`);
    return response.data;
  } catch (error) {
    console.error("deleteCampaign error:", error);
    throw new Error(error.response?.data?.message || "Campaign silinemedi");
  }
};

/**
 * ID'ye göre campaign getir
 */
export const getCampaignById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getCampaignById/${id}`);
    return response.data.data || null;
  } catch (error) {
    console.error("getCampaignById error:", error);
    throw error;
  }
};

/**
 * Slug'a göre campaign getir
 */
export const getCampaignBySlug = async (slug) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getCampaignBySlug/${slug}`
    );
    return response.data.data || null;
  } catch (error) {
    console.error("getCampaignBySlug error:", error);
    throw error;
  }
};
