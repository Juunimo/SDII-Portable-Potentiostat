import React from 'react';
import VoltammogramGraph from '../Dashboard/VoltammogramGraph';

const SavedDataList = ({ savedGraphs, onDeleteGraph }) => {
  return (
    <div>
      {savedGraphs.map((graph, index) => (
        <div key={graph._id} className="saved-graph-item bg-gray-100 p-4 mb-4 rounded">
          <h3 className="text-lg font-bold mb-2">Graph {index + 1} (Saved: {graph.timestamp})</h3>
          <VoltammogramGraph scanDataSets={[{ data: graph.data }]} onSaveGraph={() => {}} />
          <button
            onClick={() => onDeleteGraph(graph._id)}
            className="mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Delete Graph
          </button>
        </div>
      ))}
    </div>
  );
};

export default SavedDataList;
