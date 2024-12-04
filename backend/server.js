const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios'); // If you're using this to communicate with Arduino
const app = express();
const port = 3001;
const cors = require('cors');  // Import the CORS middleware

// Enable CORS for all routes
app.use(cors());  // Add this line to allow all origins

// Replace <username>, <password>, and <database> with your MongoDB Atlas credentials
mongoose.connect('mongodb+srv://alexa-88:6ZaN242kXpwSdFrq@clustersd.kabsge6.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSD')
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB Atlas:", err));
  
  // Middleware to parse JSON requests
  app.use(express.json());

// Example route to handle scanning
app.get('/start-scan', async (req, res) => {
  try {
    // Simulating Arduino communication or scan logic here
    const scanData = { status: 'Device found, Scanning in progress...', result: [{ potential: 0.1, differentialCurrent: 0.002 }] };

    res.json(scanData); // Send data back to the client
  } catch (error) {
    res.status(500).json({ error: 'Failed to start scan' });
  }
});

// Endpoint to handle EIS scan
app.get('/start-eis', async (req, res) => {
  try {
    // Simulate EIS data (replace this with actual Arduino communication if needed)
    const eisData = {
      scanData: [
        { realImpedance: 100, imaginaryImpedance: 200, frequency: 0.1, magnitude: 223.6, phase: 63.4 },
        { realImpedance: 150, imaginaryImpedance: 100, frequency: 1, magnitude: 180.3, phase: 33.7 },
        { realImpedance: 200, imaginaryImpedance: 50, frequency: 10, magnitude: 206.2, phase: 14.0 },
        { realImpedance: 250, imaginaryImpedance: 25, frequency: 100, magnitude: 251.2, phase: 5.7 },
        { realImpedance: 300, imaginaryImpedance: 10, frequency: 1000, magnitude: 300.2, phase: 1.9 },
      ],
    };

    console.log('EIS data sent:', eisData);

    res.json(eisData); // Send EIS scan data back to the client
  } catch (error) {
    console.error('Error during EIS scan:', error);
    res.status(500).json({ error: 'Failed to start EIS scan' });
  }
});


app.post('/receive-data', (req, res) => {
    const { data } = req.body;
    console.log('Received data from Arduino:', data);
  
    // You can add logic to save the data to MongoDB if needed
    res.json({ message: 'Data received successfully' });
  });
  

// Define Graph Schema
const graphSchema = new mongoose.Schema({
  data: Array, // This will store the graph data points (e.g., potential and differentialCurrent)
  timestamp: String, // This will store the time when the graph was saved
});

// Create Graph Model
const Graph = mongoose.model('Graph', graphSchema);

const generateUniqueId = () => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};


// Endpoint to save a graph when the user clicks "Save Graph"
app.post('/save-graph', async (req, res) => {
  try {
    const { data, timestamp } = req.body;

    // Create a new graph document
    const graph = new Graph({
      data,
      timestamp,
    });

    // Save it to MongoDB
    await graph.save();

    res.json({ message: 'Graph saved successfully!' });
  } catch (error) {
    console.error('Error saving graph:', error);
    res.status(500).json({ message: 'Failed to save graph.' });
  }
});

// Endpoint to retrieve all saved graphs
app.get('/graphs', async (req, res) => {
  try {
    const graphs = await Graph.find();
    console.log('Retrieved graphs:', graphs); // Log retrieved data
    res.status(200).json(graphs);
  } catch (error) {
    console.error('Error fetching graphs:', error);
    res.status(500).json({ message: 'Failed to retrieve graphs.' });
  }
});

// Route to delete a graph by its ID
app.delete('/graphs/:id', async (req, res) => {
  try {
    const graphId = req.params.id;
    await Graph.findByIdAndDelete(graphId);
    res.status(200).json({ message: 'Graph deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete graph.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

