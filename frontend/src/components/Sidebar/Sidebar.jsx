import React, { useState } from 'react';
import Menu from './Menu';
import ModeToggle from './ModeToggle';

const Sidebar = ({ setSelectedPage, selectedPage, mode, setMode, setScanData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scanPhase, setScanPhase] = useState('');

  const handleStartScan = async () => {
    console.log('Start Scan button clicked');
    setIsLoading(true);
    setScanPhase('searching');

    try {
      const response = await fetch('http://172.20.10.6/start-scan'); // Arduino IP
      if (response.ok) {
        const data = await response.json();
        console.log('Response from Arduino:', data);

        if (data.status === 'DPV scan complete') {
          setScanPhase('');
          setIsLoading(false);
          if (data.scanData) {
            setScanData(data.scanData); // Set scan data in App to display the graph
          } else {
            console.warn('No scan data received from Arduino.');
          }
        } else {
          console.error('Unexpected response from Arduino:', data);
          setIsLoading(false);
        }
      } else {
        console.error('Request failed:', response.statusText);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error sending request to Arduino:', error);
      setIsLoading(false);
    }
  };

  return (
    <aside className="fixed left-0 top-16 bg-gray-700 text-white w-64 h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <Menu setSelectedPage={setSelectedPage} selectedPage={selectedPage} />
      <ModeToggle mode={mode} setMode={setMode} />

      {scanPhase && (
        <div className="mb-4">
          <p className="text-sm">
            {scanPhase === 'searching' ? 'Searching for device...' : 'Scanning in progress...'}
          </p>
        </div>
      )}

      {/* <button
        onClick={handleStartScan}
        disabled={isLoading}
        className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Scanning...' : 'Start Scan'}
      </button> */}
    </aside>
  );
};

export default Sidebar;
