import apiClient from "./apiClient";

const API_BASE_URL = "/products";

/**
 * Tüm ürünleri getir
 */
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/getAllProducts`);
    return response.data.data || [];
  } catch (error) {
    console.error("getAllProducts error:", error);
    throw error;
  }
};

/**
 * Yeni ürün oluştur
 */
export const createProduct = async (productData) => {
  try {
    // API formatına uygun payload oluştur
    const payload = {
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock) || 0,
      images: productData.images || [],
      category: productData.category || "",
      subCategory: productData.subCategory || "",
      isFeatured: productData.isFeatured || false,
      isActive: productData.isActive ?? true,
    };
    console.log("📤 Gönderilen veri:", payload);

    const response = await apiClient.post(
      `${API_BASE_URL}/createProduct`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ createProduct error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(error.response?.data?.message || "Ürün oluşturulamadı");
  }
};

/**
 * Ürün güncelle
 */
export const updateProduct = async (id, productData) => {
  try {
    // API formatına uygun payload oluştur
    const payload = {
      name: productData.name,
      slug: productData.slug,
      description: productData.description,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock) || 0,
      images: productData.images || [],
      category: productData.category || "",
      subCategory: productData.subCategory || "",
      isFeatured: productData.isFeatured || false,
      isActive: productData.isActive ?? true,
    };
    console.log("📤 Güncelleme verisi:", payload);

    const response = await apiClient.put(
      `${API_BASE_URL}/updateProduct/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ updateProduct error:", error);
    console.error("❌ Hata detayı:", error.response?.data);
    console.error("❌ Status kod:", error.response?.status);
    throw new Error(error.response?.data?.message || "Ürün güncellenemedi");
  }
};

/**
 * Ürün sil
 */
export const deleteProduct = async (id) => {
  try {
    const response = await apiClient.delete(
      `${API_BASE_URL}/deleteProduct/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("deleteProduct error:", error);
    throw new Error(error.response?.data?.message || "Ürün silinemedi");
  }
};

/**
 * Slug'a göre ürün getir
 */
export const getProductBySlug = async (slug) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/getProductBySlug/${slug}`
    );
    return response.data.data || null;
  } catch (error) {
    console.error("getProductBySlug error:", error);
    throw error;
  }
};

/**
 * ID'ye göre ürün getir
 */
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(
      `${API_BASE_URL}/getProductById/${id}`
    );
    return response.data.data || null;
  } catch (error) {
    console.error("getProductById error:", error);
    throw error;
  }
};

/**
 * Sadece aktif ürünleri getir
 */
export const getActiveProducts = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/getActiveProducts`);
    return response.data.data || [];
  } catch (error) {
    console.error("getActiveProducts error:", error);
    throw error;
  }
};

/**
 * Öne çıkan ürünleri getir
 */
export const getFeaturedProducts = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/getFeaturedProducts`);
    return response.data.data || [];
  } catch (error) {
    console.error("getFeaturedProducts error:", error);
    throw error;
  }
};
