import { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Hero from './components/Hero';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showHero, setShowHero] = useState(true);

  useEffect(() => {
    if (!showHero) {
      fetch('http://localhost:3001/products')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => setProducts(data))
        .catch(error => console.error('Error fetching products:', error));
    }
  }, [showHero]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToList = () => {
    setSelectedProduct(null);
  };

  const handleExplore = () => {
    setShowHero(false);
  };

  return (
    <div className="app">
      <Header />
      {showHero ? (
        <Hero onExplore={handleExplore} />
      ) : (
        <div className="container">
          <Sidebar />
          <MainContent 
            products={products} 
            selectedProduct={selectedProduct} 
            onProductSelect={handleProductSelect}
            onBackToList={handleBackToList}
          />
        </div>
      )}
    </div>
  );
}

export default App;
