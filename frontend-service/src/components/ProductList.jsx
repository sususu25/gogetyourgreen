import React, { useEffect, useState } from 'react';
import './ProductList.css';

const ProductList = ({ onProductSelect }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from the backend
    fetch('/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent the card's onClick from firing
    console.log('Adding to cart from list:', product);

    // Make a POST request to the order service
    fetch('/orders', {
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

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h2>New Arrivals 신제품</h2>
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
                <button className="add-to-cart-button" onClick={(e) => handleAddToCart(e, product)}>
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