const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

//giving maharashtra_boy
// app.post('/api/p2p-data', async (req, res) => {
//   try {
//     const response = await axios.post(
//       'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
//       {
//         fiat: "INR",
//         asset: "USDT", 
//         tradeType: "BUY",
//         page: 1,
//         rows: 20
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }
//     );
    
//     const sortedData = [...response.data.data].sort((a, b) => 
//       Number(a.adv.price) - Number(b.adv.price)
//     );
    
//     res.json({
//       ...response.data,
//       data: sortedData
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
//  });

app.post('/api/p2p-data', async (req, res) => {
  try {
    const response = await axios.post(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        fiat: "INR",
        asset: "USDT", 
        tradeType: "BUY",
        payType: "ALL",
        page: 1,
        rows: 10
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    const sortedData = [...response.data.data].sort((a, b) => 
      Number(a.adv.price) - Number(b.adv.price)
    );
    
    res.json({
      ...response.data,
      data: sortedData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
 });
 
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));