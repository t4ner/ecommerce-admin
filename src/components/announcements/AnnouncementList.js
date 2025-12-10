import AnnouncementCard from "./AnnouncementCard";

export default function AnnouncementList({ announcements, onEdit, onDelete }) {
  // 📭 Announcement yoksa boş durum mesajı göster
  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-20 text-center">
        <p className="text-2xl font-medium text-gray-700">
          Henüz duyuru eklenmemiş.
        </p>
        <p className="mt-5 text-base text-gray-600">
          İlk duyurunuzu oluşturmak için yukarıdaki + butonuna tıklayın
        </p>
      </div>
    );
  }

  // 📋 Announcement'leri listele - 2 sütunlu grid
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-6">
        {/* Her announcement için AnnouncementCard oluştur */}
        {announcements.map((announcement, index) => (
          <AnnouncementCard
            key={announcement._id} // React için benzersiz anahtar
            announcement={announcement} // Announcement verisi
            index={index} // Sıra numarası
            onEdit={onEdit} // Düzenleme fonksiyonu
            onDelete={onDelete} // Silme fonksiyonu
          />
        ))}
      </div>
    </div>
  );
}
