import React, { useState, useRef } from 'react';
import '../styles/AdvancedImageComparison.css';  // Impor CSS kembali

const AdvancedImageComparison = ({ image1, image2 }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newPosition = (x / rect.width) * 100;
      setSliderPosition(newPosition);
    }
  };

  return (
    <div 
      className="comparison-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <img src={image1} alt="First comparison image" className="comparison-image" />
      <img 
        src={image2} 
        alt="Second comparison image" 
        className="comparison-image overlay"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />
      <div 
        className="slider"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="slider-line"></div>
        <div className="slider-button"></div>
      </div>
    </div>
  );
};

export default AdvancedImageComparison;