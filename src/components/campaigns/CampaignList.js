import CampaignCard from "./CampaignCard";

export default function CampaignList({ campaigns, onEdit, onDelete }) {
  // 📭 Campaign yoksa boş durum mesajı göster
  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-20 text-center">
        <p className="text-2xl font-medium text-gray-700">
          Henüz campaign eklenmemiş.
        </p>
        <p className="mt-5 text-base text-gray-600">
          İlk campaign'inizi oluşturmak için yukarıdaki + butonuna tıklayın
        </p>
      </div>
    );
  }

  // 📋 Campaign'leri listele
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Her campaign için CampaignCard oluştur */}
      {campaigns.map((campaign, index) => (
        <CampaignCard
          key={campaign._id} // React için benzersiz anahtar
          campaign={campaign} // Campaign verisi
          index={index} // Sıra numarası
          onEdit={onEdit} // Düzenleme fonksiyonu
          onDelete={onDelete} // Silme fonksiyonu
        />
      ))}
    </div>
  );
}
