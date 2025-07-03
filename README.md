Bu projenin temel amacı, kullanıcıların kişisel finansal süreçlerini dijital ortamda düzenli ve sürdürülebilir bir şekilde 
yönetmelerini sağlayan, mobil tabanlı bir bütçe takip uygulaması geliştirmektir. “SmartBillLite” adıyla geliştirilen bu 
uygulama, bireylerin fatura ve harcama kayıtlarını sistemli bir şekilde tutabilmesini, bu veriler üzerinden ay bazlı analizler 
yaparak harcama alışkanlıklarını değerlendirebilmesini ve zamanında ödeme alışkanlığı kazanmasını hedeflemektedir. 
splash.js: 
• Uygulama açıldığında 4 saniyelik gecikmeyle splash ekranı (uygulama logosu) gösterilir. 
• Bu süre zarfında AsyncStorage üzerinden "currentUser" anahtarı kontrol edilir. 
• Eğer kullanıcı verisi varsa navigation.replace() ile doğrudan Home.js sayfasına yönlendirme yapılır. 
• Kullanıcı kaydı bulunmuyorsa veya hata oluşursa LoginScreen.js sayfasına yönlendirilir.

![splash](https://github.com/user-attachments/assets/a7899c5b-73e0-493f-9cdd-b977f1a471fc)

2- LoginScreen.js – Giriş ve Hesap Oluşturma Sayfası 
• Giriş yapma veya hesap oluşturma modları arasında geçiş yapılabilir. 
• E-posta ve şifre girilerek kullanıcı doğrulaması yapılır. 
• Kayıt sırasında kullanıcı adı, e-posta ve şifre alınır. 
• AsyncStorage üzerinden kullanıcı verileri kontrol edilir ve güncellenir. 
• Başarılı giriş/kayıt sonrası kullanıcı Home.js sayfasına yönlendirilir. 
• Şifre alanı için görünürlük kontrolü yapılır (şifre göster/gizle). 
• Kayıtlı e-posta adresiyle tekrar kayıt yapılması engellenir.

![giris](https://github.com/user-attachments/assets/d04531c1-59f8-4bfe-b2f3-db37b86d9523)


3- HomeScreen.js – Ana Sayfa ve Uygulama Merkezi
• Navigasyon Butonları: Kullanıcı, Fatura Ekle, Harcamalarım, Listele, Grafik gibi temel modüllere bu sayfadan 
erişebilir. 
• Aylık Harcama Özeti: Bu ayki toplam harcama ve geçen aya göre değişim yüzdesi hesaplanır. 
• Yaklaşan Faturalar: Ödeme tarihi yaklaşan (3 gün içinde olan) ödenmemiş faturalar kullanıcıya uyarı kutusunda 
gösterilir. 
• Hesaplar Menüsü: Kullanıcılar arası geçiş yapılabilir, çıkış yapılabilir, yeni hesap eklenebilir. 
• Kullanıcıya Özel Veriler: AsyncStorage ile kullanıcı bazlı fatura ve harcama verileri yüklenir ve saklanır. 
• Otomatik Hesaplamalar: useEffect ile fatura ve harcamalar değiştiğinde özet bilgiler güncellenir.

![ana](https://github.com/user-attachments/assets/fb6c0ca7-d0e5-42b6-bb3e-ea1afe763fab)

4 - AddBillScreen.js – Fatura Ekleme Ekranı
• Kategori seçimi: Ön tanımlı fatura kategorileri arasından seçim yapılır; “Diğer” seçilirse özel fatura adı girilebilir. 
• Tutar girişi: Kullanıcı, numeric klavye ile tutar bilgisi girer. 
• Son ödeme tarihi seçimi: Platforma uygun tarih seçici ile ödeme tarihi belirlenir. 
• Form doğrulaması: Kategori, tutar ve gerekiyorsa özel isim alanları boş bırakıldığında kullanıcı uyarılır. 
• Fatura kaydetme: Girilen bilgiler, kullanıcının e-posta adresine özel olarak AsyncStorage’da saklanır. 
• Başarılı kayıtta navigasyon: Fatura kaydedildikten sonra kullanıcı ana ekrana yönlendirilir. 
• Kullanıcı doğrulaması: Ekran açıldığında geçerli kullanıcı bilgisi yoksa uyarı gösterilip geri dönülür. 

![fatura1](https://github.com/user-attachments/assets/654b2669-ecce-41d1-9d07-7d848eab7064)

![fatura2](https://github.com/user-attachments/assets/64ffd646-915a-4869-a3ff-4b723bee6cbe)

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

![haarcama1](https://github.com/user-attachments/assets/3ec77313-8368-4e8d-ad63-9692a1b13f4f)

![harcama2](https://github.com/user-attachments/assets/b2b5a138-40a9-4af4-b2e2-b41292554bca)

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

![liste1](https://github.com/user-attachments/assets/91b2b527-f00c-45a2-9434-b7865fed3e5e)

![liste2](https://github.com/user-attachments/assets/116cc5d4-3b37-46ab-98bd-a8b3e11d536d)

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






