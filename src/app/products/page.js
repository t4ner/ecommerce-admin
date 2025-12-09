"use client"; // Bu sayfa tarayıcıda çalışacak (client component)

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/productApi";
import ProductForm from "@/components/products/ProductForm";
import ProductList from "@/components/products/ProductList";

export default function ProductsPage() {
  // 📦 State Tanımlamaları - Verileri burada tutuyoruz
  const [products, setProducts] = useState([]); // Tüm ürünler
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [showForm, setShowForm] = useState(true); // Form açık mı?
  const [editingProduct, setEditingProduct] = useState(null); // Düzenlenen ürün
  const [formKey, setFormKey] = useState(0); // Form key - formu sıfırlamak için
  const formRef = useRef(null); // Form referansı

  // 🔄 Ürünleri API'den çeken fonksiyon
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
      alert("Ürünler yüklenemedi");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Component ilk yüklendiğinde ürünleri çek
  useEffect(() => {
    fetchProducts();
  }, []); // Boş array = sadece ilk yüklemede çalışır

  // ➕ Yeni ürün oluştur
  const handleCreate = async (formData) => {
    await createProduct(formData);
    await fetchProducts(); // Listeyi yenile
  };

  // ✏️ Ürün güncelle
  const handleUpdate = async (id, formData) => {
    await updateProduct(id, formData);
    await fetchProducts(); // Listeyi yenile
  };

  // 🗑️ Ürün sil
  const handleDelete = async (id) => {
    await deleteProduct(id);
    await fetchProducts(); // Listeyi yenile
  };

  // 📝 Düzenleme formunu aç
  const handleEdit = (product) => {
    setEditingProduct(product);
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
    const confirmed = confirm("Bu ürünü silmek istediğinize emin misiniz?");

    if (!confirmed) return; // Kullanıcı iptal etti

    try {
      await handleDelete(id);
    } catch (error) {
      alert(error.message || "Ürün silinemedi");
    }
  };

  // 💾 Form'dan gelen verileri kaydet
  const handleFormSubmit = async (formData) => {
    try {
      if (editingProduct) {
        // Düzenleme modu
        await handleUpdate(editingProduct._id, formData);
      } else {
        // Yeni oluşturma modu
        await handleCreate(formData);
      }

      // İşlem başarılı, formu sıfırla
      setEditingProduct(null);
      setFormKey((prev) => prev + 1); // Form key'ini değiştirerek formu sıfırla
    } catch (error) {
      alert(error.message || "Bir hata oluştu");
    }
  };

  // 🚪 Formu kapat
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  // ➕ Yeni ürün ekleme formunu aç/kapat (toggle)
  const handleToggleForm = () => {
    if (showForm) {
      // Form açıksa kapat
      setShowForm(false);
      setEditingProduct(null);
    } else {
      // Form kapalıysa aç
      setEditingProduct(null);
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
      {/* Yeni Ürün Ekle Butonu */}
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

      {/* Ürün Ekleme/Düzenleme Formu - Card üstünde */}
      <ProductForm
        key={formKey}
        ref={formRef}
        isOpen={showForm}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        editingProduct={editingProduct}
      />

      {/* Ürün Listesi */}
      {!loading && (
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
