import React from 'react';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import './MainContent.css';

function MainContent({ products, selectedProduct, onProductSelect, onBackToList }) {
    return (
        <main className="main-content">
            {selectedProduct ? (
                <ProductDetail product={selectedProduct} onBackToList={onBackToList} />
            ) : (
                <ProductList products={products} onProductSelect={onProductSelect} />
            )}
        </main>
    );
}

export default MainContent; 