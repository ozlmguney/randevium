const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, 
  auth: {
    user: 'a47cfb001@smtp-brevo.com', 
    pass: 'xsmtpsib-866a0857a557dac65f8abf0372ddb01efdbad1183a93b94161a8fff9028f11e0-BJ6dYfJgJfZGMmTX' 
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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 30px; border-radius: 16px;">
        <h2 style="color: #10b981; text-align: center;">Randevium'a Hoş Geldiniz!</h2>
        <p style="font-size: 16px; line-height: 1.6;">${text}</p>
        <div style="text-align: center; margin-top: 25px;">
          <p style="font-size: 14px; color: #64748b;">Artık tüm randevularınızı panel üzerinden takip edebilirsiniz.</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;">
        <footer style="font-size: 12px; color: #94a3b8; text-align: center;">
          Bu otomatik bir e-postadır, lütfen yanıtlamayınız.
        </footer>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;