🏥 Randevium - Akıllı Randevu Yönetim Sistemi Randevium, hastaların doktorlardan kolayca randevu alabildiği, doktorlarla anlık sohbet edebildiği ve adminlerin tüm süreci yönetebildiği modern bir sağlık platformudur.

🛠️ Ön Koşullar (Kurulumdan Önce Kontrol Edin) Projeyi sorunsuz çalıştırmak için bilgisayarınızda şu ayarların yapılmış olması gerekir:

Node.js Kurulu mu?: Bilgisayarınızda Node.js (v18 veya üstü önerilir) kurulu olmalıdır.

Kontrol etmek için terminale node -v yazın. Eğer yüklü değilse nodejs.org adresinden indirin.

PowerShell Yetki Hatası (Windows): Terminalde npm install veya npm run dev yazınca kırmızı hata alıyorsanız, PowerShell script çalıştırma yetkiniz kapalı olabilir.

Çözüm: PowerShell'i Yönetici olarak açın ve şu komutu çalıştırın: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser Bu komut, yerel bilgisayarınızda yazdığınız kodların çalışmasına izin verecektir.

🚀 Başlangıç (Kurulum Rehberi)

Projeyi Klonlayın Bash git clone https://github.com/ozlmguney/randevium.git cd randevium

Backend (Sunucu) Kurulumu Birinci Terminali açın: cd backend npm install (Eğer burada hata alırsanız yukarıda bulunan 🛠️ Ön Koşullar (Kurulumdan Önce Kontrol Edin) maddesine bakın) Sunucuyu başlatın: cd backend node server.js Sunucu şu adreste çalışacaktır: http://localhost:5001

Frontend (Arayüz) Kurulumu İkinci bir Terminal açın: (ana dizine dönmeyi unutmayın) Kütüphaneleri yükleyin: (Sadece ilk kurulumda bir kez yapılır) Bash npm install Uygulamayı başlatın: npm start Uygulama şu adreste açılacaktır: http://localhost:5173

🔐 Giriş Bilgileri Admin: admin@randevium.com | Şifre: admin123

⚠️ Önemli Notlar Terminal Yönetimi: Uygulamanın çalışması için backend terminalinde node server.js, frontend terminalinde ise npm start komutlarının aynı anda aktif olması gerekir.

Bash npm install npm run dev Uygulama şu adreste açılacaktır: http://localhost:5173