const { createMollieClient } = require('@mollie/api-client');
const nodemailer = require('nodemailer');

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { id } = req.body;
  const payment = await mollie.payments.get(id);

  if (payment.status === 'paid') {
    const email = payment.metadata.email;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Votre Ebook 5000 Fournisseurs',
      text: 'Merci pour votre achat ! Voici votre ebook en pièce jointe.',
      attachments: [{ filename: 'ebook.pdf', path: './EBOOK.pdf' }],
    });
  }

  res.status(200).end();
};
