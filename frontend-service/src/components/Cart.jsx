import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3002/orders')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            })
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="cart-container"><p>Loading your cart...</p></div>;
    if (error) return <div className="cart-container"><p>Error: {error}</p></div>;

    const totalPrice = orders.reduce((total, order) => total + (parseFloat(order.price) * order.quantity), 0);

    const handleDelete = (orderId) => {
        // Optimistically remove the item from the UI
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));

        fetch(`http://localhost:3002/orders/${orderId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok && response.status !== 204) {
                console.error('Failed to delete order from server.');
                // Optionally, re-fetch orders to sync with the server state in case of an error
            }
        })
        .catch(error => {
            console.error('Error deleting order:', error);
            // Handle error, e.g., show a notification and re-fetch to restore the item
        });
    };

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            {orders.length === 0 ? (
                <p className="empty-cart-message">Your cart is empty.</p>
            ) : (
                <>
                    <div className="cart-items">
                        {orders.map(order => (
                            <div key={order.id} className="cart-item">
                                <div className="cart-item-details">
                                    <h3>{order.product_name}</h3>
                                    <p className="cart-item-price">Price: ${parseFloat(order.price).toFixed(2)}</p>
                                    <p className="cart-item-quantity">Quantity: {order.quantity}</p>
                                </div>
                                <div className="cart-item-actions">
                                    <span className="cart-item-total">
                                        ${(parseFloat(order.price) * order.quantity).toFixed(2)}
                                    </span>
                                    <button onClick={() => handleDelete(order.id)} className="delete-item-button">×</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cart-summary">
                        <h2 className="cart-total">Total: ${totalPrice.toFixed(2)}</h2>
                        <button className="checkout-button">Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart; 