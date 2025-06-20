require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to initialize the database
const initDb = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Connected to MySQL database!');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                product_name VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('`orders` table is ready.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to database or creating table:', error);
        // Exit process if DB connection fails
        process.exit(1);
    }
};


app.get('/', (req, res) => {
    res.send('Order service is running and connected to DB!');
});

// Endpoint to get all orders
app.get('/orders', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Error fetching orders');
    }
});

// Endpoint to create a new order
app.post('/orders', async (req, res) => {
    const { productId, productName, price, quantity } = req.body;

    if (!productId || !productName || !price || !quantity) {
        return res.status(400).send('Missing required order information.');
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO orders (product_id, product_name, price, quantity) VALUES (?, ?, ?, ?)',
            [productId, productName, price, quantity]
        );
        const newOrderId = result.insertId;
        const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [newOrderId]);
        console.log('Order created successfully in DB:', rows[0]);
        res.status(201).json(rows[0]);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Error creating order');
    }
});

// Endpoint to delete an order
app.delete('/orders/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM orders WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Order not found');
        }
        console.log(`Order with id ${id} deleted successfully.`);
        res.status(204).send(); // 204 No Content signifies success but no content to return
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).send('Error deleting order');
    }
});

app.listen(port, () => {
    console.log(`Order service listening at http://localhost:${port}`);
    initDb();
}); 