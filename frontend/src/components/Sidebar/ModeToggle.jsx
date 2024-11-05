import React from 'react';

const ModeToggle = ({ mode, setMode }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Mode</h3>
      <div className="flex justify-between items-center">
        <label className="flex items-center">
          <input
            type="radio"
            name="mode"
            value="DPV"
            checked={mode === 'DPV'}
            onChange={() => setMode('DPV')}
            className="mr-2"
          />
          DPV
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="mode"
            value="EIS"
            checked={mode === 'EIS'}
            onChange={() => setMode('EIS')}
            className="mr-2"
          />
          EIS
        </label>
      </div>
    </div>
  );
};

export default ModeToggle;
