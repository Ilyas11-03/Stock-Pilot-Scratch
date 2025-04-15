import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { CgProfile} from "react-icons/cg"
import { IoLogOut } from "react-icons/io5";
import {motion, AnimatePresence} from "framer-motion"

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprimer le token du localStorage 
    navigate('/'); // Rediriger vers la page de connexion
  };
  return (
    <header className="text-gray-600 body-font bg-gray-800 ">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">

         {/* DropDown de déconnexion */}
         <div className="relative ">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full shadow-sm hover:bg-gray-700 focus:outline-none transition duration-300"
          > 
            <CgProfile size={30} className="text-white"/>
            <span className="text-white font-medium">Username</span>
          </button>

          <AnimatePresence>
          {/* Menu déroulant */}
          {isDropdownOpen && (
            <motion.div 
            initial={{ opacity: 0, y: 0}}
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0, y: 0}}
            transition={{ duration: 0.2}}
            className="absolute right-0 mt-2 w-48  rounded-lg shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition duration-300"
              >
               <IoLogOut size={30} className='ml-10'/>
                Déconnexion
              </button>
            </motion.div>
          )}
           </AnimatePresence>
        </div>
      </div>
         
    </header>
  );
};

export default Header;