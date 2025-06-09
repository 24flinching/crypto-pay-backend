const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.post('/create-charge', async (req, res) => {
  const { amount } = req.body;

  try {
    const response = await axios.post(
      'https://api.commerce.coinbase.com/charges',
      {
        name: "Restaurant Crypto Payment",
        description: "Pay with crypto",
        pricing_type: "fixed_price",
        local_price: {
          amount: amount,
          currency: "USD"
        },
      },
      {
        headers: {
          "X-CC-Api-Key": process.env.COINBASE_API_KEY,
          "X-CC-Version": "2018-03-22",
          "Content-Type": "application/json"
        }
      }
    );

    const hostedUrl = response.data.data.hosted_url;
    res.json({ hostedUrl });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create charge" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
