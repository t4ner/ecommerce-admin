"use client"; // Bu sayfa tarayıcıda çalışacak (client component)

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  getAllCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} from "@/lib/campaignApi";
import CampaignForm from "@/components/campaigns/CampaignForm";
import CampaignList from "@/components/campaigns/CampaignList";

export default function CampaignsPage() {
  // 📦 State Tanımlamaları - Verileri burada tutuyoruz
  const [campaigns, setCampaigns] = useState([]); // Tüm campaign'ler
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [showForm, setShowForm] = useState(true); // Form açık mı?
  const [editingCampaign, setEditingCampaign] = useState(null); // Düzenlenen campaign
  const [formKey, setFormKey] = useState(0); // Form key - formu sıfırlamak için
  const formRef = useRef(null); // Form referansı

  // 🔄 Campaign'leri API'den çeken fonksiyon
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getAllCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Campaign'ler yüklenirken hata:", error);
      alert("Campaign'ler yüklenemedi");
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Component ilk yüklendiğinde campaign'leri çek
  useEffect(() => {
    fetchCampaigns();
  }, []); // Boş array = sadece ilk yüklemede çalışır

  // ➕ Yeni campaign oluştur
  const handleCreate = async (formData) => {
    await createCampaign(formData);
    await fetchCampaigns(); // Listeyi yenile
  };

  // ✏️ Campaign güncelle
  const handleUpdate = async (id, formData) => {
    await updateCampaign(id, formData);
    await fetchCampaigns(); // Listeyi yenile
  };

  // 🗑️ Campaign sil
  const handleDelete = async (id) => {
    await deleteCampaign(id);
    await fetchCampaigns(); // Listeyi yenile
  };

  // 📝 Düzenleme formunu aç
  const handleEdit = (campaign) => {
    setEditingCampaign(campaign);
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
    const confirmed = confirm(
      "Bu campaign'i silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return; // Kullanıcı iptal etti

    try {
      await handleDelete(id);
    } catch (error) {
      alert(error.message || "Campaign silinemedi");
    }
  };

  // 💾 Form'dan gelen verileri kaydet
  const handleFormSubmit = async (formData) => {
    try {
      if (editingCampaign) {
        // Düzenleme modu
        await handleUpdate(editingCampaign._id, formData);
      } else {
        // Yeni oluşturma modu
        await handleCreate(formData);
      }

      // İşlem başarılı, formu sıfırla
      setEditingCampaign(null);
      setFormKey((prev) => prev + 1); // Form key'ini değiştirerek formu sıfırla
    } catch (error) {
      alert(error.message || "Bir hata oluştu");
    }
  };

  // 🚪 Formu kapat
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCampaign(null);
  };

  // ➕ Yeni campaign ekleme formunu aç/kapat (toggle)
  const handleToggleForm = () => {
    if (showForm) {
      // Form açıksa kapat
      setShowForm(false);
      setEditingCampaign(null);
    } else {
      // Form kapalıysa aç
      setEditingCampaign(null);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-6 font-[Parkinsans]">
      {/* Yeni Campaign Ekle Butonu */}
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

      {/* Campaign Ekleme/Düzenleme Formu - Card üstünde */}
      <CampaignForm
        key={formKey}
        ref={formRef}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingCampaign={editingCampaign}
      />

      {/* Campaign Listesi */}
      {!loading && (
        <CampaignList
          campaigns={campaigns}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
