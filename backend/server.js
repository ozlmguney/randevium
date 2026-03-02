const express = require('express');
const cors = require('cors');
const sendMail = require('./utils/mailer');
const app = express();
const jwt = require('jsonwebtoken'); 
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_key_for_local';
app.use(cors());
app.use(express.json());

let appointments = [];
let users = [
    { 
        id: "admin-1", 
        name: "Sistem Admini", 
        email: "admin@randevium.com", 
        password: "admin123", 
        role: "ADMIN" 
    }
];
let messages = [];
app.get('/api/messages', (req, res) => res.json(messages));
app.post('/api/messages', (req, res) => {
    messages.push(req.body);
    res.status(201).json(req.body);
});


app.use((req, res, next) => {
    console.log(`${req.method} isteği geldi: ${req.url}`);
    next();
});

const doctors = [
  { 
    id: "1", 
    name: "Dr. Ahmet Yılmaz", 
    specialty: "Kardiyoloji",
    avatarUrl: "https://i.pravatar.cc/150?img=11", 
    isOnline: true
  },
  { 
    id: "2", 
    name: "Dr. Ayşe Demir", 
    specialty: "Nöroloji",
    avatarUrl: "https://i.pravatar.cc/150?img=26",
    isOnline: true
  },
  { 
  id: "3", 
  name: "Dr. Mehmet Kaya", 
  specialty: "Dahiliye",
  avatarUrl: "https://i.pravatar.cc/150?img=12", 
  isOnline: false 
}
];

app.get('/api/doctors', (req, res) => {
    console.log("Doktor listesi istendi");
    res.json(doctors);
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log("JWT Giriş denemesi:", email);

    let foundUser = null;

    if (email === "admin@randevium.com" && password === "admin") {
        foundUser = { id: "admin-1", name: "Yönetici", email: email, role: "ADMIN" };
    } else {
        foundUser = users.find(u => u.email === email && u.password === password);
    }

    if (foundUser) {
        const token = jwt.sign(
            { 
                id: foundUser.id, 
                email: foundUser.email, 
                role: foundUser.role || 'USER' 
            }, 
            SECRET_KEY, 
            { expiresIn: '24h' } 
        );

        console.log(`${foundUser.role} girişi başarılı, Token üretildi.`);

        return res.status(200).json({ 
            message: "Giriş başarılı", 
            user: { 
                id: foundUser.id, 
                name: foundUser.name, 
                email: foundUser.email, 
                role: foundUser.role || 'USER' 
            },
            token: token 
        });
    } else {
        return res.status(401).json({ message: "E-posta veya şifre hatalı!" });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const userData = { ...req.body, role: 'USER' };
        users.push(userData); 
        
        console.log("Yeni kullanıcı kayıt oldu:", userData.email);

        if (userData.email) {
            await sendMail(
                userData.email,
                "Hoş Geldiniz!",
                `Sayın ${userData.name || 'Kullanıcı'}, sisteme kaydınız başarıyla tamamlanmıştır.`
            );
        }

        res.status(201).json({ message: "Kayıt başarılı", user: userData });
    } catch (error) {
        console.error("Kayıt hatası:", error);
        res.status(500).json({ message: "Kayıt sırasında hata oluştu" });
    }
});

app.get('/api/appointments', (req, res) => {
    res.json(appointments);
});

app.post('/api/appointments', async (req, res) => {
    try {
        const newApp = { 
            ...req.body, 
            id: req.body.id || Date.now().toString(), 
            status: 'PENDING' 
        };
        
        appointments.push(newApp);
        console.log("Yeni randevu eklendi:", newApp);

        if (newApp.userEmail) {
            await sendMail(
                newApp.userEmail,
                "Randevu Talebiniz Alındı",
                `Sayın kullanıcımız, ${newApp.date} tarihindeki randevunuz başarıyla oluşturulmuştur.`
            );
            console.log("Onay maili gönderildi.");
        }

        res.status(201).json(newApp);
    } catch (error) {
        console.error("Post hatası:", error);
        res.status(500).json({ message: "Sunucu hatası oluştu" });
    }
});
app.put('/api/appointments/:id/approve', async (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex(a => String(a.id) === String(id));

    if (index !== -1) {
        appointments[index].status = 'APPROVED';
        const approvedApp = appointments[index];

        console.log(`Randevu onaylandı: ${id}`);

        if (approvedApp.userEmail) {
            try {
                await sendMail(
                    approvedApp.userEmail,
                    "Randevunuz Onaylandı!",
                    `Sayın kullanıcımız, ${approvedApp.date} tarihindeki randevu talebiniz doktorumuz tarafından onaylanmıştır.`
                );
                console.log("Onay maili iletildi.");
            } catch (mailError) {
                console.error("Mail gönderme hatası:", mailError);
            }
        }

        return res.status(200).json(approvedApp);
    }

    res.status(404).json({ message: "Randevu bulunamadı" });
});
app.put('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex(a => String(a.id) === String(id));
    
    if (index !== -1) {
        appointments[index] = { ...appointments[index], ...req.body };
        const updated = appointments[index];

        console.log(`Randevu güncellendi: ${id}`);

        if (updated.userEmail) {
            try {
                await sendMail(
                    updated.userEmail,
                    "Randevu Bilgileriniz Güncellendi",
                    `Randevunuz yeni bilgilerle güncellenmiştir. Tarih: ${updated.date}, Saat: ${updated.time}`
                );
            } catch (err) { console.error("Güncelleme maili hatası:", err); }
        }
        return res.status(200).json(updated);
    }
    res.status(404).json({ message: "Randevu bulunamadı" });
});

app.delete('/api/appointments/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Silme isteği geldi, ID:", id);

    const index = appointments.findIndex(a => String(a.id) === String(id));

    if (index !== -1) {
        const deletedApp = appointments[index];
        appointments = appointments.filter(a => String(a.id) !== String(id));

        console.log("Randevu başarıyla silindi.");

        if (deletedApp.userEmail) {
            sendMail(deletedApp.userEmail, "Randevunuz İptal Edildi", "Randevunuz başarıyla iptal edilmiştir.")
            .catch(err => console.log("Mail gönderilemedi:", err.message));
        }

        return res.status(200).json({ message: "Silindi", id: id });
    } else {
        console.log("Hata: Randevu bulunamadı, mevcut randevular:", appointments.map(a => a.id));
        return res.status(404).json({ message: "Randevu bulunamadı!" });
    }
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server http://localhost:${PORT} üzerinde çalışıyor`);
    console.log(`📂 Mailer modülü yüklendi: ./src/utils/mailer`);
});