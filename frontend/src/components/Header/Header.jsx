import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlask } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 text-white h-16 p-4 shadow-md">
      <div className="w-full flex items-center">
        {/* Logo or Brand Name */}
        <div className="flex items-center space-x-2">
          <FontAwesomeIcon icon={faFlask} className="h-8 text-white" />
          <h1 className="text-xl md:text-2xl font-bold">Portable Potentiostat</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
