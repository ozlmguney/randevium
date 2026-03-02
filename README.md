🏥 Randevium - Klinik Randevu Yönetim Sistemi
Bu proje, hem hastaların randevu alabileceği hem de yöneticilerin (admin) bu randevuları yönetebileceği tam kapsamlı bir web uygulamasıdır. Eğer bu projeyi ilk kez bilgisayarınıza kuracaksanız, aşağıdaki adımları sırasıyla takip etmeniz yeterlidir.

🛠 1. Hazırlık: Gerekli Programların Kurulması
Projeyi çalıştırmadan önce bilgisayarınızda şu iki temel aracın kurulu olduğundan emin olun:

Node.js: Projenin motorudur. Node.js resmi web sitesinden "LTS" (Kararlı sürüm) olanı indirip kurun.

Git: Kodları bilgisayarınıza indirmek için gereklidir. Git SCM sitesinden indirebilirsiniz.

Kontrol Et: Terminalinizi (veya CMD) açın ve node -v yazın. Bir versiyon numarası (örn: v20.x.x) görüyorsanız hazırsınız demektir!

📥 2. Projenin Bilgisayara İndirilmesi
Terminali açın ve projeyi kaydetmek istediğiniz klasöre gidip şu komutu yazın:

Bash
git clone https://github.com/ozlmguney/randevium.git
cd randevium
📦 3. Gerekli Paketlerin Yüklenmesi
Bu proje birçok kütüphane (Material UI, Axios, React Router vb.) kullanmaktadır. Bunları tek tek yüklemekle uğraşmanıza gerek yok. Proje klasöründeyken terminale şunu yazmanız yeterli:

Bash
npm install
Bu komut, package.json dosyasındaki tüm eksik paketleri (MUI, Icons, Emotion vb.) otomatik olarak bulur ve yükler.

🚀 4. Uygulamayı Çalıştırma
Proje iki kısımdan oluşur: Frontend (Arayüz) ve Backend (Sunucu). Uygulamanın tam çalışması için ikisinin de açık olması gerekir.

A) Backend (Sunucu) Çalıştırma
Yeni bir terminal penceresi açın (Backend klasöründe olduğunuzdan emin olun):

Bash
node server.js
Burada "Server 5001 portunda çalışıyor" yazısını görmelisiniz.

B) Frontend (Arayüz) Çalıştırma
Mevcut terminalinizde (Ana dizinde) uygulamayı başlatın:

Bash
npm start
Otomatik olarak tarayıcınızda http://localhost:3000 adresi açılacaktır.

⚠️ Olası Hatalar ve Çözümleri
1. "JavaScript heap out of memory" Hatası Alırsanız:
Bilgisayarınızın RAM kapasitesi yetmediğinde bu hatayı alabilirsiniz. Çözmek için terminale şu komutu yazıp sonra tekrar npm start yapın:

PowerShell
$env:NODE_OPTIONS = "--max-old-space-size=4096"
2. "Port 3000 is already in use" Hatası Alırsanız:
Terminale y yazıp başka bir portta açılmasını onaylayın veya çalışan diğer terminal pencerelerini kapatın.

🏗 Kullanılan Teknolojiler
Frontend: React.js, Material UI (MUI), React Router

Backend: Node.js, Express.js

Veri Yönetimi: Axios (API istekleri için)

İkonlar: MUI Icons

👨‍💻 Admin Giriş Bilgileri (Varsayılan)
admin@randevium.com admin123
Eğer sistemi test etmek isterseniz admin paneline şu şekilde ulaşabilirsiniz:

Giriş Sayfası: /login

Admin Paneli: /admin (Giriş yaptıktan sonra yönlendirilirsiniz)

✨ Temel Özellikler (Features)
🚀 Kullanıcılar İçin:

Kolay Randevu Oluşturma: Doktor, tarih ve saat seçerek hızlıca randevu alabilme.

Randevu Takibi: Alınan randevuların durumunu (Onaylı/Bekliyor) anlık görme.

Detaylı İnceleme: Randevu detaylarına modal (açılır pencere) üzerinden erişim.

🔐 Yöneticiler (Admin) İçin:

Merkezi Yönetim: Tüm hastaların randevularını tek bir panelden görme.

Onay Mekanizması: Bekleyen randevuları tek tıkla onaylama.

Düzenleme & Silme: Hatalı randevuları güncelleme veya iptal etme.

Akıllı Filtreleme: Doktor adına veya hasta ismine göre hızlı arama.

🎨 Tasarım:
<img width="1365" height="591" alt="Ekran görüntüsü 2026-03-03 000623" src="https://github.com/user-attachments/assets/c3e487b4-ebb4-4b06-831c-d059b474402e" />
<img width="1345" height="594" alt="Ekran görüntüsü 2026-03-03 000600" src="https://github.com/user-attachments/assets/629ac46a-5ccf-4edd-995a-a2a9123ee981" />
<img width="1342" height="593" alt="Ekran görüntüsü 2026-03-03 000714" src="https://github.com/user-attachments/assets/3c94ea46-33d8-44b9-8871-d1b16824475c" />
<img width="1343" height="598" alt="Ekran görüntüsü 2026-03-03 000647" src="https://github.com/user-attachments/assets/5966a10c-b50d-45c4-bb9a-2753f8c8365b" />

Glassmorphism: Modern cam efekti ve şık arka plan görselleri.

Responsive Tasarım: Mobil telefon, tablet ve bilgisayarlarla tam uyumlu arayüz.

MUI Entegrasyonu: Google'ın Material Design standartlarında kullanıcı deneyimi.

🛠 Teknik Detaylar (İleri Seviye Kurulum)
Eğer projeyi geliştirici olarak kullanacaksanız, şu detaylar işinize yarayacaktır:


Frontend Portu: 3000

Backend Portu: 5001

API İstekleri: Axios kütüphanesi ile http://localhost:5001/api üzerinden haberleşir.

Tema: ThemeProvider ile özelleştirilmiş MUI Dark/Light mod desteği.

Geliştirici: Özlem Güney
