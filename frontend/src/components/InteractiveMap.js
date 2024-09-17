import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Perbaikan ikon marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const InteractiveMap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [images, setImages] = useState([]); // Tambahkan state images

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const date = selectedDate || new Date().toISOString().split('T')[0];
        const response = await axios.get(`http://localhost:5000/api/epic/date/${date}`);
        console.log('API response:', response.data);
        setImages(response.data);
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Error fetching images. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [selectedDate]);

  if (loading) {
    return <div className="loading-spinner"><div className="spinner"></div><p>Memuat peta interaktif...</p></div>;
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="interactive-map">
      <div className="map-header">
        <h2>INTERACTIVE MAP</h2>
        <div className="map-controls">
          <input 
            type="date" 
            value={selectedDate || ''} 
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            aria-label="Pilih tanggal untuk peta"
          />
        </div>
      </div>
      {images.length > 0 ? (
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {images.map((image) => (
            <Marker key={image.identifier} position={[image.centroid_coordinates.lat, image.centroid_coordinates.lon]}>
              <Popup>
                <img src={`https://epic.gsfc.nasa.gov/archive/natural/${selectedDate || new Date().toISOString().split('T')[0].replace(/-/g, '/')}/png/${image.image}.png`} alt={image.caption} style={{ width: '100%' }} />
                <p>{image.caption}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>NO IMAGES AVAILABLE FOR THE SELECTED DATE.</p>
      )}
    </div>
  );
};

export default InteractiveMap;