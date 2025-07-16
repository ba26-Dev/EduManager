import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Profil from '../ui/Profil';
import ClasseroomCardList from '../ui/ClasseroomCardList';
import CreateClasseroomForm from '../ui/CreateClasseroom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const isAdmin = user?.role.substring(5) === 'ADMIN'; // suppose que le role est comme "ROLE_ADMIN"

  return (
    <div id="student-dashboard" className="space-y-6 relative">
      <Profil />

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

      <ClasseroomCardList />

      {/* Modal pour créer une classe */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <CreateClasseroomForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
