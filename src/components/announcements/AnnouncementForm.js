import { useState, useEffect, forwardRef } from "react";

const AnnouncementForm = forwardRef(function AnnouncementForm(
  { isOpen, onClose, onSubmit, editingAnnouncement },
  ref
) {
  // 📝 Form verilerini tutan state
  const [formData, setFormData] = useState({
    message: "",
  });

  // 🔄 Form açıldığında veya düzenleme announcement değiştiğinde formu güncelle
  useEffect(() => {
    if (isOpen) {
      if (editingAnnouncement) {
        setFormData({
          message: editingAnnouncement.message || "",
        });
      } else {
        setFormData({
          message: "",
        });
      }
    }
  }, [editingAnnouncement, isOpen]);

  // 💾 Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Form kapalıysa hiçbir şey gösterme
  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="mb-6 rounded-2xl border border-gray-100 bg-white shadow-sm "
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8">
        <div className="space-y-6">
          {/* 📝 Mesaj */}
          <div>
            <textarea
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              rows={1}
              required
              className="w-full rounded-lg placeholder:text-gray-400 placeholder:tracking-wide border border-gray-300 px-4 py-2.5 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 focus:outline-none"
              placeholder="Duyuru mesajınızı buraya yazın..."
            />
          </div>
        </div>

        {/* 🎯 Butonlar */}
        <div className="mt-8 flex items-center justify-end gap-3">
          {/* İptal Butonu */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-2xl bg-gray-100 p-4 hover:bg-gray-200 cursor-pointer transition-colors"
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
              className="text-gray-700"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Kaydet Butonu */}
          <button
            type="submit"
            className="flex items-center justify-center rounded-2xl bg-green-100 p-4 hover:bg-green-200 cursor-pointer transition-colors"
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
              className="text-green-600"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
});

export default AnnouncementForm;
