const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: 'ozleemguney925@gmail.com',
    pass: 'dhgw eezb tgwe pdbo' 
  }
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: '"Hastane Randevu Sistemi" <senin-adresin@gmail.com>',
    to: to,
    subject: subject,
    text: text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("E-posta gönderildi: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Mail gönderme hatası detayı: ", error);
    throw error;
  }
};

module.exports = sendMail;