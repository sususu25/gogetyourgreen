import React from 'react';
import './ProductDetail.css';

const ProductDetail = ({ product, onBackToList }) => {
    const handleAddToCart = () => {
        console.log('Adding to cart from detail:', product);

        fetch('http://localhost:3002/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: product.id,
                productName: product.name,
                price: product.price,
                quantity: 1, // Default quantity to 1
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Order created successfully:', data);
                alert(`${product.name} has been added to your cart!`);
            })
            .catch(error => {
                console.error('Error creating order:', error);
                alert('Failed to add item to cart.');
            });
    };

    if (!product) {
        return <div>Select a product to see details.</div>;
    }

    return (
        <div className="product-detail-card">
            <button onClick={onBackToList} className="back-to-products-btn">← Back to List</button>
            <div className="product-detail-image-container">
                <img src={product.image} alt={product.name} className="product-detail-image"/>
            </div>
            <div className="product-detail-info">
                <h2 className="product-detail-name">{product.name}</h2>
                <p className="product-detail-price">${product.price.toFixed(2)} USD</p>
                <p className="product-detail-description">{product.description}</p>
                <div className="product-detail-actions">
                    <button className="add-to-cart-btn" onClick={handleAddToCart}>ADD TO CART</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail; 