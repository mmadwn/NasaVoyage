import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AdvancedImageComparison from './AdvancedImageComparison';
import DateSelector from './DateSelector';

const ImageComparison = () => {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    setDate1(yesterday.toISOString().split('T')[0]);
    setDate2(today.toISOString().split('T')[0]);
  }, []);

  const fetchImage = useCallback(async (date) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/epic/date/${date}`);
      if (response.data.length > 0) {
        const imageData = response.data[0];
        const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date.replace(/-/g, '/')}/png/${imageData.image}.png`;
        return { url: imageUrl, caption: imageData.caption, date: date };
      }
    } catch (error) {
      console.error('Error fetching image:', error);
      setError('TERJADI KESALAHAN SAAT MENGAMBIL GAMBAR. SILAKAN COBA LAGI.');
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const fetchImages = useCallback(async () => {
    const img1 = await fetchImage(date1);
    const img2 = await fetchImage(date2);
    setImage1(img1);
    setImage2(img2);
  }, [date1, date2, fetchImage]);

  useEffect(() => {
    if (date1 && date2) {
      fetchImages();
    }
  }, [date1, date2, fetchImages]);

  const handleDateSelect1 = useCallback((date) => {
    setDate1(date);
  }, []);

  const handleDateSelect2 = useCallback((date) => {
    setDate2(date);
  }, []);

  return (
    <div className="image-comparison component-wrapper">
      <div className="comparison-header">
        <h2>PERBANDINGAN GAMBAR</h2>
        <div className="comparison-controls">
          <div className="date-inputs">
            <DateSelector onDateSelect={handleDateSelect1} selectedDate={date1} label="Tanggal 1" />
            <DateSelector onDateSelect={handleDateSelect2} selectedDate={date2} label="Tanggal 2" />
          </div>
        </div>
      </div>
      
      {loading && <div className="loading-spinner"><div className="spinner"></div><p>Memuat gambar perbandingan...</p></div>}
      {error && <div className="error">{error}</div>}
      {image1 && image2 && (
        <div className="comparison-images">
          <AdvancedImageComparison image1={image1.url} image2={image2.url} />
          <div className="image-captions">
            <p><strong>Tanggal 1:</strong> {image1.date} - {image1.caption}</p>
            <p><strong>Tanggal 2:</strong> {image2.date} - {image2.caption}</p>
          </div>
        </div>
      )}
      {(!image1 || !image2) && !loading && <p className="no-images-message">TIDAK ADA GAMBAR TERSEDIA UNTUK PERBANDINGAN. SILAKAN PILIH TANGGAL LAIN.</p>}
    </div>
  );
};

export default ImageComparison;