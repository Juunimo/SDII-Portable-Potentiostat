import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CalibrationCurveGraph = () => {
  // Data for the DPV calibration curve with actual concentration values and expected peak currents
  const calibrationData = [
    { concentration: 500, expectedCurrent: 1.2 },   // Low concentration (500 µM)
    { concentration: 1000, expectedCurrent: 2.5 },  // Medium concentration (1000 µM)
    { concentration: 1500, expectedCurrent: 3.8 },  // High concentration (1500 µM)
  ];

  return (
    <div className="bg-gray-200 border border-gray-400 rounded-lg p-4 h-80 flex flex-col justify-center items-center">
      <h2 className="text-xl font-semibold mb-4">DPV Calibration Curve</h2>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={calibrationData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="concentration"
            label={{ value: "Concentration (µM)", position: "insideBottomRight", offset: -5 }}
            type="number"
            domain={[500, 'dataMax']}  // Start X-axis at 500 and extend to the max data point
          />
          <YAxis
            label={{ value: "Expected Peak Current (µA)", angle: -90, position: "insideLeft"}}
            domain={['dataMin', 'dataMax']}  // Start Y-axis at the first data point's current value
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="expectedCurrent" stroke="#8884d8" dot={true} />
        </LineChart>
      </ResponsiveContainer>

      {/* Save Graph Button */}
      <button className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
        Save Graph
      </button>
    </div>
  );
};

export default CalibrationCurveGraph;
