/**
 * React Hook Form'un iç içe geçmiş 'errors' nesnesini alır
 * ve içindeki tüm hata mesajlarını tek bir dizi olarak döndürür.
 * @param errors - react-hook-form'dan gelen hata nesnesi.
 * @returns Tüm hata mesajlarını içeren bir string dizisi.
 */
export const getAllErrorMessages = (errors: Record<string, any>): string[] => {
  let messages: string[] = []

  // Hata nesnesindeki her bir anahtar için döngü başlat
  for (const key in errors) {
    // Mevcut düğümü al
    const errorNode = errors[key]

    // Eğer düğüm boşsa atla
    if (!errorNode) continue

    // Durum 1: Düğümün kendisi bir mesaj içeriyorsa (en alt seviye hata)
    if (typeof errorNode.message === 'string') {
      messages.push(errorNode.message)
    }
    // Durum 2: Düğümün kendisi bir mesaj içermiyor ama bir nesne ise (iç içe geçmiş hatalar)
    // Bu, hem dizi hatalarını (örn: { '0': { message: '...' } })
    // hem de nesne hatalarını (örn: { 'details': { 'title': { message: '...' } } }) yakalar.
    else if (typeof errorNode === 'object') {
      // Fonksiyonu bu iç nesne için tekrar çağır ve sonuçları mevcut listeye ekle
      messages = messages.concat(getAllErrorMessages(errorNode))
    }
  }

  return messages
}
