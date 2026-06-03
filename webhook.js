const { createMollieClient } = require('@mollie/api-client');
const SibApiV3Sdk = require('sib-api-v3-sdk');

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();

  const { id } = req.body;
  const payment = await mollie.payments.get(id);

  if (payment.status === 'paid') {
    const email = payment.metadata.email;

    const client = SibApiV3Sdk.ApiClient.instance;
    client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

    const api = new SibApiV3Sdk.TransactionalEmailsApi();
    await api.sendTransacEmail({
      sender: { email: 'contactpronzali@gmail.com', name: 'Ebook 5000 Fournisseurs' },
      to: [{ email }],
      subject: 'Votre Ebook 5000 Fournisseurs',
      textContent: 'Merci pour votre achat ! Voici votre ebook en pièce jointe.',
      attachment: [{ name: 'ebook.pdf', url: `${process.env.SITE_URL}/EBOOK.pdf` }],
    });
  }

  res.status(200).end();
};
