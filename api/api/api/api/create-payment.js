const { createMollieClient } = require('@mollie/api-client');

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  try {
    const payment = await mollie.payments.create({
      amount: { currency: 'EUR', value: '4.99' },
      description: 'Ebook 5000 Fournisseurs',
      redirectUrl: `${process.env.SITE_URL}/merci.html`,
      webhookUrl: `${process.env.SITE_URL}/api/webhook`,
      metadata: { email },
    });
    res.json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
