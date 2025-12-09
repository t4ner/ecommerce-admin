import axios from "axios";

const API_BASE_URL = "http://localhost:5858/api/announcements";

/**
 * Tüm announcement'leri getir
 */
export const getAllAnnouncements = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllAnnouncements`);
    return response.data.data || [];
  } catch (error) {
    console.error("getAllAnnouncements error:", error);
    throw error;
  }
};

/**
 * Yeni announcement oluştur
 */
export const createAnnouncement = async (announcementData) => {
  try {
    const payload = {
      message: announcementData.message,
    };
    console.log("📤 Gönderilen veri:", payload);

    const response = await axios.post(
      `${API_BASE_URL}/createAnnouncement`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ createAnnouncement error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(
      error.response?.data?.message || "Announcement oluşturulamadı"
    );
  }
};

/**
 * Announcement güncelle
 */
export const updateAnnouncement = async (id, announcementData) => {
  try {
    const payload = {
      message: announcementData.message,
    };
    console.log("📤 Güncelleme verisi:", payload);

    const response = await axios.put(
      `${API_BASE_URL}/updateAnnouncement/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ updateAnnouncement error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(
      error.response?.data?.message || "Announcement güncellenemedi"
    );
  }
};

/**
 * Announcement sil
 */
export const deleteAnnouncement = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/deleteAnnouncement/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteAnnouncement error:", error);
    throw new Error(error.response?.data?.message || "Announcement silinemedi");
  }
};

/**
 * ID'ye göre announcement getir
 */
export const getAnnouncementById = async (id) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/getAnnouncementById/${id}`
    );
    return response.data.data || null;
  } catch (error) {
    console.error("getAnnouncementById error:", error);
    throw error;
  }
};
