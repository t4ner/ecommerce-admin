// 🔤 Türkçe karakterleri İngilizce'ye çevir ve URL dostu slug oluştur
export const generateSlug = (name) => {
  return name
    .toLocaleLowerCase("tr-TR") // Türkçe locale ile küçük harfe çevir (İ -> i)
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-") // Özel karakterleri tire ile değiştir
    .replace(/^-+|-+$/g, ""); // Baş ve sondaki tireleri temizle
};
