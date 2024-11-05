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

// Endpoint to save a graph when the user clicks "Save Graph"
app.post('/save-graph', async (req, res) => {
  const { data, timestamp } = req.body;

  try {
    const newGraph = new Graph({
      data: data,
      timestamp: timestamp || new Date().toISOString(), // Use current time if no timestamp is provided
    });

    await newGraph.save(); // Save the graph to the database
    res.status(201).json({ message: 'Graph saved successfully!' });
  } catch (error) {
    console.error('Error saving graph:', error);
    res.status(500).json({ message: 'Failed to save graph data.' });
  }
});

// Endpoint to retrieve all saved graphs
app.get('/graphs', async (req, res) => {
  try {
    const graphs = await Graph.find(); // Retrieve all graphs
    res.status(200).json(graphs); // Send the graphs back to the client
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

