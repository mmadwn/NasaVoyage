import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MetadataAnalysis = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [metadata, setMetadata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date();
    const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
    setEndDate(twoDaysAgo.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      fetchMetadata();
    }
  }, [startDate, endDate]);

  const fetchMetadata = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching metadata from ${startDate} to ${endDate}`);
      const response = await axios.get(`http://localhost:5000/api/epic/metadata/${startDate}/${endDate}`);
      console.log('Response received:', response.data);
      if (response.data.length === 0) {
        throw new Error('No data available for this date range. Try another date range.');
      }
      const processedData = response.data.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        centroidLatitude: item.centroid_coordinates.lat,
        centroidLongitude: item.centroid_coordinates.lon,
        lunarJ2000X: item.lunar_j2000_position.x,
        lunarJ2000Y: item.lunar_j2000_position.y,
        lunarJ2000Z: item.lunar_j2000_position.z,
      }));
      setMetadata(processedData);
    } catch (err) {
      console.error('Error fetching metadata:', err);
      if (err.response) {
        // Error dari respons API
        setError(`Error dari server: ${err.response.data.error || err.response.statusText}`);
      } else if (err.request) {
        // Error karena tidak ada respons
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        // Error lainnya
        setError(err.message || 'Terjadi kesalahan saat mengambil metadata.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (dataKey, color, title) => (
    <div className="chart-container" key={dataKey}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={metadata}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={color} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="metadata-analysis">
      <h2>Metadata Analysis</h2>
      <div className="date-inputs">
        <input 
          type="date" 
          value={startDate} 
          onChange={(e) => setStartDate(e.target.value)}
          max={endDate}
        />
        <input 
          type="date" 
          value={endDate} 
          onChange={(e) => setEndDate(e.target.value)}
          min={startDate}
          max={new Date().toISOString().split('T')[0]}
        />
        <button onClick={fetchMetadata}>Analisis</button>
      </div>
      {loading && <p>Memuat metadata...</p>}
      {error && <p className="error">{error}</p>}
      {metadata.length > 0 && (
        <div className="charts">
          {renderChart("centroidLatitude", "#8884d8", "Latitude Centroid")}
          {renderChart("centroidLongitude", "#82ca9d", "Longitude Centroid")}
          {renderChart("lunarJ2000X", "#ffc658", "Posisi Bulan J2000 X")}
          {renderChart("lunarJ2000Y", "#ff7300", "Posisi Bulan J2000 Y")}
          {renderChart("lunarJ2000Z", "#0088FE", "Posisi Bulan J2000 Z")}
        </div>
      )}
    </div>
  );
};

export default MetadataAnalysis;