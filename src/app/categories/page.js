"use client"; // Bu sayfa tarayıcıda çalışacak (client component)

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  getAllCategories,
  getAllCategoriesTree,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categoryApi";
import CategoryForm from "@/components/categories/CategoryForm";
import CategoryList from "@/components/categories/CategoryList";

export default function CategoriesPage() {
  // 📦 State Tanımlamaları - Verileri burada tutuyoruz
  const [categories, setCategories] = useState([]); // Ağaç yapısındaki kategoriler
  const [allCategories, setAllCategories] = useState([]); // Tüm kategorilerin düz listesi
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [showForm, setShowForm] = useState(true); // Form açık mı?
  const [editingCategory, setEditingCategory] = useState(null); // Düzenlenen kategori
  const [formKey, setFormKey] = useState(0); // Form key - formu sıfırlamak için
  const formRef = useRef(null); // Form referansı

  // 🔄 Kategorileri API'den çeken fonksiyon
  const fetchCategories = async () => {
    try {
      setLoading(true);

      // Ağaç yapısındaki kategorileri al (gösterim için)
      const treeData = await getAllCategoriesTree();
      setCategories(treeData);

      // Düz liste halindeki kategorileri al (parent seçimi için)
      const flatData = await getAllCategories();
      setAllCategories(flatData);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      alert("Kategoriler yüklenemedi");
      setCategories([]);
      setAllCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Component ilk yüklendiğinde kategorileri çek
  useEffect(() => {
    fetchCategories();
  }, []); // Boş array = sadece ilk yüklemede çalışır

  // ➕ Yeni kategori oluştur
  const handleCreate = async (formData) => {
    await createCategory(formData);
    await fetchCategories(); // Listeyi yenile
  };

  // ✏️ Kategori güncelle
  const handleUpdate = async (id, formData) => {
    await updateCategory(id, formData);
    await fetchCategories(); // Listeyi yenile
  };

  // 🗑️ Kategori sil
  const handleDelete = async (id) => {
    await deleteCategory(id);
    await fetchCategories(); // Listeyi yenile
  };

  // 📝 Düzenleme formunu aç
  const handleEdit = (category) => {
    setEditingCategory(category);
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
      "Bu kategoriyi silmek istediğinize emin misiniz?"
    );

    if (!confirmed) return; // Kullanıcı iptal etti

    try {
      await handleDelete(id);
    } catch (error) {
      alert(error.message || "Kategori silinemedi");
    }
  };

  // 💾 Form'dan gelen verileri kaydet
  const handleFormSubmit = async (formData) => {
    try {
      if (editingCategory) {
        // Düzenleme modu
        await handleUpdate(editingCategory._id, formData);
      } else {
        // Yeni oluşturma modu
        await handleCreate(formData);
      }

      // İşlem başarılı, formu sıfırla
      setEditingCategory(null);
      setFormKey((prev) => prev + 1); // Form key'ini değiştirerek formu sıfırla
    } catch (error) {
      alert(error.message || "Bir hata oluştu");
    }
  };

  // 🚪 Formu kapat
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  // ➕ Yeni kategori ekleme formunu aç/kapat (toggle)
  const handleToggleForm = () => {
    if (showForm) {
      // Form açıksa kapat
      setShowForm(false);
      setEditingCategory(null);
    } else {
      // Form kapalıysa aç
      setEditingCategory(null);
      setShowForm(true);
    }
  };

  return (
    <div className="space-y-6 font-[Parkinsans]">
      {/* Yeni Kategori Ekle Butonu */}
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

      {/* Kategori Ekleme/Düzenleme Formu - Card üstünde */}
      <CategoryForm
        key={formKey}
        ref={formRef}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingCategory={editingCategory}
        allCategories={allCategories}
      />

      {/* Kategori Listesi */}
      {!loading && (
        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
