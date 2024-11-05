import React from 'react';

const LoadingPrompt = ({ scanPhase }) => {
  return (
    <div className="mb-4 flex flex-col items-center">
      <div className="loader mb-2 w-6 h-6 border-4 border-t-4 border-t-transparent border-white rounded-full animate-spin"></div>
      <p className="text-sm">
        {scanPhase === 'searching' ? 'Searching for device...' : 'Scanning in progress...'}
      </p>
    </div>
  );
};

export default LoadingPrompt;
