import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
/*
Total Resistance: The point where the plot meets the x-axis tells us the overall resistance, like how much the system "pushes back" against the flow of electric charge.

Electron Flow Speed: The size of the arc or semi-circle on the plot shows how easily electrons move during a reaction. A big semi-circle means electrons have a hard time moving, while a small one means they move more freely.

Diffusion of Particles: If there’s a 45-degree tail on the plot, it indicates that the movement of ions (charged particles) is slowed down by diffusion, which means they’re taking time to reach the surface.
*/
const NyquistPlot = ({ nyquistData }) => (
  <div className="bg-gray-200 border border-gray-400 rounded-lg p-4 h-68 flex flex-col justify-center items-center">
    <h2 className="text-lg font-semibold mb-4 text-center">Nyquist Plot</h2>

    {nyquistData && nyquistData.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={nyquistData}>
          <CartesianGrid />
          <XAxis
            type="number"
            dataKey="real"
            name="Real Impedance"
            label={{ value: "Z' (Ohms)", position: 'insideBottomRight', offset: -5 }}
            domain={['auto', 'auto']}
          />
          <YAxis
            type="number"
            dataKey="imaginary"
            name="Imaginary Impedance"
            label={{ value: "Z'' (Ohms)", angle: -90, position: 'insideLeft' }}
            domain={['auto', 'auto']}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Line type="monotone" dataKey="imaginary" stroke="#8884d8" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p>No data to display.</p>
    )}
  </div>
);

export default NyquistPlot;
