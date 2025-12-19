import apiClient from "./apiClient";

const API_BASE_URL = "/auth";

/**
 * Tüm kullanıcıları getir
 * @returns {Promise<Array>} Kullanıcı listesi
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/users`);
    
    // Backend response formatı: { success: true, message: "...", data: [...] }
    const users = response.data.data || [];
    
    return users;
  } catch (error) {
    console.error("❌ Get users error:", error);
    throw new Error(
      error.response?.data?.message || "Kullanıcılar yüklenemedi"
    );
  }
};

