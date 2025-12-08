"use client"; // Bu sayfa tarayıcıda çalışacak (client component)

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/lib/bannerApi";
import BannerForm from "@/components/banners/BannerForm";
import BannerList from "@/components/banners/BannerList";

export default function BannersPage() {
  // 📦 State Tanımlamaları - Verileri burada tutuyoruz
  const [banners, setBanners] = useState([]); // Tüm bannerlar
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [showForm, setShowForm] = useState(false); // Form açık mı?
  const [editingBanner, setEditingBanner] = useState(null); // Düzenlenen banner
  const formRef = useRef(null); // Form referansı

  // 🔄 Bannerları API'den çeken fonksiyon
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const data = await getAllBanners();
      setBanners(data);
    } catch (error) {
      console.error("Bannerlar yüklenirken hata:", error);
      alert("Bannerlar yüklenemedi");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Component ilk yüklendiğinde bannerları çek
  useEffect(() => {
    fetchBanners();
  }, []); // Boş array = sadece ilk yüklemede çalışır

  // ➕ Yeni banner oluştur
  const handleCreate = async (formData) => {
    await createBanner(formData);
    await fetchBanners(); // Listeyi yenile
  };

  // ✏️ Banner güncelle
  const handleUpdate = async (id, formData) => {
    await updateBanner(id, formData);
    await fetchBanners(); // Listeyi yenile
  };

  // 🗑️ Banner sil
  const handleDelete = async (id) => {
    await deleteBanner(id);
    await fetchBanners(); // Listeyi yenile
  };

  // 📝 Düzenleme formunu aç
  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setShowForm(true);
    // Form açıldıktan sonra forma scroll yap
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // ❌ Silme işlemini onayla
  const handleDeleteConfirm = async (id) => {
    const confirmed = confirm("Bu bannerı silmek istediğinize emin misiniz?");

    if (!confirmed) return; // Kullanıcı iptal etti

    try {
      await handleDelete(id);
    } catch (error) {
      alert(error.message || "Banner silinemedi");
    }
  };

  // 💾 Form'dan gelen verileri kaydet
  const handleFormSubmit = async (formData) => {
    try {
      if (editingBanner) {
        // Düzenleme modu
        await handleUpdate(editingBanner._id, formData);
      } else {
        // Yeni oluşturma modu
        await handleCreate(formData);
      }

      // İşlem başarılı, formu kapat
      setShowForm(false);
      setEditingBanner(null);
    } catch (error) {
      alert(error.message || "Bir hata oluştu");
    }
  };

  // 🚪 Formu kapat
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBanner(null);
  };

  // ➕ Yeni banner ekleme formunu aç/kapat (toggle)
  const handleToggleForm = () => {
    if (showForm) {
      // Form açıksa kapat
      setShowForm(false);
      setEditingBanner(null);
    } else {
      // Form kapalıysa aç
      setEditingBanner(null);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-6 font-[Parkinsans]">
      {/* Yeni Banner Ekle Butonu */}
      <div className="flex justify-end">
        <button
          onClick={handleToggleForm}
          className={`group flex items-center gap-2.5 rounded-2xl border bg-white px-5 py-3 text-sm font-medium transition-all hover:bg-gray-50 cursor-pointer ${
            showForm ? "text-gray-900 border-gray-900" : "text-gray-700"
          }`}
        >
          <Image
            src="/plus.svg"
            alt="Add"
            width={20}
            height={20}
            className={`h-4 w-4 transition-transform ${
              showForm ? "rotate-45" : "group-hover:rotate-90"
            }`}
            unoptimized
          />
        </button>
      </div>

      {/* Banner Ekleme/Düzenleme Formu - Card üstünde */}
      <BannerForm
        ref={formRef}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingBanner={editingBanner}
      />

      {/* Banner Listesi */}
      {!loading && (
        <BannerList
          banners={banners}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
