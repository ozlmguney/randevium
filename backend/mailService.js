const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 2525, 
  secure: false, 
  auth: {
    user: 'ozleemguney925@gmail.com', 
    pass: process.env.EMAIL_PASS 
  },
  connectionTimeout: 20000, 
  greetingTimeout: 20000,
  socketTimeout: 20000,
  tls: {
    rejectUnauthorized: false
  }
});

const sendMail = async (to, subject, text) => {
  const mailOptions = {
    from: '"Klinik Yönetimi" <ozleemguney925@gmail.com>',
    to: to,
    subject: subject,
    text: text, 
    html: `<div style="font-family: sans-serif; padding: 20px;"><h2>Sisteme Hoş Geldiniz!</h2><p>${text}</p></div>`
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;