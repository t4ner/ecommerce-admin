import apiClient from "./apiClient";

const API_BASE_URL = "/categories";

/**
 * Tüm kategorileri getir
 */
export const getAllCategories = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/getAllCategories`);
    // Backend {data: [...], success: true, message: "..."} formatında döndürüyor
    return response.data.data || [];
  } catch (error) {
    console.error("getAllCategories error:", error);
    throw error;
  }
};

/**
 * Ağaç yapısında tüm kategorileri getir
 */
export const getAllCategoriesTree = async () => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/getAllCategoriesTree`
    );
    // Backend {data: [...], success: true, message: "..."} formatında döndürüyor
    return response.data.data || [];
  } catch (error) {
    console.error("getAllCategoriesTree error:", error);
    throw error;
  }
};

/**
 * Yeni kategori oluştur
 */
export const createCategory = async (categoryData) => {
  try {
    const payload = {
      ...categoryData,
      parentId: categoryData.parentId || null,
    };
    console.log("📤 Gönderilen veri:", payload);

    const response = await apiClient.post(
      `${API_BASE_URL}/createCategory`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ createCategory error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(error.response?.data?.message || "Kategori oluşturulamadı");
  }
};

/**
 * Kategori güncelle
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const payload = {
      ...categoryData,
      parentId: categoryData.parentId || null,
    };
    console.log("📤 Güncelleme verisi:", payload);

    const response = await apiClient.put(
      `${API_BASE_URL}/updateCategory/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ updateCategory error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(error.response?.data?.message || "Kategori güncellenemedi");
  }
};

/**
 * Kategori sil
 */
export const deleteCategory = async (id) => {
  try {
    const response = await apiClient.delete(
      `${API_BASE_URL}/deleteCategory/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteCategory error:", error);
    throw new Error(error.response?.data?.message || "Kategori silinemedi");
  }
};
