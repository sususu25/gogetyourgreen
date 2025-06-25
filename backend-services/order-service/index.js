const express = require('express');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// In-memory array to store orders
let orders = [];
let currentId = 1;

app.get('/', (req, res) => {
    res.send('Order service is running with in-memory storage!');
});

// Endpoint to get all orders
app.get('/orders', (req, res) => {
    // Return orders sorted by creation time, descending
    res.json([...orders].reverse());
});

// Endpoint to create a new order
app.post('/orders', (req, res) => {
    const { productId, productName, price, quantity } = req.body;

    if (!productId || !productName || !price || !quantity) {
        return res.status(400).send('Missing required order information.');
    }

    const newOrder = {
        id: currentId++,
        product_id: productId,
        product_name: productName,
        price,
        quantity,
        status: 'pending',
        created_at: new Date().toISOString()
    };
    
    orders.push(newOrder);
    console.log('Order created successfully in-memory:', newOrder);
    res.status(201).json(newOrder);
});

// Endpoint to delete an order
app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    const orderIndex = orders.findIndex(o => o.id === parseInt(id));

    if (orderIndex === -1) {
        return res.status(404).send('Order not found');
    }

    orders.splice(orderIndex, 1);
    console.log(`Order with id ${id} deleted successfully.`);
    res.status(204).send();
});


app.listen(port, () => {
    console.log(`Order service listening at http://localhost:${port}`);
}); 