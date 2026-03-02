const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'klinik-email@gmail.com', 
    pass: 'your-app-password'      
  }
});

app.post('/send-email', (req, res) => {
  console.log("Simüle edilen mail gönderildi:", req.body.to);
  res.status(200).send({ message: "Email simulation successful" });
});

app.listen(5000, () => console.log('Mail servisi 5000 portunda çalışıyor...'));