const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ozleemguney925@gmail.com', 
    pass: 'dhgw eezb tgwe pdbo' 
  }
});

const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: '"Klinik Yönetimi" <senin-email-adresin@gmail.com>',
    to: email,
    subject: 'Aramıza Hoş Geldiniz!',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #10b981;">Merhaba ${name}!</h1>
        <p>Klinik randevu sistemimize başarıyla kayıt oldunuz.</p>
        <p>Artık randevularınızı kolayca yönetebilirsiniz.</p>
        <br>
        <hr>
        <footer style="font-size: 0.8em; color: #777;">Bu bir otomatik bilgilendirme mailidir.</footer>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };