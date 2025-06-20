import React from 'react';
import './Hero.css';

const Hero = ({ onExplore }) => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Get your green, grow your peace</h1>
        <p>
          Discover the joy of thriving plants with a trusted guide to greenery made easy. 
          Join our community of plant lovers and unlock expert tips, exclusive guides, and a library of resources to turn your space into an urban jungle.
        </p>
        <button onClick={onExplore} className="explore-button">
          EXPLORE GREENS
        </button>
      </div>
    </div>
  );
};

export default Hero; 