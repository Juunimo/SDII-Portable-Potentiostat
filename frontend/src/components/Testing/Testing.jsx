import React, { useState } from 'react';
import { Line, Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Testing = () => {
  const [concentration, setConcentration] = useState('');
  const [electrodeArea, setElectrodeArea] = useState('');
  const [sigma, setSigma] = useState('');
  const [pulseDuration, setPulseDuration] = useState('');
  const [pulseTime, setPulseTime] = useState('');
  const [solutionResistance, setSolutionResistance] = useState('');
  const [chargeTransferResistance, setChargeTransferResistance] = useState('');
  const [doubleLayerCapacitance, setDoubleLayerCapacitance] = useState('');
  const [warburgCoefficient, setWarburgCoefficient] = useState('');
  const [voltammogramData, setVoltammogramData] = useState(null);
  const [nyquistData, setNyquistData] = useState(null);

  const calculateVoltammogram = () => {
    const n = 1; // Assuming single-electron transfer
    const F = 96485; // Faraday's constant in C/mol
    const D0 = 7.4e-6; // Approximate diffusion coefficient in cm²/s
    const pi = Math.PI;

    const C = parseFloat(concentration);
    const A = parseFloat(electrodeArea);
    const sigmaValue = parseFloat(sigma);
    const T = parseFloat(pulseDuration);
    const Tprime = parseFloat(pulseTime);

    if (isNaN(C) || isNaN(A) || isNaN(sigmaValue) || isNaN(T) || isNaN(Tprime) || C <= 0 || A <= 0 || T <= Tprime) {
      alert('Please enter valid positive numbers for concentration, electrode area, sigma, pulse duration, and pulse time.');
      return;
    }

    const deltaImax = (n * F * A * Math.sqrt(D0) * C * ((1 - sigmaValue) / (1 + sigmaValue))) /
                      (Math.sqrt(pi) * Math.sqrt(T - Tprime));

    const voltages = Array.from({ length: 100 }, (_, i) => i * 0.01); // 0 to 1 V
    const currents = voltages.map(V => deltaImax * Math.exp(-Math.pow(V - 0.5, 2) / 0.05)); // Gaussian-like peak

    setVoltammogramData({
      labels: voltages,
      datasets: [
        {
          label: 'Theoretical Voltammogram',
          data: currents,
          fill: false,
          borderColor: 'blue',
          tension: 0.1,
        },
      ],
    });
  };

  const calculateNyquistData = () => {
    const R_s = parseFloat(solutionResistance);
    const R_ct = parseFloat(chargeTransferResistance);
    const C_dl = parseFloat(doubleLayerCapacitance);
    const sigma = parseFloat(warburgCoefficient);
    
    const frequencies = Array.from({ length: 100 }, (_, i) => Math.pow(10, -2 + i * 0.05)); // Frequencies from 0.01 to 10^3 Hz
    const realImpedance = [];
    const imagImpedance = [];

    frequencies.forEach(f => {
      const omega = 2 * Math.PI * f;
      const Z_real = R_s + R_ct / (1 + Math.pow(omega * C_dl * R_ct, 2));
      const Z_imag = - (omega * C_dl * Math.pow(R_ct, 2)) / (1 + Math.pow(omega * C_dl * R_ct, 2)) + sigma / Math.sqrt(omega);

      realImpedance.push(Z_real);
      imagImpedance.push(Z_imag);
    });

    setNyquistData({
      datasets: [
        {
          label: 'Nyquist Plot',
          data: realImpedance.map((real, index) => ({ x: real, y: -imagImpedance[index] })), // -imag to plot positive y-axis
          borderColor: 'red',
          showLine: true,
          pointRadius: 0,
        },
      ],
    });
  };

  return (
    <div className="flex flex-col p-8 bg-gray-200 border border-gray-400 rounded-lg max-h-screen mb-4">
      {/* Top Row for Input Forms */}
      <div className="flex flex-row gap-4 mb-8">
        {/* DPV Form Section */}
        <div className="flex flex-col gap-4 p-4 w-1/2 overflow-y-auto" style={{ maxHeight: '80vh' }}>
          <h2 className="text-lg font-semibold">DPV Inputs</h2>
          <div className="flex flex-col gap-2">
            <label>1. Concentration (C*):</label>
            <input
              type="number"
              value={concentration}
              onChange={(e) => setConcentration(e.target.value)}
              placeholder="Enter concentration (e.g., 0.0001 M)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>2. Electrode Area (A):</label>
            <input
              type="number"
              value={electrodeArea}
              onChange={(e) => setElectrodeArea(e.target.value)}
              placeholder="Enter electrode area (e.g., 0.5 cm²)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>3. Sigma (σ):</label>
            <input
              type="number"
              value={sigma}
              onChange={(e) => setSigma(e.target.value)}
              placeholder="Enter sigma (e.g., 0.9)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>4. Total Pulse Duration (T):</label>
            <input
              type="number"
              value={pulseDuration}
              onChange={(e) => setPulseDuration(e.target.value)}
              placeholder="Enter total pulse duration (e.g., 5 s)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>5. Pulse Time (T'):</label>
            <input
              type="number"
              value={pulseTime}
              onChange={(e) => setPulseTime(e.target.value)}
              placeholder="Enter pulse time (e.g., 0.5 s)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <button onClick={calculateVoltammogram} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Simulate Voltammogram
          </button>
        </div>

        {/* EIS Form Section */}
        <div className="flex flex-col gap-4 p-4 w-1/2 overflow-y-auto" style={{ maxHeight: '80vh' }}>
          <h2 className="text-lg font-semibold">EIS Inputs</h2>
          <div className="flex flex-col gap-2">
            <label>1. Solution Resistance (Rₛ):</label>
            <input
              type="number"
              value={solutionResistance}
              onChange={(e) => setSolutionResistance(e.target.value)}
              placeholder="Enter solution resistance (e.g., 50 Ω)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>2. Charge Transfer Resistance (R_ct):</label>
            <input
              type="number"
              value={chargeTransferResistance}
              onChange={(e) => setChargeTransferResistance(e.target.value)}
              placeholder="Enter charge transfer resistance (e.g., 200 Ω)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>3. Double Layer Capacitance (C_dl):</label>
            <input
              type="number"
              value={doubleLayerCapacitance}
              onChange={(e) => setDoubleLayerCapacitance(e.target.value)}
              placeholder="Enter double layer capacitance (e.g., 1e-6 F)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>4. Warburg Coefficient (σ):</label>
            <input
              type="number"
              value={warburgCoefficient}
              onChange={(e) => setWarburgCoefficient(e.target.value)}
              placeholder="Enter Warburg coefficient (e.g., 0.5)"
              className="p-2 border border-gray-400 rounded"
            />
          </div>
          <button onClick={calculateNyquistData} className="mt-4 p-2 bg-green-500 text-white rounded hover:bg-green-600">
            Simulate Nyquist Plot
          </button>
        </div>
      </div>

      {/* Bottom Row for Graphs */}
      <div className="flex flex-row gap-4 p-4">
        {voltammogramData && (
          <div className="w-1/2">
            <Line data={voltammogramData} />
          </div>
        )}
        {nyquistData && (
          <div className="w-1/2">
            <Scatter
              data={nyquistData}
              options={{
                scales: {
                  x: { title: { display: true, text: 'Z (Real) [Ω]' } },
                  y: { title: { display: true, text: 'Z (Imaginary) [Ω]' } },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Testing;
