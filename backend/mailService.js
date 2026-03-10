const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, 
  secure: true, 
  auth: {
    user: 'ozleemguney925@gmail.com', 
    pass: 'dhgweezbtgwepdbo' 
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: '"Klinik Yönetimi" <ozleemguney925@gmail.com>',
    to: to,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h1 style="color: #10b981; text-align: center;">Merhaba!</h1>
        <p style="font-size: 16px;">${text}</p>
        <p style="font-size: 14px; color: #666;">Klinik randevu sistemimizi tercih ettiğiniz için teşekkür ederiz. Artık randevularınızı kolayca yönetebilirsiniz.</p>
        <br>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <footer style="font-size: 12px; color: #999; text-align: center;">
          Bu bir otomatik bilgilendirme mailidir. Lütfen yanıtlamayınız.
        </footer>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;