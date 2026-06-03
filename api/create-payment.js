const { createMollieClient } = require('@mollie/api-client');

const mollie = createMollieClient({ apiKey: process.env.MOLLIE_API_KEY || 'test_3mmNfuShmE3HzgaUgnKAGeyNRnDeju' });
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end();
  const { email } = req.body;
  try {
    const payment = await mollie.payments.create({
      amount: { currency: 'EUR', value: String(parseFloat('4.99').toFixed(2)) },
      description: 'Ebook 5000 Fournisseurs',
      redirectUrl: `${process.env.SITE_URL}/merci.html`,
      webhookUrl: `${process.env.SITE_URL}/api/webhook`,
      metadata: { email },
    });
    res.json({ checkoutUrl: payment._links.checkout.href });
  } catch (err) {
    res.status(500).json({ error: err.message, details: JSON.stringify(err) });
  }
};
