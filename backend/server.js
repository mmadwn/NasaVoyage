const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const NASA_API_KEY = process.env.NASA_API_KEY;

app.get('/api/epic', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.nasa.gov/EPIC/api/natural/images',
      {
        params: {
          api_key: process.env.NASA_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching EPIC data:', error);
    res.status(500).json({ error: 'An error occurred while fetching EPIC data' });
  }
});

app.get('/api/epic/page/:page', async (req, res) => {
    const page = parseInt(req.params.page);
    const limit = 10; // Images per page
    
    try {
      const response = await axios.get(
        'https://api.nasa.gov/EPIC/api/natural/images',
        {
          params: {
            api_key: process.env.NASA_API_KEY,
          },
        }
      );
      
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedData = response.data.slice(startIndex, endIndex);
      
      res.json({
        currentPage: page,
        totalPages: Math.ceil(response.data.length / limit),
        images: paginatedData,
      });
    } catch (error) {
      console.error('Error fetching EPIC data:', error);
      res.status(500).json({ error: 'An error occurred while fetching EPIC data' });
    }
  });

  app.get('/api/epic/date/:date', async (req, res) => {
    try {
      const { date } = req.params;
      const response = await axios.get(`https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${NASA_API_KEY}`);
      
      // Memastikan semua data yang dibutuhkan untuk rotasi tersedia
      const enhancedData = response.data.map(image => ({
        ...image,
        centroid_coordinates: {
          lat: image.centroid_coordinates.lat,
          lon: image.centroid_coordinates.lon
        },
        sun_j2000_position: {
          x: image.sun_j2000_position.x,
          y: image.sun_j2000_position.y,
          z: image.sun_j2000_position.z
        },
        lunar_j2000_position: {
          x: image.lunar_j2000_position.x,
          y: image.lunar_j2000_position.y,
          z: image.lunar_j2000_position.z
        },
        dscovr_j2000_position: {
          x: image.dscovr_j2000_position.x,
          y: image.dscovr_j2000_position.y,
          z: image.dscovr_j2000_position.z
        }
      }));

      res.json(enhancedData);
    } catch (error) {
      console.error('Error fetching EPIC data:', error);
      res.status(500).json({ message: 'Error fetching EPIC data' });
    }
  });
  
  // New endpoint for fetching metadata for a specific date range
  app.get('/api/epic/metadata/:startDate/:endDate', async (req, res) => {
    const { startDate, endDate } = req.params;
    console.log(`Fetching EPIC metadata from ${startDate} to ${endDate}`);
    try {
      const response = await axios.get(
        'https://api.nasa.gov/EPIC/api/natural/all',
        {
          params: {
            api_key: process.env.NASA_API_KEY,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );
      console.log(`Received metadata for ${response.data.length} days`);
      const processedData = response.data.map(item => ({
        date: item.date,
        centroid_coordinates: item.centroid_coordinates,
        lunar_j2000_position: item.lunar_j2000_position,
      }));

      res.json(processedData);
    } catch (error) {
      console.error('Error fetching EPIC metadata:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'An error occurred while fetching EPIC metadata' });
    }
  });

app.get('/api/epic/timelapse/:startDate/:endDate', async (req, res) => {
  const { startDate, endDate } = req.params;
  try {
    const response = await axios.get(
      'https://api.nasa.gov/EPIC/api/natural/all',
      {
        params: {
          api_key: process.env.NASA_API_KEY,
          start_date: startDate,
          end_date: endDate,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching timelapse data:', error);
    res.status(500).json({ error: 'An error occurred while fetching timelapse data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});