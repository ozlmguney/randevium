const express = require('express');
const cors = require('cors');
const sendMail = require('./utils/mailer'); 
const app = express();
const jwt = require('jsonwebtoken'); 

const SECRET_KEY = process.env.JWT_SECRET || 'fallback_key_for_local';
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "*" })); 
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

app.use((req, res, next) => {
    console.log(`${req.method} isteği geldi: ${req.url}`);
    next();
});

app.get('/', (req, res) => res.send("Randevium API Yayında! 🚀"));
app.get('/api/test', (req, res) => res.json({ message: "Backend bağlantısı başarılı!" }));

app.get('/api/messages', (req, res) => res.json(messages));
app.post('/api/messages', (req, res) => {
    messages.push(req.body);
    res.status(201).json(req.body);
});

const doctors = [
    { id: "1", name: "Dr. Ahmet Yılmaz", specialty: "Kardiyoloji", avatarUrl: "https://i.pravatar.cc/150?img=11", isOnline: true },
    { id: "2", name: "Dr. Ayşe Demir", specialty: "Nöroloji", avatarUrl: "https://i.pravatar.cc/150?img=26", isOnline: true },
    { id: "3", name: "Dr. Mehmet Kaya", specialty: "Dahiliye", avatarUrl: "https://i.pravatar.cc/150?img=12", isOnline: false }
];

app.get('/api/doctors', (req, res) => res.json(doctors));


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Giriş denemesi:", email);

    let foundUser = users.find(u => u.email === email && u.password === password);

    if (!foundUser && email === "admin@randevium.com" && password === "admin123") {
        foundUser = users[0];
    }

    if (foundUser) {
        const token = jwt.sign(
            { id: foundUser.id, email: foundUser.email, role: foundUser.role || 'USER' }, 
            SECRET_KEY, 
            { expiresIn: '24h' } 
        );
        return res.status(200).json({ 
            message: "Giriş başarılı", 
            user: { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role || 'USER' },
            token 
        });
    }
    return res.status(401).json({ message: "E-posta veya şifre hatalı!" });
});

app.post('/api/register', async (req, res) => {
    try {
        const userData = { ...req.body, id: Date.now().toString(), role: 'USER' };
        users.push(userData); 
        console.log("Yeni kullanıcı eklendi:", userData.email);

        if (userData.email) {
            try {
                await sendMail(
                    userData.email, 
                    "Hoş Geldiniz!", 
                    `Sayın ${userData.name}, Randevium sistemine kaydınız başarıyla tamamlanmıştır.`
                );
                console.log("Kayıt maili başarıyla gönderildi.");
            } catch (mailError) {
                console.error("Mail gönderim hatası (Kayıt yapıldı):", mailError.message);
            }
        }

        return res.status(201).json({ message: "Kayıt başarılı ve mail gönderildi.", user: userData });
        
    } catch (error) {
        console.error("Kayıt hatası:", error);
        res.status(500).json({ message: "Sunucu hatası oluştu" });
    }
});

app.get('/api/appointments', (req, res) => res.json(appointments));

app.post('/api/appointments', async (req, res) => {
    try {
        const newApp = { ...req.body, id: Date.now().toString(), status: 'PENDING' };
        appointments.push(newApp);
        
        if (newApp.userEmail) {
            sendMail(newApp.userEmail, "Randevu Talebiniz Alındı", `Randevunuz oluşturuldu. Tarih: ${newApp.date}`)
                .catch(err => console.log("Randevu maili hatası:", err.message));
        }
        res.status(201).json(newApp);
    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası" });
    }
});

app.put('/api/appointments/:id/approve', async (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex(a => String(a.id) === String(id));

    if (index !== -1) {
        appointments[index].status = 'APPROVED';
        const approvedApp = appointments[index];
        
        if (approvedApp.userEmail) {
            sendMail(approvedApp.userEmail, "Randevunuz Onaylandı!", "Randevu talebiniz onaylanmıştır.")
                .catch(err => console.log("Onay maili hatası:", err.message));
        }
        return res.status(200).json(approvedApp);
    }
    res.status(404).json({ message: "Randevu bulunamadı" });
});

app.delete('/api/appointments/:id', (req, res) => {
    const { id } = req.params;
    const index = appointments.findIndex(a => String(a.id) === String(id));

    if (index !== -1) {
        const deleted = appointments[index];
        appointments = appointments.filter(a => String(a.id) !== String(id));
        
        if (deleted.userEmail) {
            sendMail(deleted.userEmail, "Randevunuz İptal Edildi", "Randevunuz başarıyla iptal edilmiştir.")
                .catch(err => console.log("İptal maili hatası."));
        }
        return res.status(200).json({ message: "Silindi", id });
    }
    res.status(404).json({ message: "Randevu bulunamadı!" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ${PORT} üzerinde çalışıyor`);
});