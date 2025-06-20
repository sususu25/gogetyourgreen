const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

// Proxy requests for /products to the product-service
app.use('/products', createProxyMiddleware({ 
    target: 'http://localhost:3001', 
    changeOrigin: true,
    pathRewrite: {
        '^/products': '/', // rewrite path
    },
}));

// Add other services here
// app.use('/orders', createProxyMiddleware({ target: 'http://localhost:3003', changeOrigin: true }));

app.listen(port, () => {
    console.log(`API Gateway listening at http://localhost:${port}`);
}); 