import React from 'react';
import './ProductDetail.css';

function ProductDetail({ product, onBackToList }) {
    if (!product) {
        return <div>Select a product to see details.</div>;
    }

    return (
        <div className="product-detail">
            <button onClick={onBackToList} className="back-button">← Back to List</button>
            <div className="detail-content">
                <img src={product.image} alt={product.name} />
                <div className="product-info">
                    <h2>{product.name}</h2>
                    <p className="price">${product.price}</p>
                    <p className="description">{product.description}</p>
                    <button className="add-to-cart-btn">ADD TO CART</button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail; 