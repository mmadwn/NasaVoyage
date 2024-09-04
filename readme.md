# EPIC Earth Viewer Project User Guide

## Prerequisites

Before starting, make sure you have installed:

- Node.js (version 12 or newer)
- npm (usually installed with Node.js)

## Installation Steps

1. Clone this repository to your local computer:
   ```
   git clone https://github.com/mmadwn/nasa-epic-project.git
   ```

2. Navigate to the project directory:
   ```
   cd nasa-epic-project
   ```

3. Install dependencies for the frontend:
   ```
   cd frontend
   npm install
   ```

4. Install dependencies for the backend:
   ```
   cd ../backend
   npm install
   ```

5. Return to the main project directory:
   ```
   cd ..
   ```

6. Create a `.env` file in the backend directory and add your NASA API key:
   ```
   NASA_API_KEY=your_api_key_here
   ```

## Running the Application

1. Run the backend server:
   ```
   cd backend
   node server.js
   ```

2. In a separate terminal, run the frontend:
   ```
   cd frontend
   npm start
   ```

3. Open a browser and access `http://localhost:3000` to view the application.

## Application Features

- EPIC Image Gallery: View the latest images from NASA's EPIC.
- Earth Rotation: Observe the Earth's rotation through a series of images.
- Image Comparison: Compare Earth images from two different dates.
- Interactive Map: View image capture locations on an interactive map.
- Time-lapse Animation: Watch Earth changes in a time-lapse animation.
- Metadata Analysis: Analyze position data of Earth, Moon, and Sun.

## Troubleshooting

If you encounter issues:

1. Ensure all dependencies are correctly installed.
2. Check if your NASA API key is valid and properly set in the `.env` file.
3. Make sure no other services are using the same ports as this application.

## Contributing

Contributions are always welcome. Please create a pull request or report issues through the issue tracker.