import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const BodePlot = ({ bodeData, arduinoIP }) => (
  <div className="bg-gray-200 border border-gray-400 rounded-lg p-4 h-67 flex flex-col justify-center items-center">
    <h2 className="text-xl font-semibold mb-4">Bode Plot</h2>

    {/* Magnitude Plot */}
    <div className="mb-4 w-full">
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={bodeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="frequency"
            scale="log"
            domain={['auto', 'auto']}
            label={{ value: "Frequency (Hz)", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            dataKey="magnitude"
            label={{ value: "Magnitude (dB)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="magnitude" stroke="#8884d8" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* Phase Plot */}
    <div className="w-full">
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={bodeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="frequency"
            scale="log"
            domain={['auto', 'auto']}
            label={{ value: "Frequency (Hz)", position: "insideBottomRight", offset: -5 }}
          />
          <YAxis
            dataKey="phase"
            label={{ value: "Phase (Degrees)", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="phase" stroke="#82ca9d" dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default BodePlot;
