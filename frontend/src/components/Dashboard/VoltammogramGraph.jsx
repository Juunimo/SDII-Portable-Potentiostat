import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const VoltammogramGraph = ({ scanData, onSaveGraph }) => {
  return (
    <div className="bg-gray-200 border border-gray-400 rounded-lg mt-10 p-4 h-90 flex flex-col justify-center items-center">
      <h2 className="text-xl font-semibold mb-5">Voltammogram Graph</h2>

      {/* Check if there is data to display */}
      {scanData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scanData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="potential" label={{ value: "Potential (V)", position: "insideBottomRight", offset: -5 }} />
            <YAxis label={{ value: "Differential Current (A)", angle: -90, position: "insideLeft" , offset: 4 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="differentialCurrent" stroke="#8884d8" activeDot={{ r: 12 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No data to display</p>
      )}

      {/* Save Graph Button */}
      <button
        onClick={onSaveGraph}  // Call the onSaveGraph function when clicked
        className="mt-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Save Graph
      </button>
    </div>
  );
};

export default VoltammogramGraph;
