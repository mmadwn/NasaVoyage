import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import DateSelector from './DateSelector';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// URL gambar placeholder
const placeholderImage = "https://miro.medium.com/v2/resize:fit:1400/1*cj3ZkR59MAmMkXzCOyqvWw.png";

const EarthRotation = () => {
  const [rotationImages, setRotationImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchRotationImages = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/epic/date/${date}`);
      if (response.data.length === 0) {
        setError('No data available for this date. Try another date.');
        setRotationImages([]);
      } else {
        setRotationImages(response.data);
      }
    } catch (err) {
      setError('Error mengambil data rotasi bumi. Silakan coba lagi.');
      console.error('Error mengambil data rotasi bumi:', err);
      setRotationImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initDate = new Date();
    initDate.setDate(initDate.getDate() - 2);
    const defaultDate = initDate.toISOString().split('T')[0];
    setSelectedDate(defaultDate);
    fetchRotationImages(defaultDate);
  }, [fetchRotationImages]);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
    fetchRotationImages(date);
  }, [fetchRotationImages]);

  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  }), []);

  const imageUrls = useMemo(() => 
    rotationImages.map(image => 
      `https://epic.gsfc.nasa.gov/archive/natural/${selectedDate.replace(/-/g, '/')}/png/${image.image}.png`
    ),
    [rotationImages, selectedDate]
  );

  const formatCoordinates = (coord) => {
    return `${coord.toFixed(2)}°`;
  };

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div><p>Memuat gambar rotasi bumi...</p></div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="earth-rotation component-wrapper">
      <div className="rotation-header">
        <h2>EARTH ROTATION</h2>
        <div className="rotation-controls">
          <DateSelector onDateSelect={handleDateSelect} selectedDate={selectedDate} />
        </div>
      </div>
      {rotationImages.length > 0 && (
        <div className="slider-container">
          <Slider {...settings}>
            {rotationImages.map((image, index) => (
              <div key={index} className="slide-container">
                <div className="image-wrapper">
                  <img
                    src={imageUrls[index]}
                    alt={`Rotasi Bumi ${index + 1}`}
                    className="earth-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = placeholderImage;
                    }}
                  />
                  <div className="image-overlay">
                    <div className="image-info">
                      <p><strong>Koordinat:</strong> Lat: {formatCoordinates(image.centroid_coordinates.lat)}, Lon: {formatCoordinates(image.centroid_coordinates.lon)}</p>
                      <p><strong>Matahari:</strong> X: {formatCoordinates(image.sun_j2000_position.x)}, Y: {formatCoordinates(image.sun_j2000_position.y)}, Z: {formatCoordinates(image.sun_j2000_position.z)}</p>
                      <p><strong>Bulan:</strong> X: {formatCoordinates(image.lunar_j2000_position.x)}, Y: {formatCoordinates(image.lunar_j2000_position.y)}, Z: {formatCoordinates(image.lunar_j2000_position.z)}</p>
                      <p><strong>Satelit:</strong> X: {formatCoordinates(image.dscovr_j2000_position.x)}, Y: {formatCoordinates(image.dscovr_j2000_position.y)}, Z: {formatCoordinates(image.dscovr_j2000_position.z)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "transparent" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "transparent" }}
      onClick={onClick}
    />
  );
};

export default EarthRotation;