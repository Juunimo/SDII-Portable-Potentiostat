import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white h-16 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Portable Potentiostat</h1>
      </div>
    </header>
  );
};

export default Header;
