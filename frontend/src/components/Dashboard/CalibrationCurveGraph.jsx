import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CalibrationCurveGraph = ({ peakCurrent }) => {
  // Calibration data for expected currents in scientific notation
  const calibrationData = [
    { concentration: 0, expectedCurrent: 0.0e-6 },    // No concentration, no current
    { concentration: 1, expectedCurrent: 0.5e-9 },   // Average for 1 µM (0.1 nA - 1 nA range)
    { concentration: 10, expectedCurrent: 1.5e-9 },  // Average for 10 µM (1 nA - 2 nA range)
    { concentration: 100, expectedCurrent: 11.5e-9 }, // Average for 100 µM (3 nA - 20 nA range)
    { concentration: 250, expectedCurrent: 40e-9 },   // Average for 250 µM (30 nA - 50 nA range)
    { concentration: 400, expectedCurrent: 70e-9 },   // Average for 400 µM (60 nA - 80 nA range)
    { concentration: 500, expectedCurrent: 95e-9 },   // Average for 500 µM (90 nA - 100 nA range)
  ];

  // Dataset for the measured peak current
  const measuredPoint = peakCurrent !== null
    ? [{ concentration: 300, expectedCurrent: peakCurrent }] // Replace 300 with the closest concentration
    : [];

  return (
    <div
      className="bg-gray-200 border border-gray-400 rounded-lg p-4 flex flex-col justify-center items-center relative"
      style={{ height: '500px', width: '100%' }}
    >
      <h2 className="text-xl font-semibold mb-1">Calibration Curve</h2>

      {/* Custom Y-axis Label */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '40px',
          transform: 'translateY(-50%) rotate(-90deg)',
          fontSize: '14px',
          color: '#333',
        }}
      >
        Current (A)
      </div>

      <ResponsiveContainer width="95%" height="85%">
        <LineChart
          data={calibrationData}
          margin={{ top: 5, right: 20, bottom: 20, left: 40 }} // Increased left margin for custom label
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="concentration"
            label={{ value: "Concentration (µM)", position: "insideBottom", offset: -5 }}
            type="number"
            domain={[0, 500]}
          />
          <YAxis
            type="number"
            domain={[0, 95e-9 ]}
            tickFormatter={(value) => value.toExponential(1)} // Format ticks in scientific notation
          />
          <Tooltip formatter={(value) => `${value.toExponential(1)} A`} />
          <Legend
            align="right"
            verticalAlign="top"
            wrapperStyle={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              backgroundColor: '#f9f9f9',
              width: '150px',
            }}
          />
          {/* Line for expected concentrations */}
          <Line
            type="monotone"
            dataKey="expectedCurrent"
            name="Expected"
            stroke="#8884d8"
            dot={{ r: 6, fill: 'blue' }}
          />
          {/* Dot for the measured peak current */}
          {/* {measuredPoint.length > 0 && (
            <Line
              type="monotone"
              data={measuredPoint}
              dataKey="expectedCurrent"
              name="Measured"
              stroke="red"
              dot={{ r: 8, fill: 'red' }}
              isAnimationActive={false} // Disable animation for a single point
            />
          )} */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CalibrationCurveGraph;
