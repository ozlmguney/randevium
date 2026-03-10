const axios = require('axios');

const sendMail = async (to, subject, text) => {
  const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
  
  try {
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: { name: "Klinik Yönetimi", email: "ozleemguney925@gmail.com" },
        to: [{ email: to }],
        subject: subject,
        htmlContent: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10b981;">Randevium'a Hoş Geldiniz!</h2>
            <p>${text}</p>
            <footer style="margin-top: 20px; font-size: 12px; color: #888;">Bu bir API üzerinden gönderilen onay mailidir.</footer>
          </div>
        `
      },
      {
        headers: {
          'api-key': process.env.BREVO_API_KEY, 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    console.log("API üzerinden mail başarıyla kuyruğa alındı:", response.data);
    return response.data;
  } catch (error) {
    console.error("Brevo API Hatası:", error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = sendMail;