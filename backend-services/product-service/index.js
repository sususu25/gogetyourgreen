const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const products = [
    { id: 1, name: 'Monstera Deliciosa', price: 25, description: 'A beautiful and easy-to-care-for plant that is known for its iconic split leaves. It prefers bright, indirect light and watering every 1-2 weeks.', image: 'https://gogetyourgreen-images.s3.ap-northeast-2.amazonaws.com/Monstera.jpg' },
    { id: 2, name: 'Snake Plant', price: 20, description: 'A popular houseplant with stiff, upright leaves. It is very tolerant of low light and irregular watering.', image: 'https://gogetyourgreen-images.s3.ap-northeast-2.amazonaws.com/snake-plant.jpg' },
    { id: 3, name: 'Fiddle Leaf Fig', price: 45, description: 'A stylish plant with large, violin-shaped leaves. It needs bright, filtered light and consistent moisture.', image: 'https://gogetyourgreen-images.s3.ap-northeast-2.amazonaws.com/fiddle-leaf-fig.jpg' },
    { id: 4, name: 'Pothos', price: 15, description: 'A forgiving and versatile plant with trailing, heart-shaped leaves. It can thrive in a variety of light conditions.', image: 'https://gogetyourgreen-images.s3.ap-northeast-2.amazonaws.com/pothos.jpg' }
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