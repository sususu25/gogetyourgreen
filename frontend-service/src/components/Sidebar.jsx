import React from 'react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="category">
        <h3>Green</h3>
        <ul>
          <li><a href="#">Foliage Plants</a></li>
          <li><a href="#">Succulents</a></li>
          <li><a href="#">Flowering Plants</a></li>
          <li><a href="#">Herbs</a></li>
        </ul>
      </div>
      <div className="category">
        <h3>Gardening Supplies</h3>
        <ul>
          <li><a href="#">Pots & Planters</a></li>
          <li><a href="#">Soil & Fertilizer</a></li>
          <li><a href="#">Gardening Tools</a></li>
          <li><a href="#">Pest Control</a></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar; 