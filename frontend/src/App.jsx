import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import VoltammogramGraph from './components/Dashboard/VoltammogramGraph';
import CalibrationCurveGraph from './components/Dashboard/CalibrationCurveGraph';
import NyquistPlot from './components/Dashboard/NyquistPlot';
import BodePlot from './components/Dashboard/BodePlot'; // Import BodePlot
import SavedDataList from './components/Database/SavedDataList';
import Testing from './components/Testing/Testing';
import ModeToggle from './components/Sidebar/ModeToggle';
const arduinoIP = '172.20.10.6'; // Example Arduino IP

function App() {
  

  const [selectedPage, setSelectedPage] = useState('Dashboard'); // Track the current page
  const [mode, setMode] = useState('DPV'); // Track DPV or EIS mode
  const [scanData, setScanData] = useState([]);  // Store the scan data
  const [savedGraphs, setSavedGraphs] = useState([]); // Store the saved graphs
  const [nyquistData, setNyquistData] = useState([]);
  const [bodeData, setBodeData] = useState([]);


// Function to handle DPV scan
const startDPVScan = async () => {
  try {
    const response = await fetch(`http://${arduinoIP}/start-scan`);
    if (response.ok) {
      const data = await response.json();
      setScanData(data.scanData);  // Set DPV scan data
      console.log('DPV Scan data:', data);
    } else {
      console.error('Failed to start DPV scan');
    }
  } catch (error) {
    console.error('Error during DPV scan:', error);
  }
};

// Function to handle EIS scan
const startEISScan = async () => {
  try {
    const response = await fetch(`http://${arduinoIP}/start-eis`);
    if (response.ok) {
      const data = await response.json();
      setNyquistData(data.scanData.map(item => ({
        real: parseFloat(item.realImpedance),
        imaginary: parseFloat(item.imaginaryImpedance)
      })));  // Set EIS scan data
      setBodeData(
        data.scanData.map(item => ({
          frequency: parseFloat(item.frequency),
          magnitude: parseFloat(item.magnitude),
          phase: parseFloat(item.phase),
        }))
      );
      console.log('EIS Scan data:', data);
    } else {
      console.error('Failed to start EIS scan');
    }
  } catch (error) {
    console.error('Error during EIS scan:', error);
  }
};

// Function to handle mode change without starting a scan
const handleModeChange = (selectedMode) => {
  setMode(selectedMode);
  console.log(`Mode changed to: ${selectedMode}`);
};

// Function to handle start scan button click
const handleStartScan = () => {
  console.log('Start Scan button clicked');
  if (mode === 'DPV') {
    startDPVScan();  // Trigger DPV scan only if DPV is selected
  } else if (mode === 'EIS') {
    startEISScan();  // Trigger EIS scan only if EIS is selected
  }
};

  // Fetch saved graphs from the backend when the app loads
  useEffect(() => {
    const fetchSavedGraphs = async () => {
      try {
        const response = await fetch('http://localhost:3001/graphs');
        const data = await response.json();
        setSavedGraphs(data); // Set the fetched saved graphs into state
      } catch (error) {
        console.error('Error fetching saved graphs:', error);
      }
    };

    fetchSavedGraphs();
  }, []); // Run once when the app loads

  // Function to delete a graph
  const deleteGraph = async (graphId) => {
    try {
      // Send a delete request to the backend
      const response = await fetch(`http://localhost:3001/graphs/${graphId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the deleted graph from the frontend state
        setSavedGraphs(savedGraphs.filter(graph => graph._id !== graphId));
        alert('Graph deleted successfully!');
      } else {
        console.error('Failed to delete graph');
      }
    } catch (error) {
      console.error('Error deleting graph:', error);
    }
  };

  // Function to save the current graph to the backend
  const saveCurrentGraph = async () => {
    if (scanData.length > 0) {
      const currentTimestamp = new Date().toLocaleString(); // Get the current date and time
      const graphToSave = {
        data: scanData, // Graph data
        timestamp: currentTimestamp, // Save the timestamp
      };

      try {
        const response = await fetch('http://localhost:3001/save-graph', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(graphToSave), // Send graph data to the backend
        });

        const result = await response.json();
        console.log(result.message); // Output the result message from the backend

        // Add the saved graph to the local state
        setSavedGraphs([...savedGraphs, graphToSave]);

        alert("Graph saved!"); // Alert the user that the graph has been saved
      } catch (error) {
        console.error('Error saving graph:', error);
        alert('Error saving graph!');
      }
    } else {
      alert("No graph data to save!"); // Warn if no graph data is available
    }
  };


  return (
    <div>
      <Header />
      <Sidebar
        setSelectedPage={setSelectedPage}
        selectedPage={selectedPage}
        mode={mode}
        setMode={handleModeChange}  // Only change mode, don't trigger scan
      />

      {/* Main content area that changes based on the selected page */}
      <main className="ml-64 mt-16 p-4 h-[calc(100vh-4rem)] overflow-hidden flex flex-col gap-8">
        {selectedPage === 'Dashboard' ? (
          <>
            {mode === 'DPV' ? (
              <>
                <VoltammogramGraph
                  scanData={scanData}
                  onSaveGraph={saveCurrentGraph} // Pass save function to the graph
                />
                <CalibrationCurveGraph />
              </>
            ) : (
              <>
      {/* Pass nyquistData and bodeData to their respective components */}
      <NyquistPlot nyquistData={nyquistData} arduinoIP={arduinoIP} />
        <BodePlot bodeData={bodeData} arduinoIP={arduinoIP} />
              </>
            )}
          </>
        ) : selectedPage === 'SavedData' ? (
          <SavedDataList 
            savedGraphs={savedGraphs}
            onDeleteGraph={deleteGraph} // Pass the delete function to the SavedDataList component
          /> // Display saved graphs
        ) : selectedPage === 'Testing' ? (
          <Testing />
        ) : (
          <p>Select a page from the sidebar.</p>
        )}
        <button
          onClick={handleStartScan}  // Trigger scan only on button click
          className="bg-green-300 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Start {mode} Scan
        </button>
      </main>
    </div>
  );
}

export default App;
