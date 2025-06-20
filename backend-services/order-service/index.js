const express = require('express');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// In-memory array to store orders for now
const orders = [];

app.get('/', (req, res) => {
    res.send('Order service is running!');
});

// Endpoint to get all orders
app.get('/orders', (req, res) => {
    console.log('Request received for all orders');
    res.json(orders);
});

// Endpoint to create a new order
app.post('/orders', (req, res) => {
    const newOrder = req.body;
    newOrder.id = orders.length + 1; // Simple ID generation
    newOrder.status = 'pending';
    newOrder.createdAt = new Date();
    orders.push(newOrder);
    console.log('New order created:', newOrder);
    res.status(201).json(newOrder);
});

app.listen(port, () => {
    console.log(`Order service listening at http://localhost:${port}`);
}); 