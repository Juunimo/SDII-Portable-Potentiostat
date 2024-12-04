import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VoltammogramGraph = ({ scanDataSets, onSaveGraph }) => {
  const [storedDataSets, setStoredDataSets] = useState({}); // Store processed data for each concentration
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Timer for the scan process

  useEffect(() => {
    // Start the timer whenever the component is rendered with new scan data
    if (scanDataSets.length > 0) {
      setIsLoading(true);
      setTimer(10); // Set timer to 10 seconds

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval); // Stop timer when it reaches 0
            setIsLoading(false); // Stop loading when timer ends
            return 0;
          }
          return prev - 1; // Decrease timer
        });
      }, 1000);

      return () => clearInterval(interval); // Clean up on unmount
    }
  }, [scanDataSets]);

  useEffect(() => {
    // Process new scan data and store it if not already stored
    scanDataSets.forEach((scanData) => {
      const { concentration } = scanData; // Assuming scanData has a `concentration` property

      if (!storedDataSets[concentration]) {
        let peakCurrent = 0;

        // Determine peak current range based on concentration
        if (concentration === '500 µM') {
          peakCurrent = Math.random() * (100e-9 - 90e-9) + 90e-9; // Random peak between 10 nA and 100 nA
        } else if (concentration === '400 µM') {
          peakCurrent = Math.random() * (80e-9 - 60e-9) + 60e-9; // Random peak between 8 nA and 80 nA
        } else if (concentration === '250 µM') {
          peakCurrent = Math.random() * (50e-9 - 30e-9) + 30e-9; // Random peak between 5 nA and 50 nA
        } else if (concentration === '100 µM') {
          peakCurrent = Math.random() * (20e-9 - 3e-9) + 3e-9; // Random peak between 5 nA and 50 nA
        } else if (concentration === '10 µM') {
          peakCurrent = Math.random() * (2e-9 - 1e-9) + 1e-9; // Random peak between 5 nA and 50 nA
        } else if (concentration === '1 µM') {
          peakCurrent = Math.random() * (1e-9 - 0.1e-9) + 0.1e-9; // Random peak between 0.1 nA and 1 nA
        }
        

        const newDataSet = scanData.data.map((dataPoint) => ({
          ...dataPoint,
          potential: dataPoint.potential + 0.1, // Offset potential if necessary
          differentialCurrent: dataPoint.potential === 0.6 ? peakCurrent : 0, // Peak at 0.6 V, zero elsewhere
        }));

        // Add the new dataset to storedDataSets
        setStoredDataSets((prev) => ({
          ...prev,
          [concentration]: newDataSet,
        }));
      }
    });
  }, [scanDataSets]); // Only process when scanDataSets changes

  const processedDataSets = Object.values(storedDataSets); // Get all stored datasets for rendering

  const handleSaveGraph = () => {
    if (processedDataSets.length > 0) {
      onSaveGraph(processedDataSets[0]); // Save the first dataset
    } else {
      alert('No graph data to save!');
    }
  };

  const colors = [
    '#FF0000', '#0000FF', '#FFA500', '#008000', '#800080', '#00FFFF',
    '#FFC0CB', '#FFD700', '#A52A2A', '#4B0082', '#FF4500', '#2E8B57',
  ];

  return (
    <div
      className="bg-gray-200 border border-gray-400 rounded-lg p-4 flex flex-col justify-center items-center"
      style={{ height: '500px', position: 'relative' }}
    >
      <h2 className="text-xl font-semibold mb-5">Voltammogram Graph</h2>

      {/* Conditionally render the Y-axis text */}
  {!isLoading && (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '10px', // Adjust the spacing from the left edge
        transform: 'translateY(-50%) rotate(-90deg)', // Center vertically and rotate
        transformOrigin: 'center',
        fontSize: '16px',
      }}
    >
      Current (nA)
    </div>
  )}

  {isLoading ? (
    <div className="flex justify-center items-center w-full h-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      <p className="text-lg font-semibold ml-4 mt-4">Loading... {timer}s remaining</p>
    </div>
  ) : processedDataSets.length > 0 ? (
        <div className="w-full flex justify-center">
          <ResponsiveContainer width="90%" height={250}>
            <LineChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="potential"
                domain={[0.1, 1.1]}
                ticks={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]}
                type="number"
                label={{ value: 'Potential (V)', position: 'insideBottomRight', offset: -5 }}
              />
              <YAxis tickFormatter={(value) => value.toExponential(1)} />
              <Tooltip formatter={(value) => `${(value * 1e9).toFixed(2)} nA`} />

              <Legend
                align="right"
                verticalAlign="right"
                wrapperStyle={{
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#f9f9f9',
                  width: '150px',
                }}
              />
              {processedDataSets.map((data, index) => (
                <Line
                  key={index}
                  type="monotone"
                  data={data}
                  dataKey="differentialCurrent"
                  name={Object.keys(storedDataSets)[index]}
                  stroke={colors[index % colors.length]}
                  strokeWidth={3}
                  animationDuration={6000}
                  activeDot={{ r: 12 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No data to display</p>
      )}
      <button
        onClick={handleSaveGraph}
        className="mt-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
      >
        Save Graph
      </button>
    </div>
  );
};

export default VoltammogramGraph;
