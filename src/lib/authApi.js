import apiClient from "./apiClient";
import useAuthStore from "@/store/authStore";

const API_BASE_URL = "/auth";

/**
 * Login işlemi
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{accessToken: string, user: object}>}
 */
export const login = async (email, password) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });

    // Backend response formatı: { data: { accessToken, user }, success: true }
    const { accessToken, user } = response.data.data || response.data;

    // Role kontrolü - Sadece admin kullanıcılar giriş yapabilir
    if (!user || user.role !== "admin") {
      throw new Error(
        "Bu panele erişim yetkiniz bulunmamaktadır. Sadece admin kullanıcılar giriş yapabilir."
      );
    }

    // Zustand store'a kaydet
    const store = useAuthStore.getState();
    store.login(accessToken, user);

    // refreshToken httpOnly cookie'de otomatik kaydedilir (backend tarafında)

    return { accessToken, user };
  } catch (error) {
    console.error("❌ Login error:", error);
    throw new Error(
      error.response?.data?.message ||
        "Giriş yapılamadı. Lütfen tekrar deneyin."
    );
  }
};

/**
 * Logout işlemi
 */
export const logout = async () => {
  try {
    // Backend'e logout isteği gönder (cookie'deki refreshToken'ı temizler)
    await apiClient.post(`${API_BASE_URL}/logout`);

    // Frontend store'u temizle
    const store = useAuthStore.getState();
    store.logout();

    // React Query cache'i temizle (eğer kullanıyorsanız)
    // queryClient.clear();

    // Login sayfasına yönlendir
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("❌ Logout error:", error);
    // Hata olsa bile frontend'i temizle
    const store = useAuthStore.getState();
    store.logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  }
};

/**
 * Token yenileme (genellikle interceptor'da otomatik kullanılır)
 * @returns {Promise<{accessToken: string, user: object}>}
 */
export const refreshToken = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/refresh`);

    const { accessToken, user } = response.data.data || response.data;

    // Store'u güncelle
    const store = useAuthStore.getState();
    store.setAccessToken(accessToken);
    if (user) {
      store.setUser(user);
    }

    return { accessToken, user };
  } catch (error) {
    console.error("❌ Refresh token error:", error);
    throw error;
  }
};

/**
 * Mevcut kullanıcı bilgilerini getir
 */
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/me`);
    const user = response.data.data || response.data;

    // Store'u güncelle
    const store = useAuthStore.getState();
    store.setUser(user);

    return user;
  } catch (error) {
    console.error("❌ Get current user error:", error);
    throw error;
  }
};
