import React from 'react';

const Menu = ({ setSelectedPage, selectedPage }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Menu</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => setSelectedPage('Dashboard')}
            className={`block w-full text-left py-2 px-4 rounded ${
              selectedPage === 'Dashboard' ? 'bg-gray-600' : 'hover:bg-gray-600'
            }`}
          >
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => setSelectedPage('SavedData')}
            className={`block w-full text-left py-2 px-4 rounded ${
              selectedPage === 'SavedData' ? 'bg-gray-600' : 'hover:bg-gray-600'
            }`}
          >
            Saved Data
          </button>
        </li>
        {/* <li>
          <button
            onClick={() => setSelectedPage('Testing')}
            className={`block w-full text-left py-2 px-4 rounded ${
              selectedPage === 'Testing' ? 'bg-gray-600' : 'hover:bg-gray-600'
            }`}
          >
            Testing
          </button>
        </li> */}
      </ul>
    </div>
  );
};

export default Menu;
