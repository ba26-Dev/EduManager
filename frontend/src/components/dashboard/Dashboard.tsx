import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Profil from '../ui/Profil';
import ClasseroomCardList from '../ui/ClasseroomCardList';
import CreateClasseroomForm from '../ui/CreateClasseroom';
import type { Classeroom } from '../../types/auth';
import { alert, Button } from '@material-tailwind/react';

const Dashboard: React.FC = () => {
  const { user, selectedClasseroom, setSelectedClasseroom } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const isAdmin = user?.role.substring(5) === 'ADMIN'; // suppose que le role est comme "ROLE_ADMIN"

  return (
    <div id="student-dashboard" className="space-y-6 relative">
      {/* <Profil /> */}

      <div className='flex justify-between'>
        {selectedClasseroom ? (<div className="p-4 bg-slate-400 justify-start">
          <Button
            onClick={() => setSelectedClasseroom(null)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            ← Retour aux classes
          </Button>
          {/* <ClasseroomDashboard classeroomID={selectedClasseroom.id!} /> */}
        </div>) : ''
        }
        {isAdmin && (
          <div className="flex justify-end p-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              + Créer une classe
            </button>
          </div>
        )}
        {/* Si une classe est sélectionnée, affiche le tableau de bord correspondant */}
      </div>

      <ClasseroomCardList />

      {/* Modal pour créer une classe */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40
        transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl relative
          transform transition-transform duration-300 ${showModal ? 'scale-100' : 'scale-95'}
          onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique à l'intérieur">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <CreateClasseroomForm
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              onSuccess={() => { return (<>alert("Classe  créer avec succes")</>) }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
