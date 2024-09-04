import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import EpicImage from './EpicImage';
import DateSelector from './DateSelector';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (selectedDate) {
        response = await axios.get(`/api/epic/date/${selectedDate}`);
        setImages(response.data);
      } else {
        const today = new Date();
        today.setDate(today.getDate() - 2); // Ambil data 2 hari yang lalu
        const defaultDate = today.toISOString().split('T')[0];
        response = await axios.get(`/api/epic/date/${defaultDate}`);
        setImages(response.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil gambar. Silakan coba lagi.');
      setLoading(false);
      console.error('Error fetching images:', err);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleDateSelect = useCallback((date) => {
    setSelectedDate(date);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: "gallery-slider"
  };

  if (loading) return <div className="loading-spinner"><div className="spinner"></div><p>Memuat gambar...</p></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="image-gallery component-wrapper">
      <div className="gallery-header">
        <h2>GALERI GAMBAR EPIC</h2>
        <div className="gallery-controls">
          <DateSelector onDateSelect={handleDateSelect} />
        </div>
      </div>

      {images.length > 0 ? (
        <div className="slider-container">
          <Slider {...settings}>
            {images.map((image) => (
              <div key={image.identifier} className="slide-item">
                <EpicImage image={image} />
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <p className="no-images-message">TIDAK ADA GAMBAR TERSEDIA UNTUK TANGGAL YANG DIPILIH.</p>
      )}
    </div>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
};

export default ImageGallery;