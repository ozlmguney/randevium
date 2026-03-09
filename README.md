🏥 Randevium - Akıllı Randevu Yönetim Sistemi
Randevium, hastaların doktorlardan kolayca randevu alabildiği, doktorlarla anlık sohbet edebildiği ve adminlerin tüm süreci yönetebildiği modern bir sağlık platformudur.

🚀 Başlangıç (Kurulum Rehberi)
Bu projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla takip edin. Not: Bilgisayarınızda Node.js kurulu olmalıdır.

1. Projeyi Klonlayın
Önce projeyi GitHub'dan bilgisayarınıza indirin:

Bash
git clone https://github.com/ozlmguney/randevium.git
cd randevium
2. Backend (Sunucu) Kurulumu
Backend tarafı randevuları ve kullanıcı verilerini yönetir. Birinci Terminali açın:

Backend dizinine girin:

Bash
cd backend
Gerekli paketleri indirin:

Bash
npm install
Sunucuyu başlatın:

Bash
npm start
Sunucu şu adreste çalışacaktır: http://localhost:5001

3. Frontend (Arayüz) Kurulumu
Frontend tarafı kullanıcı arayüzünü (React) içerir. İkinci bir Terminal açın:

Frontend (ana) dizine gidin: (Eğer backend içindeyseniz cd .. yapın)

Bash
npm install
Uygulamayı başlatın:

Bash
npm run dev
Uygulama şu adreste açılacaktır: http://localhost:5173 (Vite varsayılanı)

📦 Kullanılan Teknolojiler
Alan	Teknoloji
Frontend	React, TypeScript, Material UI (MUI), Vite
Backend	Node.js, Express.js
State/Auth	React Context API, JWT
API	Axios
Tasarım	Glassmorphism, Modern Minimalist UI
🛠 Temel Özellikler
Kullanıcı Paneli: Takvim üzerinden tarih seçimi ve randevu oluşturma.

Admin Paneli: Randevu onaylama, düzenleme ve silme işlemleri.

Detay Modalı: Randevu detaylarını görüntüleme ve hızlı aksiyon alma (İptal/Sohbet).

Responsive Tasarım: Mobil ve masaüstü cihazlarla tam uyumlu arayüz.

⚠️ Önemli Notlar
Uygulamanın tam performanslı çalışması için iki terminalin de aynı anda açık ve çalışıyor olması gerekir.

Eğer 5001 veya 5173 portları bilgisayarınızda kullanımda ise, .env dosyasından veya port ayarlarından değişiklik yapmanız gerekebilir.
