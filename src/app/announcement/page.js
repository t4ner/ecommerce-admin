"use client"; // Bu sayfa tarayıcıda çalışacak (client component)

import { useState, useEffect, useRef } from "react";
import {
  getAllAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/lib/announcementApi";
import AnnouncementForm from "@/components/announcements/AnnouncementForm";
import AnnouncementList from "@/components/announcements/AnnouncementList";

export default function AnnouncementPage() {
  // 📦 State Tanımlamaları - Verileri burada tutuyoruz
  const [announcements, setAnnouncements] = useState([]); // Tüm announcement'ler
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [showForm, setShowForm] = useState(true); // Form açık mı?
  const [editingAnnouncement, setEditingAnnouncement] = useState(null); // Düzenlenen announcement
  const [formKey, setFormKey] = useState(0); // Form key - formu sıfırlamak için
  const formRef = useRef(null); // Form referansı

  // 🔄 Announcement'leri API'den çeken fonksiyon
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAllAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error("Announcement'ler yüklenirken hata:", error);
      alert("Announcement'ler yüklenemedi");
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Component ilk yüklendiğinde announcement'leri çek
  useEffect(() => {
    fetchAnnouncements();
  }, []); // Boş array = sadece ilk yüklemede çalışır

  // ➕ Yeni announcement oluştur
  const handleCreate = async (formData) => {
    await createAnnouncement(formData);
    await fetchAnnouncements(); // Listeyi yenile
  };

  // ✏️ Announcement güncelle
  const handleUpdate = async (id, formData) => {
    await updateAnnouncement(id, formData);
    await fetchAnnouncements(); // Listeyi yenile
  };

  // 🗑️ Announcement sil
  const handleDelete = async (id) => {
    await deleteAnnouncement(id);
    await fetchAnnouncements(); // Listeyi yenile
  };

  // 📝 Düzenleme formunu aç
  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setShowForm(true);
    // Form açıldıktan sonra sayfanın başına scroll yap
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Alternatif: Sayfanın en üstüne scroll
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
  };

  // ❌ Silme işlemini onayla
  const handleDeleteConfirm = async (id) => {
    const confirmed = confirm("Bu duyuruyu silmek istediğinize emin misiniz?");

    if (!confirmed) return; // Kullanıcı iptal etti

    try {
      await handleDelete(id);
    } catch (error) {
      alert(error.message || "Announcement silinemedi");
    }
  };

  // 💾 Form'dan gelen verileri kaydet
  const handleFormSubmit = async (formData) => {
    try {
      if (editingAnnouncement) {
        // Düzenleme modu
        await handleUpdate(editingAnnouncement._id, formData);
      } else {
        // Yeni oluşturma modu
        await handleCreate(formData);
      }

      // İşlem başarılı, formu sıfırla
      setEditingAnnouncement(null);
      setFormKey((prev) => prev + 1); // Form key'ini değiştirerek formu sıfırla
    } catch (error) {
      alert(error.message || "Bir hata oluştu");
    }
  };

  // 🚪 Formu kapat
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAnnouncement(null);
  };

  // ➕ Yeni announcement ekleme formunu aç/kapat (toggle)
  const handleToggleForm = () => {
    if (showForm) {
      // Form açıksa kapat
      setShowForm(false);
      setEditingAnnouncement(null);
    } else {
      // Form kapalıysa aç
      setEditingAnnouncement(null);
      setShowForm(true);
      // Form açıldıktan sonra scroll yap
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 150);
    }
  };

  return (
    <div className="space-y-6 font-[Parkinsans]">
      {/* Yeni Announcement Ekle Butonu */}
      <div className="flex justify-end">
        <button
          onClick={handleToggleForm}
          className="flex items-center justify-center rounded-2xl bg-blue-100 p-4 hover:bg-blue-200 cursor-pointer transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-blue-600 transition-transform ${
              showForm ? "rotate-0" : "rotate-135"
            }`}
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Announcement Ekleme/Düzenleme Formu - Card üstünde */}
      <AnnouncementForm
        key={formKey}
        ref={formRef}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingAnnouncement={editingAnnouncement}
      />

      {/* Announcement Listesi */}
      {!loading && (
        <AnnouncementList
          announcements={announcements}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
