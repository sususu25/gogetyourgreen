const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const products = [
    { id: 1, name: 'Monstera Deliciosa', price: 25, description: 'A beautiful and easy-to-care-for plant that is known for its iconic split leaves. It prefers bright, indirect light and watering every 1-2 weeks.', image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Monstera_deliciosa.png' },
    { id: 2, name: 'Snake Plant', price: 20, description: 'A popular houseplant with stiff, upright leaves. It is very tolerant of low light and irregular watering.', image: 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg' },
    { id: 3, name: 'Fiddle Leaf Fig', price: 45, description: 'A stylish plant with large, violin-shaped leaves. It needs bright, filtered light and consistent moisture.', image: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Starr_031108-0130_Ficus_lyrata.jpg' },
    { id: 4, name: 'Pothos', price: 15, description: 'A forgiving and versatile plant with trailing, heart-shaped leaves. It can thrive in a variety of light conditions.', image: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Epipremnum_aureum_%28405626861%29.jpg' }
];

// Endpoint to get all products
app.get('/products', (req, res) => {
    console.log('Request received for all products');
    res.json(products);
});

// Endpoint to get a single product by id
app.get('/products/:id', (req, res) => {
    console.log(`Request received for product id: ${req.params.id}`);
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (product) {
        res.json(product);
    } else {
        res.status(404).send('Product not found');
    }
});

app.listen(port, () => {
    console.log(`Product service listening at http://localhost:${port}`);
}); 