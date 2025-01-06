// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//   Typography,
//   Paper,
//   Button,
//   Box,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import axios from "axios";

// function App() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currency, setCurrency] = useState("INR");
//   const [pageSize, setPageSize] = useState(20);
//   const [totalRows, setTotalRows] = useState(0);
//   const [page, setPage] = useState(0); // Add this

//   const currencies = [
//     { value: "INR", label: "Indian Rupee (INR)" },
//     { value: "ZMW", label: "Zambian Kwacha (ZMW)" },
//     { value: "UGX", label: "Ugandan Shilling (UGX)" },
//     { value: "TZS", label: "Tanzanian Shilling (TZS)" },
//     { value: "KES", label: "Kenyan Shilling (KES)" },
//   ];

//   const fetchData = async (page = 1, size = pageSize) => {
//     console.log("Fetching data with page:", page, "size:", size);
//     setLoading(true);
//     try {
//       const startIndex = (page - 1) * size;
//       const requests = [];
//       const recordsNeeded = size;

//       for (let i = 0; i < Math.ceil(recordsNeeded / 20); i++) {
//         requests.push(
//           axios.post("http://localhost:5002/api/p2p-data", {
//             fiat: currency,
//             asset: "USDT",
//             tradeType: "BUY",
//             page: i + 1,
//             rows: 20,
//           })
//         );
//       }

//       const responses = await Promise.all(requests);

//       let allData = [];
//       responses.forEach((response) => {
//         allData = [...allData, ...response.data.data];
//       });

//       console.log("Total records fetched:", allData.length);

//       const sortedData = allData.sort(
//         (a, b) => Number(a.adv.price) - Number(b.adv.price)
//       );
//       const slicedData = sortedData.slice(0, size);

//       const ordersWithId = slicedData.map((order, index) => ({
//         id: startIndex + index,
//         serialNo: startIndex + index + 1, // Add serial number here
//         price: order.adv.price,
//         quantity: order.adv.surplusAmount,
//         limits: `${Number(
//           order.adv.minSingleTransAmount
//         ).toLocaleString()} - ${Number(
//           order.adv.maxSingleTransAmount
//         ).toLocaleString()}`,
//         merchant: order.advertiser.nickName,
//         paymentMethods: order.adv.tradeMethods
//           .map((method) => method.tradeMethodShortName)
//           .join(", "),
//         monthlyOrders: order.advertiser.monthOrderCount,
//         monthlyRate: (order.advertiser.monthFinishRate * 100).toFixed(1) + "%",
//       }));

//       setOrders(ordersWithId);
//       setTotalRows(responses[0].data.total);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(1, pageSize);
//   }, [currency, pageSize]);

//   const handlePageChange = (newPage) => {
//     console.log("Page changed to:", newPage);
//     setPage(newPage);
//     fetchData(newPage + 1, pageSize);
//   };

//   const handlePageSizeChange = (newPageSize) => {
//     console.log("Page size changed to:", newPageSize);
//     setPageSize(newPageSize);
//     setPage(0); // Reset to first page when changing page size
//     fetchData(1, newPageSize);
//   };

//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No",
//       width: 80,
//     },
//     { field: "price", headerName: `Price (${currency})`, width: 150 },
//     { field: "quantity", headerName: "Quantity USDT", width: 150 },
//     { field: "limits", headerName: `Limits (${currency})`, width: 250 },
//     { field: "merchant", headerName: "Merchant", width: 250 },
//     { field: "monthlyOrders", headerName: "Monthly Orders", width: 150 },
//     { field: "monthlyRate", headerName: "Success Rate", width: 150 },
//     { field: "paymentMethods", headerName: "Payment Methods", flex: 1 },
//   ];

//   return (
//     <div style={{ padding: "2rem", height: "100vh" }}>
//       <Paper elevation={3} style={{ padding: "1rem", height: "100%" }}>
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={2}
//         >
//           <Typography variant="h5">USDT P2P Orders</Typography>
//           <Box display="flex" gap={2}>
//             <FormControl style={{ minWidth: 200 }}>
//               <InputLabel>Currency</InputLabel>
//               <Select
//                 value={currency}
//                 label="Currency"
//                 onChange={(e) => setCurrency(e.target.value)}
//               >
//                 {currencies.map((curr) => (
//                   <MenuItem key={curr.value} value={curr.value}>
//                     {curr.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button
//               variant="contained"
//               startIcon={<RefreshIcon />}
//               onClick={() => fetchData()}
//               disabled={loading}
//             >
//               Refresh
//             </Button>
//           </Box>
//         </Box>
//         <div style={{ height: "calc(100% - 70px)", width: "100%" }}>
//           <DataGrid
//             rows={orders}
//             columns={columns}
//             initialState={{
//               pagination: {
//                 pageSize: 20,
//               },
//             }}
//             pagination
//             paginationModel={{
//               pageSize,
//               page,
//             }}
//             onPaginationModelChange={(model) => {
//               console.log("Pagination changed:", model);
//               if (model.pageSize !== pageSize) {
//                 setPageSize(model.pageSize);
//                 fetchData(1, model.pageSize);
//               } else {
//                 setPage(model.page);
//                 fetchData(model.page + 1, pageSize);
//               }
//             }}
//             pageSizeOptions={[20, 50, 100]}
//             rowCount={totalRows}
//             loading={loading}
//             style={{ width: "100%" }}
//           />
//         </div>
//       </Paper>
//     </div>
//   );
// }

// export default App;

//FIXME: following is working correctly with filteration logic and excel download
// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//   Typography,
//   Paper,
//   Button,
//   Box,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import DownloadIcon from "@mui/icons-material/Download";
// import axios from "axios";
// import * as XLSX from 'xlsx';

// function App() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currency, setCurrency] = useState("INR");
//   const [pageSize, setPageSize] = useState(20);
//   const [totalRows, setTotalRows] = useState(0);
//   const [page, setPage] = useState(0);

//   const currencies = [
//     { value: "INR", label: "Indian Rupee (INR)" },
//     { value: "ZMW", label: "Zambian Kwacha (ZMW)" },
//     { value: "UGX", label: "Ugandan Shilling (UGX)" },
//     { value: "TZS", label: "Tanzanian Shilling (TZS)" },
//     { value: "KES", label: "Kenyan Shilling (KES)" },
//   ];

//   const fetchData = async (page = 1, size = pageSize) => {
//     console.log("Fetching data with page:", page, "size:", size);
//     setLoading(true);
//     try {
//       const startIndex = (page - 1) * size;
//       const requests = [];
//       const recordsNeeded = size;

//       for (let i = 0; i < Math.ceil(recordsNeeded / 20); i++) {
//         requests.push(
//           axios.post("http://localhost:5002/api/p2p-data", {
//             fiat: currency,
//             asset: "USDT",
//             tradeType: "BUY",
//             page: i + 1,
//             rows: 20,
//           })
//         );
//       }

//       const responses = await Promise.all(requests);

//       let allData = [];
//       responses.forEach((response) => {
//         allData = [...allData, ...response.data.data];
//       });

//       console.log("Total records fetched:", allData.length);

//       // Filter data based on criteria
//       const filteredData = allData.filter(order => {
//         const successRate = parseFloat(order.advertiser.monthFinishRate * 100);
//         const quantity = parseFloat(order.adv.surplusAmount);
//         return successRate > 99 && quantity > 500;
//       });

//       const sortedData = filteredData.sort(
//         (a, b) => Number(a.adv.price) - Number(b.adv.price)
//       );
//       const slicedData = sortedData.slice(0, size);

//       const ordersWithId = slicedData.map((order, index) => ({
//         id: startIndex + index,
//         serialNo: startIndex + index + 1,
//         price: order.adv.price,
//         quantity: order.adv.surplusAmount,
//         limits: `${Number(
//           order.adv.minSingleTransAmount
//         ).toLocaleString()} - ${Number(
//           order.adv.maxSingleTransAmount
//         ).toLocaleString()}`,
//         merchant: order.advertiser.nickName,
//         paymentMethods: order.adv.tradeMethods
//           .map((method) => method.tradeMethodShortName)
//           .join(", "),
//         monthlyOrders: order.advertiser.monthOrderCount,
//         monthlyRate: (order.advertiser.monthFinishRate * 100).toFixed(1) + "%",
//       }));

//       setOrders(ordersWithId);
//       setTotalRows(filteredData.length); // Update total rows to filtered count
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData(1, pageSize);
//   }, [currency, pageSize]);

//   const handleExport = () => {
//     // Prepare data for export
//     const exportData = orders.map(order => ({
//       'S.No': order.serialNo,
//       'Price': order.price,
//       'Quantity USDT': order.quantity,
//       'Limits': order.limits,
//       'Merchant': order.merchant,
//       'Monthly Orders': order.monthlyOrders,
//       'Success Rate': order.monthlyRate,
//       'Payment Methods': order.paymentMethods
//     }));

//     // Create worksheet
//     const ws = XLSX.utils.json_to_sheet(exportData);
    
//     // Create workbook
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "P2P Orders");
    
//     // Generate and download file
//     XLSX.writeFile(wb, `P2P_Orders_${currency}_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No",
//       width: 80,
//     },
//     { field: "price", headerName: `Price (${currency})`, width: 150 },
//     { field: "quantity", headerName: "Quantity USDT", width: 150 },
//     { field: "limits", headerName: `Limits (${currency})`, width: 250 },
//     { field: "merchant", headerName: "Merchant", width: 250 },
//     { field: "monthlyOrders", headerName: "Monthly Orders", width: 150 },
//     { field: "monthlyRate", headerName: "Success Rate", width: 150 },
//     { field: "paymentMethods", headerName: "Payment Methods", flex: 1 },
//   ];

//   return (
//     <div style={{ padding: "2rem", height: "100vh" }}>
//       <Paper elevation={3} style={{ padding: "1rem", height: "100%" }}>
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={2}
//         >
//           <Typography variant="h5">USDT P2P Orders</Typography>
//           <Box display="flex" gap={2}>
//             <FormControl style={{ minWidth: 200 }}>
//               <InputLabel>Currency</InputLabel>
//               <Select
//                 value={currency}
//                 label="Currency"
//                 onChange={(e) => setCurrency(e.target.value)}
//               >
//                 {currencies.map((curr) => (
//                   <MenuItem key={curr.value} value={curr.value}>
//                     {curr.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button
//               variant="contained"
//               startIcon={<RefreshIcon />}
//               onClick={() => fetchData()}
//               disabled={loading}
//             >
//               Refresh
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               startIcon={<DownloadIcon />}
//               onClick={handleExport}
//               disabled={loading || orders.length === 0}
//             >
//               Export
//             </Button>
//           </Box>
//         </Box>
//         <div style={{ height: "calc(100% - 70px)", width: "100%" }}>
//           <DataGrid
//             rows={orders}
//             columns={columns}
//             initialState={{
//               pagination: {
//                 pageSize: 20,
//               },
//             }}
//             pagination
//             paginationModel={{
//               pageSize,
//               page,
//             }}
//             onPaginationModelChange={(model) => {
//               console.log("Pagination changed:", model);
//               if (model.pageSize !== pageSize) {
//                 setPageSize(model.pageSize);
//                 fetchData(1, model.pageSize);
//               } else {
//                 setPage(model.page);
//                 fetchData(model.page + 1, pageSize);
//               }
//             }}
//             pageSizeOptions={[20, 50, 100]}
//             rowCount={totalRows}
//             loading={loading}
//             style={{ width: "100%" }}
//           />
//         </div>
//       </Paper>
//     </div>
//   );
// }

// export default App;


//FIXME: following code is working correctly for getting filtered data for all the data there is on binance site
// import React, { useState, useEffect } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//   Typography,
//   Paper,
//   Button,
//   Box,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import DownloadIcon from "@mui/icons-material/Download";
// import axios from "axios";
// import * as XLSX from 'xlsx';

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// function App() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currency, setCurrency] = useState("INR");
//   const [totalRows, setTotalRows] = useState(0);

//   const currencies = [
//     { value: "INR", label: "Indian Rupee (INR)" },
//     { value: "ZMW", label: "Zambian Kwacha (ZMW)" },
//     { value: "UGX", label: "Ugandan Shilling (UGX)" },
//     { value: "TZS", label: "Tanzanian Shilling (TZS)" },
//     { value: "KES", label: "Kenyan Shilling (KES)" },
//   ];

//   const fetchData = async () => {
//     console.log("Fetching data...");
//     setLoading(true);
//     try {
//       let allData = [];
//       let currentPage = 1;
//       let hasMoreData = true;

//       while (hasMoreData) {
//         try {
//           console.log(`Fetching page ${currentPage}`);
          
//           const response = await axios.post("http://localhost:5002/api/p2p-data", {
//             fiat: currency,
//             asset: "USDT",
//             tradeType: "SELL",
//             page: currentPage,
//             rows: 20,
//           });

//           if (response.data.data.length === 0) {
//             console.log("No more data available");
//             hasMoreData = false;
//             break;
//           }

//           allData = [...allData, ...response.data.data];
//           console.log(`Total records fetched so far: ${allData.length}`);

//           await delay(1000);
//           currentPage++;

//         } catch (err) {
//           console.error(`Error fetching page ${currentPage}:`, err);
//           hasMoreData = false;
//           break;
//         }
//       }

//       const filteredData = allData.filter(order => {
//         const successRate = parseFloat(order.advertiser.monthFinishRate * 100);
//         const quantity = parseFloat(order.adv.surplusAmount);
//         return successRate > 99 && quantity > 2500;
//       });

//       const sortedData = filteredData.sort(
//         (a, b) => Number(a.adv.price) - Number(b.adv.price)
//       );

//       const ordersWithId = sortedData.map((order, index) => ({
//         id: index,
//         serialNo: index + 1,
//         price: order.adv.price,
//         quantity: order.adv.surplusAmount,
//         limits: `${Number(
//           order.adv.minSingleTransAmount
//         ).toLocaleString()} - ${Number(
//           order.adv.maxSingleTransAmount
//         ).toLocaleString()}`,
//         merchant: order.advertiser.nickName,
//         paymentMethods: order.adv.tradeMethods
//           .map((method) => method.tradeMethodShortName)
//           .join(", "),
//         monthlyOrders: order.advertiser.monthOrderCount,
//         monthlyRate: (order.advertiser.monthFinishRate * 100).toFixed(1) + "%",
//       }));

//       setOrders(ordersWithId);
//       setTotalRows(ordersWithId.length);
//       console.log(`Showing ${ordersWithId.length} filtered records`);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [currency]);

//   const handleExport = () => {
//     const exportData = orders.map(order => ({
//       'S.No': order.serialNo,
//       'Price': order.price,
//       'Quantity USDT': order.quantity,
//       'Limits': order.limits,
//       'Merchant': order.merchant,
//       'Monthly Orders': order.monthlyOrders,
//       'Success Rate': order.monthlyRate,
//       'Payment Methods': order.paymentMethods
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "P2P Orders");
//     XLSX.writeFile(wb, `P2P_Orders_${currency}_${new Date().toISOString().split('T')[0]}.xlsx`);
//   };

//   const columns = [
//     {
//       field: "serialNo",
//       headerName: "S.No",
//       width: 80,
//     },
//     { field: "price", headerName: `Price (${currency})`, width: 150 },
//     { field: "quantity", headerName: "Quantity USDT", width: 150 },
//     { field: "limits", headerName: `Limits (${currency})`, width: 250 },
//     { field: "merchant", headerName: "Merchant", width: 250 },
//     { field: "monthlyOrders", headerName: "Monthly Orders", width: 150 },
//     { field: "monthlyRate", headerName: "Success Rate", width: 150 },
//     { field: "paymentMethods", headerName: "Payment Methods", flex: 1 },
//   ];

//   return (
//     <div style={{ padding: "2rem", height: "100vh" }}>
//       <Paper elevation={3} style={{ padding: "1rem", height: "100%" }}>
//         <Box
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//           mb={2}
//         >
//           <Typography variant="h5">USDT P2P Orders</Typography>
//           <Box display="flex" gap={2}>
//             <FormControl style={{ minWidth: 200 }}>
//               <InputLabel>Currency</InputLabel>
//               <Select
//                 value={currency}
//                 label="Currency"
//                 onChange={(e) => setCurrency(e.target.value)}
//               >
//                 {currencies.map((curr) => (
//                   <MenuItem key={curr.value} value={curr.value}>
//                     {curr.label}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <Button
//               variant="contained"
//               startIcon={<RefreshIcon />}
//               onClick={fetchData}
//               disabled={loading}
//             >
//               Refresh
//             </Button>
//             <Button
//               variant="contained"
//               color="secondary"
//               startIcon={<DownloadIcon />}
//               onClick={handleExport}
//               disabled={loading || orders.length === 0}
//             >
//               Export
//             </Button>
//           </Box>
//         </Box>
//         <div style={{ height: "calc(100% - 70px)", width: "100%" }}>
//           <DataGrid
//             rows={orders}
//             columns={columns}
//             loading={loading}
//             hideFooterPagination
//             disableSelectionOnClick
//             style={{ width: "100%" }}
//           />
//         </div>
//       </Paper>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Typography,
  Paper,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import axios from "axios";
import * as XLSX from 'xlsx';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function App() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("INR");
  const [totalRows, setTotalRows] = useState(0);

  const currencies = [
    { value: "INR", label: "Indian Rupee (INR)" },
    { value: "ZMW", label: "Zambian Kwacha (ZMW)" },
    { value: "UGX", label: "Ugandan Shilling (UGX)" },
    { value: "TZS", label: "Tanzanian Shilling (TZS)" },
    { value: "KES", label: "Kenyan Shilling (KES)" },
  ];

  const fetchData = async () => {
    console.log("Fetching data...");
    setLoading(true);
    try {
      let allData = [];
      let currentPage = 1;
      let emptyResponseCount = 0;
      const MAX_EMPTY_TRIES = 3; // Number of additional empty responses to check

      while (emptyResponseCount <= MAX_EMPTY_TRIES) {
        try {
          console.log(`Fetching page ${currentPage}`);
          
          const response = await axios.post("http://localhost:5002/api/p2p-data", {
            fiat: currency,
            asset: "USDT",
            tradeType: "SELL",
            page: currentPage,
            rows: 20,
          });

          if (response.data.data.length === 0) {
            console.log(`Empty response for page ${currentPage}`);
            emptyResponseCount++;
            if (emptyResponseCount <= MAX_EMPTY_TRIES) {
              console.log(`Trying ${MAX_EMPTY_TRIES - emptyResponseCount + 1} more times`);
            }
          } else {
            emptyResponseCount = 0; // Reset counter if we get data
            allData = [...allData, ...response.data.data];
            console.log(`Total records fetched so far: ${allData.length}`);
          }

          await delay(2000); // 2 second delay
          currentPage++;

        } catch (err) {
          console.error(`Error fetching page ${currentPage}:`, err);
          break;
        }
      }

      const filteredData = allData.filter(order => {
        const successRate = parseFloat(order.advertiser.monthFinishRate * 100);
        const quantity = parseFloat(order.adv.surplusAmount);
        return successRate > 99 && quantity > 2500;
      });

      const sortedData = filteredData.sort(
        (a, b) => Number(a.adv.price) - Number(b.adv.price)
      );

      const ordersWithId = sortedData.map((order, index) => ({
        id: index,
        serialNo: index + 1,
        price: order.adv.price,
        quantity: order.adv.surplusAmount,
        limits: `${Number(
          order.adv.minSingleTransAmount
        ).toLocaleString()} - ${Number(
          order.adv.maxSingleTransAmount
        ).toLocaleString()}`,
        merchant: order.advertiser.nickName,
        paymentMethods: order.adv.tradeMethods
          .map((method) => method.tradeMethodShortName)
          .join(", "),
        monthlyOrders: order.advertiser.monthOrderCount,
        monthlyRate: (order.advertiser.monthFinishRate * 100).toFixed(1) + "%",
      }));

      setOrders(ordersWithId);
      setTotalRows(ordersWithId.length);
      console.log(`Showing ${ordersWithId.length} filtered records out of ${allData.length} total fetched`);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
};

  useEffect(() => {
    fetchData();
  }, [currency]);

  const handleExport = () => {
    const exportData = orders.map(order => ({
      'S.No': order.serialNo,
      'Price': order.price,
      'Quantity USDT': order.quantity,
      'Limits': order.limits,
      'Merchant': order.merchant,
      'Monthly Orders': order.monthlyOrders,
      'Success Rate': order.monthlyRate,
      'Payment Methods': order.paymentMethods
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "P2P Orders");
    XLSX.writeFile(wb, `P2P_Orders_${currency}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const columns = [
    {
      field: "serialNo",
      headerName: "S.No",
      width: 80,
    },
    { field: "price", headerName: `Price (${currency})`, width: 150 },
    { field: "quantity", headerName: "Quantity USDT", width: 150 },
    { field: "limits", headerName: `Limits (${currency})`, width: 250 },
    { field: "merchant", headerName: "Merchant", width: 250 },
    { field: "monthlyOrders", headerName: "Monthly Orders", width: 150 },
    { field: "monthlyRate", headerName: "Success Rate", width: 150 },
    { field: "paymentMethods", headerName: "Payment Methods", flex: 1 },
  ];

  return (
    <div style={{ padding: "2rem", height: "100vh" }}>
      <Paper elevation={3} style={{ padding: "1rem", height: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">USDT P2P Orders</Typography>
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
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={loading || orders.length === 0}
            >
              Export
            </Button>
          </Box>
        </Box>
        <div style={{ height: "calc(100% - 70px)", width: "100%" }}>
          <DataGrid
            rows={orders}
            columns={columns}
            loading={loading}
            hideFooterPagination
            disableSelectionOnClick
            style={{ width: "100%" }}
          />
        </div>
      </Paper>
    </div>
  );
}

export default App;
