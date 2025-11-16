const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendResetEmail(to, resetLink) {
  const info = await transport.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@meditrack.example',
    to,
    subject: 'MediTrack+ Password Reset',
    html: `<p>Click the link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });
  return info;
}

module.exports = { sendResetEmail };
