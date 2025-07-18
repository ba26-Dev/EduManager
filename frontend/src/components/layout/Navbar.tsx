import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { role, logout, user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Tu peux activer/désactiver selon le besoin


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleName = () => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'enseignant': return 'Enseignant';
      case 'eleve': return 'Étudiant';
      case 'parent': return 'Parent';
      default: return 'Responsable';
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Menu */}
          <div className="flex items-center space-x-8">

            <div className="flex-shrink-0 flex items-center"> <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6m0 0l-3-3m3 3l3-3" />
            </svg> <span className="ml-2 text-xl font-bold text-indigo-600">EduManage</span>
            </div>
            <a href="#" className="text-gray-700 hover:text-indigo-600 text-sm">Nous contacter</a>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span className="text-sm text-gray-700">{getRoleName()}</span>
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profil {isLoading && (
                    <div className="h-1 bg-indigo-500 animate-pulse w-full fixed top-0 left-0 z-50"></div>
                  )}
                  </a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Compte et paramètres</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Espace rédaction</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Messages</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Notifications</a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav >
  );
};

export default Navbar;
