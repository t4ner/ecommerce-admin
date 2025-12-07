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
  const [showForm, setShowForm] = useState(false); // Form açık mı?
  const [editingCategory, setEditingCategory] = useState(null); // Düzenlenen kategori
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

      // İşlem başarılı, formu kapat
      setShowForm(false);
      setEditingCategory(null);
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

      {/* Kategori Ekleme/Düzenleme Formu - Card üstünde */}
      <CategoryForm
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
