import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SavedDataList = ({ savedGraphs, onDeleteGraph }) => {
  return (
    <div className="bg-gray-100 border border-gray-400 rounded-lg p-4 h-full">
      <h2 className="text-xl font-semibold mb-4">Saved Graphs</h2>

      {/* Add a scrollable area for the saved graphs */}
      <div className="overflow-y-auto" style={{ maxHeight: '900px' }}>
        {savedGraphs.length > 0 ? (
          <ul>
            {savedGraphs.map((graph, index) => (
              <li key={graph._id || index} className="mb-6"> {/* Ensure the key is unique */}
                <h3 className="text-lg font-bold mb-2">
                  Graph {index + 1} (Saved: {new Date(graph.timestamp).toLocaleString()})
                </h3>

                {/* Display the graph */}
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={graph.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="potential" label={{ value: "Potential (V)", position: "insideBottomRight", offset: -5 }} />
                    <YAxis label={{ value: "Differential Current (A)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="differentialCurrent" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>

                {/* Delete Graph Button */}
                <button
                  onClick={() => onDeleteGraph(graph._id)} // Make sure _id is being passed
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Delete Graph
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved graphs available.</p>
        )}
      </div>
    </div>
  );
};

export default SavedDataList;
