import React from 'react';
import './ProductList.css';

const ProductList = ({ products, onProductSelect }) => {
  if (!products || products.length === 0) {
    return <p>No products available.</p>;
  }

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>New Arrivals</h2>
        <button className="shop-all-btn">SHOP ALL</button>
      </div>
      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item" onClick={() => onProductSelect(product)}>
            <div className="product-image-container">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)} USD</p>
              <div className="product-buttons">
                <button className="view-product-button">
                  VIEW PRODUCT
                </button>
                <button className="add-to-cart-button">
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 