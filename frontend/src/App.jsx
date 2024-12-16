import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import VoltammogramGraph from './components/Dashboard/VoltammogramGraph';
import CalibrationCurveGraph from './components/Dashboard/CalibrationCurveGraph';
import NyquistPlot from './components/Dashboard/NyquistPlot';
import BodePlot from './components/Dashboard/BodePlot';
import SavedDataList from './components/Database/SavedDataList';
import Testing from './components/Testing/Testing';


const arduinoIP = '172.20.10.9'; //PCB
//const arduinoIP = '172.20.10.6'; //EXTRA


function App() {
  const [selectedPage, setSelectedPage] = useState('Dashboard');
  const [dpvScanDataSets, setDpvScanDataSets] = useState([]);
  const [eisNyquistData, setEisNyquistData] = useState([]);
  const [eisBodeData, setEisBodeData] = useState([]);

  const [storedPeakCurrents, setStoredPeakCurrents] = useState({});


  const [mode, setMode] = useState('DPV');
  const [sampleOption, setSampleOption] = useState('C'); // New sample option
  const [concentration, setConcentration] = useState('500 µM'); // Default concentration
  const [availableConcentrations, setAvailableConcentrations] = useState(['500 µM', '400 µM', '250 µM', '100 µM', '10 µM', '1 µM', 'BUFFER']); // Updated variable name
  const [newConcentration, setNewConcentration] = useState(''); // Input for new concentration
  const [scanDataSets, setScanDataSets] = useState([]); // Store multiple scan datasets for overlay
  const [savedGraphs, setSavedGraphs] = useState([]);
  const [nyquistData, setNyquistData] = useState([]);
  const [bodeData, setBodeData] = useState([]);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [nyquistDataSets, setNyquistDataSets] = useState([]);
  const [storedDataSets, setStoredDataSets] = useState({});



  ///////////////////////////////////////////////////////////////////////

  const handleConcentrationChange = (event) => {
    setConcentration(event.target.value);
    console.log(`Concentration selected: ${event.target.value}`);
  };

  const handleAddConcentration = () => {
    let formattedConcentration = newConcentration.trim();

    // Append 'µM' if not already present
    if (!formattedConcentration.endsWith('µM')) {
      formattedConcentration += ' µM';
    }

    // Add the concentration if it's unique
    if (!availableConcentrations.includes(formattedConcentration)) {
      setAvailableConcentrations([...availableConcentrations, formattedConcentration]);
      setNewConcentration(''); // Clear the input field
      console.log(`Added new concentration: ${formattedConcentration}`);
    } else {
      alert('Please enter a valid, unique concentration!');
    }
  };


  /////////////////////////////////////////////////////////////////////////

  const startDPVScan = async () => {
    try {
      const response = await fetch(`http://${arduinoIP}/start-scan`);
      if (response.ok) {
        const data = await response.json();
        if (sampleOption === 'W') {
          // Generate flat line data when "W" is selected
          const flatLineData = data.scanData.map(dataPoint => ({
            ...dataPoint,
            differentialCurrent: 0, // Set current to zero for flat line
          }));
          setDpvScanDataSets([
            ...scanDataSets,
            { data: flatLineData, concentration }, // Include concentration with flat line data
          ]);
        } else {
          setDpvScanDataSets([
            ...scanDataSets,
            { data: data.scanData, concentration }, // Include concentration with scan data
          ]);
        }
        console.log('DPV Scan data:', data);
      } else {
        console.error('Failed to start DPV scan');
      }
    } catch (error) {
      console.error('Error during DPV scan:', error);
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  // const startEISScan = async () => {
  //   try {
  //     const response = await fetch(`http://${arduinoIP}/start-eis`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setNyquistData(data.scanData.map(item => ({
  //         real: parseFloat(item.realImpedance),
  //         imaginary: parseFloat(item.imaginaryImpedance)
  //       })));
  //       setBodeData(data.scanData.map(item => ({
  //         frequency: parseFloat(item.frequency),
  //         magnitude: parseFloat(item.magnitude),
  //         phase: parseFloat(item.phase),
  //       })));
  //       console.log('EIS Scan data:', data);
  //     } else {
  //       console.error('Failed to start EIS scan');
  //     }
  //   } catch (error) {
  //     console.error('Error during EIS scan:', error);
  //   }
  // };

  // const startEISScan = async () => {
  //   try {
  //     setTimer(120); // Set the timer to 2 minutes (120 seconds)
  //     const interval = setInterval(() => {
  //       setTimer((prevTimer) => {
  //         if (prevTimer <= 1) {
  //           clearInterval(interval); // Stop the timer at 0
  //           return 0;
  //         }
  //         return prevTimer - 1; // Decrement timer
  //       });
  //     }, 1000);

  //     const response = await fetch(`http://${arduinoIP}/start-eis`);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setNyquistData(
  //         data.scanData.map((item) => ({
  //           real: parseFloat(item.realImpedance),
  //           imaginary: parseFloat(item.imaginaryImpedance),
  //         }))
  //       );
  //       setBodeData(
  //         data.scanData.map((item) => ({
  //           frequency: parseFloat(item.frequency),
  //           magnitude: parseFloat(item.magnitude),
  //           phase: parseFloat(item.phase),
  //         }))
  //       );
  //       console.log('EIS Scan data:', data);
  //     } else {
  //       console.error('Failed to start EIS scan');
  //     }
  //   } catch (error) {
  //     console.error('Error during EIS scan:', error);
  //   }
  // };

  const startEISScan = async () => {
    try {
      setTimer(120); // Set the timer to 2 minutes (120 seconds)
      let timerCleared = false;

      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval); // Stop the timer when it reaches 0
            timerCleared = true;
            return 0;
          }
          return prevTimer - 1; // Decrement timer
        });
      }, 1000);

      const response = await fetch(`http://${arduinoIP}/start-eis`);
      if (response.ok) {
        const data = await response.json();

        // Clear the timer if the scan completes before time runs out
        if (!timerCleared) {
          clearInterval(interval);
          setTimer(0);
        }

        // Append the new scan data to nyquistDataSets
        setEisNyquistData((prevDataSets) => [
          ...prevDataSets,
          data.scanData.map((item) => ({
            real: parseFloat(item.realImpedance),
            imaginary: parseFloat(item.imaginaryImpedance),
          })),
        ]);

        setEisBodeData(
          data.scanData.map((item) => ({
            frequency: parseFloat(item.frequency),
            magnitude: parseFloat(item.magnitude),
            phase: parseFloat(item.phase),
          }))
        );
        console.log('EIS Scan data:', data);
      } else {
        throw new Error('Failed to start EIS scan');
      }
    } catch (error) {
      console.error('Error during EIS scan:', error);
      setTimer(0); // Stop the timer in case of an error
    }
  };




  ///////////////////////////////////////////////////////////////

  const handleModeChange = (selectedMode) => {
    setMode(selectedMode);
    console.log(`Mode changed to: ${selectedMode}`);
  };

  const handleSampleOptionChange = (option) => {
    setSampleOption(option);
  };

  //////////////////////////////////////////////////////////

  const handleStartScan = () => {
    if (mode === 'DPV') {
      startDPVScan();
    } else if (mode === 'EIS') {
      startEISScan();
    }
  };

  useEffect(() => {
    const fetchSavedGraphs = async () => {
      try {
        const response = await fetch('http://localhost:3001/graphs');
        const data = await response.json();
        setSavedGraphs(data);
      } catch (error) {
        console.error('Error fetching saved graphs:', error);
      }
    };
    fetchSavedGraphs();
  }, []);

  const saveCurrentGraph = async (graphToSave) => {
    try {
      const response = await fetch('http://localhost:3001/save-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphToSave),
      });
      const result = await response.json();
      console.log('Graph saved successfully:', result);
      setSavedGraphs([...savedGraphs, graphToSave]);
    } catch (error) {
      console.error('Error saving graph:', error);
    }
  };

  const deleteGraph = async (graphId) => {
    try {
      const response = await fetch(`http://localhost:3001/graphs/${graphId}`, { method: 'DELETE' });
      if (response.ok) {
        setSavedGraphs(savedGraphs.filter((graph) => graph._id !== graphId));
      }
    } catch (error) {
      console.error('Error deleting graph:', error);
    }
  };


  const peakCurrent =
    scanDataSets.length > 0
      ? Math.max(
        ...scanDataSets[scanDataSets.length - 1].data.map(
          (dataPoint) => dataPoint.differentialCurrent * 1e6 // Convert to µA
        )
      )
      : null;


  return (
    <div>
      <Header />
      <Sidebar
        setSelectedPage={setSelectedPage}
        selectedPage={selectedPage}
        mode={mode}
        setMode={handleModeChange}
      />
      <main className="ml-64 mt-16 p-4 h-[calc(100vh-4rem)] overflow-hidden flex flex-col gap-8">
        <div>
          <button onClick={() => handleSampleOptionChange('C')} className={`px-4 py-2 ${sampleOption === 'C' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>C</button>
          <button onClick={() => handleSampleOptionChange('W')} className={`ml-2 px-4 py-2 ${sampleOption === 'W' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>W</button>
          <select
            value={concentration}
            onChange={handleConcentrationChange}
            className="ml-4 px-4 py-2 bg-gray-200 border border-gray-400 rounded"
          >
            {availableConcentrations.map((conc, index) => (
              <option key={index} value={conc}>
                {conc}
              </option>
            ))}
          </select>

          <div className="flex items-center mt-2">
            <input
              type="text"
              placeholder="Add concentration"
              value={newConcentration}
              onChange={(e) => setNewConcentration(e.target.value)}
              className="px-4 py-2 border border-gray-400 rounded"
            />
            <button
              onClick={handleAddConcentration}
              className="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
        </div>
        {selectedPage === 'Dashboard' ? (
          <>
            {mode === 'DPV' ? (
              <>
                <VoltammogramGraph
                  scanDataSets={dpvScanDataSets}
                  onSaveGraph={saveCurrentGraph}
                  selectedConcentration={concentration}
                  storedPeakCurrents={storedPeakCurrents}
                  setStoredPeakCurrents={setStoredPeakCurrents}
                  storedDataSets={storedDataSets}
                  setStoredDataSets={setStoredDataSets}
                />
                <CalibrationCurveGraph peakCurrent={peakCurrent} />
              </>
            ) : (
              <>
                <NyquistPlot nyquistDataSets={eisNyquistData} selectedConcentration={concentration}
                />
                <BodePlot bodeData={eisBodeData} arduinoIP={arduinoIP} />
              </>
            )}
          </>
        ) : selectedPage === 'SavedData' ? (
          <SavedDataList
            savedGraphs={savedGraphs}
            onDeleteGraph={deleteGraph}
          />
        ) : selectedPage === 'Testing' ? (
          <Testing />
        ) : (
          <p>Select a page from the sidebar.</p>
        )}
        <button
          onClick={handleStartScan}
          className="bg-green-300 text-white py-2 px-4 rounded hover:bg-green-700 active:scale-95 transition-transform duration-150"
        >
          Start {mode} Scan
        </button>
        {mode === 'EIS' && timer > 0 && (
          <p className="mt-2 text-lg font-semibold text-red-500">
            Timer: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')} remaining
          </p>
        )}

      </main>
    </div>
  );
}

export default App;
