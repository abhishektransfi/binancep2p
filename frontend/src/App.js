import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography, Paper, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('INR');

  const currencies = [
    { value: 'INR', label: 'Indian Rupee (INR)' },
    { value: 'ZMW', label: 'Zambian Kwacha (ZMW)' },
    { value: 'UGX', label: 'Ugandan Shilling (UGX)' },
    { value: 'TZS', label: 'Tanzanian Shilling (TZS)' },
    { value: 'KES', label: 'Kenyan Shilling (KES)' }
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5002/api/p2p-data', {
        fiat: currency,
        asset: 'USDT',
        tradeType: 'BUY',
      });
      const ordersWithId = response.data.data.map((order, index) => ({
        id: index,
        price: order.adv.price,
        quantity: order.adv.surplusAmount,
        limits: `${Number(order.adv.minSingleTransAmount).toLocaleString()} - ${Number(order.adv.maxSingleTransAmount).toLocaleString()}`,
        merchant: order.advertiser.nickName,
        paymentMethods: order.adv.tradeMethods.map(method => method.tradeMethodShortName).join(', '),
        monthlyOrders: order.advertiser.monthOrderCount,
        monthlyRate: (order.advertiser.monthFinishRate * 100).toFixed(1) + '%'
      }));
      setOrders(ordersWithId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currency]);

  const columns = [
    { field: 'price', headerName: `Price (${currency})`, width: 150 },
    { field: 'quantity', headerName: 'Quantity USDT', width: 150 },
    { field: 'limits', headerName: `Limits (${currency})`, width: 250 },
    { field: 'merchant', headerName: 'Merchant', width: 250 },
    { field: 'monthlyOrders', headerName: 'Monthly Orders', width: 150 },
    { field: 'monthlyRate', headerName: 'Success Rate', width: 150 },
    { field: 'paymentMethods', headerName: 'Payment Methods', flex: 1 }
  ];

  return (
    <div style={{ padding: '2rem', height: '100vh' }}>
      <Paper elevation={3} style={{ padding: '1rem', height: '100%' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">
            USDT P2P Orders
          </Typography>
          <Box display="flex" gap={2}>
            <FormControl style={{ minWidth: 200 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                label="Currency"
                onChange={(e) => setCurrency(e.target.value)}
              >
                {currencies.map((curr) => (
                  <MenuItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>
        </Box>
        <div style={{ height: '700px', width: '100%' }}>
          <DataGrid
            rows={orders}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            loading={loading}
            disableSelectionOnClick
            style={{ width: '100%' }}
          />
        </div>
      </Paper>
    </div>
  );
}

export default App;