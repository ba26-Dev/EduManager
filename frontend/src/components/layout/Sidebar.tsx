import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';


// Définition des props
interface SidebarProps {
  isOpen: boolean;
}


const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useAuth();
  // const [isOpen, setIsOpen] = useState<boolean>(window.innerWidth >= 768); // Visible si écran md+
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderAdminMenu = () => (
    <div className="space-y-2">
      <div className="menu-section">
        <div
          className="menu-header flex items-center justify-between p-2 cursor-pointer"
          onClick={() => toggleSection('dashboard')}
        >
          <span className="font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Tableau de bord
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${openSections.dashboard ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <div className="menu-section">
        <div
          className="menu-header flex items-center justify-between p-2 cursor-pointer"
          onClick={() => toggleSection('management')}
        >
          <span className="font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Gestion
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${openSections.management ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className={`menu-content pl-8 mt-1 ${openSections.management ? 'block' : 'hidden'}`}>
          <a href="#" className="block p-2 hover:bg-blue-700 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Élèves
          </a>
          <a href="#" className="block p-2 hover:bg-blue-700 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Enseignants
          </a>
          <a href="#" className="block p-2 hover:bg-blue-700 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Classes
          </a>
        </div>
      </div>

      {/* Autres sections du menu admin... */}
    </div>
  );

  const renderTeacherMenu = () => (
    <div className="space-y-2">
      <a href="#" className="block p-2 hover:bg-blue-700 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Tableau de bord
      </a>
      <a href="#" className="block p-2 hover:bg-blue-700 rounded">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        Mes classes
      </a>
      {/* Autres éléments du menu enseignant... */}
    </div>
  );

  const getMenu = () => {
    switch (user?.role.substring(5).toLowerCase()) {
      case 'admin': return renderAdminMenu();
      case 'enseignant': return renderTeacherMenu();
      case 'eleve': return renderTeacherMenu();
      case 'parent': return renderTeacherMenu();
      default: return renderAdminMenu();
    }
  };

  return (
    <div
      id="sidebar"
      className={`sidebar-transition bg-blue-800 text-white w-64 min-h-screen fixed md:relative z-10 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300`}
    >
      <div className="p-4">
        <div className="flex items-center mb-8 cursor-pointer">
          <div className="bg-blue-600 p-2 rounded-full position-fixe">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <span className="ml-3 text-xl font-semibold">Menu</span>
        </div>

        {getMenu()}
      </div>
    </div>
  );
};

export default Sidebar;