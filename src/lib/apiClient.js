import axios from "axios";
import useAuthStore from "@/store/authStore";

// Axios instance oluştur
const apiClient = axios.create({
  baseURL: "http://localhost:5858/api",
  withCredentials: true, // Cookie'ler için gerekli (refreshToken için)
  headers: {
    "Content-Type": "application/json",
  },
});

// Refresh işlemi için flag ve queue
let isRefreshing = false;
let failedQueue = [];

// Queue'daki request'leri işle
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor - Her istekte accessToken ekle
apiClient.interceptors.request.use(
  (config) => {
    // Zustand store'dan token al
    const store = useAuthStore.getState();
    const token = store?.accessToken || localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - 401 hatası geldiğinde token yenile
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 hatası ve daha önce retry edilmemişse
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Eğer zaten refresh işlemi devam ediyorsa, request'i queue'ya ekle
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token endpoint'ine istek gönder
        // Not: apiClient kullanmıyoruz çünkü bu zaten interceptor içinde,
        // ayrı bir axios instance kullanıyoruz
        const response = await axios.get(
          "http://localhost:5858/api/auth/refresh",
          {
            withCredentials: true, // Cookie'deki refreshToken otomatik gönderilir
          }
        );

        const { accessToken, user } = response.data.data || response.data;

        // Store'u güncelle
        const store = useAuthStore.getState();
        store.setAccessToken(accessToken);
        if (user) {
          store.setUser(user);
        }

        // Queue'daki tüm request'leri yeni token ile işle
        processQueue(null, accessToken);

        // Orijinal request'i yeni token ile tekrar dene
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh başarısız oldu, logout yap
        processQueue(refreshError, null);

        const store = useAuthStore.getState();
        store.clearAuth();

        // Login sayfasına yönlendir
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
