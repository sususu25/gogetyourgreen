const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 3000;

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://products:3001';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://orders:3002';

app.use(cors());
app.use(express.json());

// Proxy endpoints
app.use('/products', createProxyMiddleware({ target: PRODUCT_SERVICE_URL, changeOrigin: true }));
app.use('/orders', createProxyMiddleware({ target: ORDER_SERVICE_URL, changeOrigin: true }));

app.listen(port, () => {
    console.log(`API Gateway listening at http://localhost:${port}`);
}); 