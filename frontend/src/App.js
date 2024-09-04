import React, { useState, useEffect } from 'react';
import ImageGallery from './components/ImageGallery';
import EarthRotation from './components/EarthRotation';
import ImageComparison from './components/ImageComparison';
import InteractiveMap from './components/InteractiveMap';
import TimeLapseAnimation from './components/TimeLapseAnimation';
import './styles/main.css';
import spaceVideo from './assets/space-background.mp4'; // Pastikan untuk menambahkan video ini ke folder assets

function App() {
  const [activeComponent, setActiveComponent] = useState('gallery');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  const handleTitleClick = () => {
    setActiveComponent('gallery');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <div className="App">
      <video autoPlay loop muted className="video-background">
        <source src={spaceVideo} type="video/mp4" />
        YOUR BROWSER DOES NOT SUPPORT THE VIDEO TAG.
      </video>
      <header className={isHeaderVisible ? '' : 'hidden'}>
        <div>
          <h1 onClick={handleTitleClick}>EPIC EXPLORER</h1>
        </div>
        <nav>
          <ul>
            <li className={activeComponent === 'gallery' ? 'active' : ''}>
              <a href="#" onClick={() => handleComponentChange('gallery')} aria-label="View Image Gallery">GALLERY</a>
            </li>
            <li className={activeComponent === 'rotation' ? 'active' : ''}>
              <a href="#" onClick={() => handleComponentChange('rotation')} aria-label="View Earth Rotation">ROTATION</a>
            </li>
            <li className={activeComponent === 'map' ? 'active' : ''}>
              <a href="#" onClick={() => handleComponentChange('map')} aria-label="View Interactive Map">MAP</a>
            </li>
            <li className={activeComponent === 'timelapse' ? 'active' : ''}>
              <a href="#" onClick={() => handleComponentChange('timelapse')} aria-label="View Time Lapse">TIMELAPSE</a>
            </li>
            <li className={activeComponent === 'comparison' ? 'active' : ''}>
              <a href="#" onClick={() => handleComponentChange('comparison')} aria-label="Compare Images">COMPARE</a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="component-container">
        {activeComponent === 'gallery' && <ImageGallery />}
        {activeComponent === 'rotation' && <EarthRotation />}
        {activeComponent === 'map' && <InteractiveMap />}
        {activeComponent === 'timelapse' && <TimeLapseAnimation />}
        {activeComponent === 'comparison' && <ImageComparison />}
      </main>
      <footer>
        <p>DATA PROVIDED BY NASA EPIC API</p>
      </footer>
    </div>
  );
}

export default App;