Bu projenin temel amacı, kullanıcıların kişisel finansal süreçlerini dijital ortamda düzenli ve sürdürülebilir bir şekilde 
yönetmelerini sağlayan, mobil tabanlı bir bütçe takip uygulaması geliştirmektir. “SmartBillLite” adıyla geliştirilen bu 
uygulama, bireylerin fatura ve harcama kayıtlarını sistemli bir şekilde tutabilmesini, bu veriler üzerinden ay bazlı analizler 
yaparak harcama alışkanlıklarını değerlendirebilmesini ve zamanında ödeme alışkanlığı kazanmasını hedeflemektedir. 
splash.js: 
• Uygulama açıldığında 4 saniyelik gecikmeyle splash ekranı (uygulama logosu) gösterilir. 
• Bu süre zarfında AsyncStorage üzerinden "currentUser" anahtarı kontrol edilir. 
• Eğer kullanıcı verisi varsa navigation.replace() ile doğrudan Home.js sayfasına yönlendirme yapılır. 
• Kullanıcı kaydı bulunmuyorsa veya hata oluşursa LoginScreen.js sayfasına yönlendirilir.
![1](https://github.com/user-attachments/assets/67495e6c-bbd7-4b63-bd99-d873d85e2f00)
2- LoginScreen.js – Giriş ve Hesap Oluşturma Sayfası 
• Giriş yapma veya hesap oluşturma modları arasında geçiş yapılabilir. 
• E-posta ve şifre girilerek kullanıcı doğrulaması yapılır. 
• Kayıt sırasında kullanıcı adı, e-posta ve şifre alınır. 
• AsyncStorage üzerinden kullanıcı verileri kontrol edilir ve güncellenir. 
• Başarılı giriş/kayıt sonrası kullanıcı Home.js sayfasına yönlendirilir. 
• Şifre alanı için görünürlük kontrolü yapılır (şifre göster/gizle). 
• Kayıtlı e-posta adresiyle tekrar kayıt yapılması engellenir.
![3](https://github.com/user-attachments/assets/66c267c1-d3f5-4695-b87f-9609e6630136)
![2](https://github.com/user-attachments/assets/851d013b-f916-410d-b125-0deb6e9cc284)
3- HomeScreen.js – Ana Sayfa ve Uygulama Merkezi
• Navigasyon Butonları: Kullanıcı, Fatura Ekle, Harcamalarım, Listele, Grafik gibi temel modüllere bu sayfadan 
erişebilir. 
• Aylık Harcama Özeti: Bu ayki toplam harcama ve geçen aya göre değişim yüzdesi hesaplanır. 
• Yaklaşan Faturalar: Ödeme tarihi yaklaşan (3 gün içinde olan) ödenmemiş faturalar kullanıcıya uyarı kutusunda 
gösterilir. 
• Hesaplar Menüsü: Kullanıcılar arası geçiş yapılabilir, çıkış yapılabilir, yeni hesap eklenebilir. 
• Kullanıcıya Özel Veriler: AsyncStorage ile kullanıcı bazlı fatura ve harcama verileri yüklenir ve saklanır. 
• Otomatik Hesaplamalar: useEffect ile fatura ve harcamalar değiştiğinde özet bilgiler güncellenir.
![4](https://github.com/user-attachments/assets/be4154b1-6da8-48b4-962e-8dc20ea5a901)
![WhatsApp Image 2025-06-26 at 21 56 11 (1)](https://github.com/user-attachments/assets/49289a27-9a48-41ac-b77a-231e66a4d109)
4 - AddBillScreen.js – Fatura Ekleme Ekranı
• Kategori seçimi: Ön tanımlı fatura kategorileri arasından seçim yapılır; “Diğer” seçilirse özel fatura adı girilebilir. 
• Tutar girişi: Kullanıcı, numeric klavye ile tutar bilgisi girer. 
• Son ödeme tarihi seçimi: Platforma uygun tarih seçici ile ödeme tarihi belirlenir. 
• Form doğrulaması: Kategori, tutar ve gerekiyorsa özel isim alanları boş bırakıldığında kullanıcı uyarılır. 
• Fatura kaydetme: Girilen bilgiler, kullanıcının e-posta adresine özel olarak AsyncStorage’da saklanır. 
• Başarılı kayıtta navigasyon: Fatura kaydedildikten sonra kullanıcı ana ekrana yönlendirilir. 
• Kullanıcı doğrulaması: Ekran açıldığında geçerli kullanıcı bilgisi yoksa uyarı gösterilip geri dönülür. 
![7](https://github.com/user-attachments/assets/cc95aaf3-b30b-46ed-84e8-0183ae5ff42e)
![WhatsApp Image 2025-06-27 at 01 26 01](https://github.com/user-attachments/assets/80b05b38-365c-4f22-955c-093a62003fba)
![WhatsApp Image 2025-06-26 at 21 56 10 (1)](https://github.com/user-attachments/assets/d9fabcbe-1698-4800-aee2-162c5e8ac01c)
5 - ExpensesScreen.js – Harcama Ekleme Ekranı
• Kategori seçimi: Ön tanımlı kategoriler veya “Diğer” seçeneği ile özel kategori girişi yapılabilir. 
• Açıklama girme: Harcamaya açıklama eklenebilir. 
• Tutar girişi: Numeric klavye ile tutar belirtilir. 
• Tarih seçimi: Tarih seçici ile harcama tarihi belirlenir. 
• Ödeme yöntemi seçimi: Kredi kartı ya da nakit seçilebilir. 
• Taksit seçimi: Kredi kartı seçildiğinde taksit bilgisi seçilebilir veya özel taksit girilebilir. 
• Form doğrulama: Zorunlu alanlar kontrol edilir, eksik bilgi varsa kullanıcı uyarılır. 
• Veri kaydetme: AsyncStorage’a kullanıcıya özel anahtarla harcama listesine yeni kayıt eklenir. 
• Navigasyon: Kayıt sonrası geri dönülür, iptal seçeneği ile de çıkılabilir. 
![WhatsApp Image 2025-06-26 at 21 56 12](https://github.com/user-attachments/assets/a8d6354e-af28-4f7b-bee3-967bded270e6)
![WhatsApp Image 2025-06-27 at 01 27 13](https://github.com/user-attachments/assets/29395655-0a48-43a2-ac8d-08ba54e8fbd5)
![WhatsApp Image 2025-06-26 at 21 56 12 (1)](https://github.com/user-attachments/assets/21efd711-96e0-4d87-9a46-0b830e88ad8f)
6 - ListScreen.js – Kayıt Listeleme Ekranı 
şlevler 
• Veri yükleme: AsyncStorage’dan kullanıcıya özel faturalar ve harcamalar yüklenir. 
• Filtreleme: 
o Kayıt türüne göre (Faturalar, Harcamalar, Hepsi) filtreleme, 
o Tarih filtresi (Hepsi, Son 7 Gün, Bu Ay, Özel tarih aralığı), 
o Tutar aralığı (min-max), 
o Kategoriye göre filtreleme. 
• Durum güncelleme: Faturaların ödeme durumu (odendiMi) işaretlenip kaydedilir. 
• Liste gösterimi: FlatList ile filtrelenmiş kayıtlar tarih sırasına göre listelenir. 
• Tarih seçici: Özel tarih aralığında başlangıç ve bitiş tarihleri için DateTimePicker açılır. 
![WhatsApp Image 2025-06-26 at 21 56 14](https://github.com/user-attachments/assets/141acbd8-e3c7-4666-b36d-f71998d85428)
![WhatsApp Image 2025-06-26 at 21 56 16 (1)](https://github.com/user-attachments/assets/84f0cea5-80ea-466f-863d-678b69c370aa)
7 - ChartScreen.js – Grafikler ve İstatistik Ekranı
Temel Özellikler 
� Bu Ayın Dağılımı: 
• Harcamalar ve faturalar ayrı ayrı pasta grafiklerle gösterilir. 
• Kategorilere göre toplam tutarlar görsel olarak sunulur. 
� Aya Göre Kıyaslama: 
• Kullanıcı seçtiği iki ayı karşılaştırabilir. 
• Pasta grafiklerle kategori bazlı değişim gösterilir. 
• Açıklama kısmında fark miktarı, hangi ayda daha fazla harcama yapıldığı ve en büyük değişim olan kategori 
belirtilir. 
� Kategori Bazlı Kıyaslama (Son 6 Ay): 
• Seçilen bir kategori için son 6 aylık veriler sütun grafik ile gösterilir. 
• Kullanıcı hem kayıt türünü (harcama/fatura) hem de kategoriyi seçebilir.
![chart](https://github.com/user-attachments/assets/0a2ea048-83ba-4f35-8d11-a5376ea78eac)






