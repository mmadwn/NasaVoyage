import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimeLapseAnimation = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([]); // Tambahkan state images

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const defaultDate = new Date();
        defaultDate.setDate(defaultDate.getDate() - 2);
        const date = selectedDate || defaultDate.toISOString().split('T')[0];
        
        const response = await axios.get(`http://localhost:5000/api/epic/date/${date}`);
        console.log('API response:', response.data);
        if (response.data.length === 0) {
          setError('NO IMAGES AVAILABLE FOR THE SELECTED DATE. PLEASE TRY ANOTHER DATE.');
          setImages([]);
        } else {
          setImages(response.data);
        }
      } catch (err) {
        console.error('Error mengambil gambar:', err);
        setError('AN ERROR OCCURRED WHILE FETCHING IMAGES. PLEASE TRY AGAIN.');
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedDate]);

  useEffect(() => {
    let interval;
    if (images.length > 0) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [images]);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    setCurrentImageIndex(0);
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div><p>Memuat animasi time-lapse...</p></div>;
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="time-lapse-animation component-wrapper">
      <div className="timelapse-header">
        <h2>TIME LAPSE ANIMATION</h2>
        <div className="timelapse-controls">
          <input 
            type="date" 
            value={selectedDate || ''}
            onChange={handleDateChange}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      {images.length > 0 ? (
        <div className="animation-container">
          <div className="timelapse-content">
            <img 
              src={`https://epic.gsfc.nasa.gov/archive/natural/${(selectedDate || new Date().toISOString().split('T')[0]).replace(/-/g, '/')}/png/${images[currentImageIndex].image}.png`} 
              alt={images[currentImageIndex].caption} 
              className="epic-image timelapse-image"
            />
            <p className="image-caption">{images[currentImageIndex].caption}</p>
          </div>
        </div>
      ) : (
        <p className="no-images-message">TIDAK ADA GAMBAR TERSEDIA UNTUK TANGGAL YANG DIPILIH.</p>
      )}
    </div>
  );
};

export default TimeLapseAnimation;