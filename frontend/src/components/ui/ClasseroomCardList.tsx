import React, { useState } from 'react';
import { type Classeroom } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';
import ClasseroomDashboard from '../dashboard/ClasseroomDashbord';

const ClasseroomCardList: React.FC = () => {
    const { classerooms } = useAuth();
    const [selectedClasseroom, setSelectedClasseroom] = useState<Classeroom | null>(null);

    // Si une classe est sélectionnée, affiche le dashboard correspondant
    if (selectedClasseroom) {
        return (
            <div className="p-4">
                <button
                    onClick={() => setSelectedClasseroom(null)}
                    className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    ← Retour aux classes
                </button>
                <ClasseroomDashboard classeroomID={selectedClasseroom.id!} />
            </div>
        );
    }
    // Sinon, affiche la liste des cartes
    return (
        <div className="flex flex-wrap gap-4 p-4">
            {classerooms.map((room) => (
                <button
                    key={room.id}
                    onClick={() => setSelectedClasseroom(room)}
                    className="block bg-white border border-gray-200 rounded-lg shadow-md p-4 w-64 hover:scale-105 transition-transform hover:shadow-lg text-gray-800 text-left"
                >
                    <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                    <p className="text-sm text-gray-600 mb-1">
                        📅 Année scolaire : {room.dateSchool.substring(6)}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">👨‍🎓 Élèves : {room.elevesID.length}</p>
                    <p className="text-sm text-gray-600 mb-1">👩‍🏫 Enseignants : {room.enseignantsID.length}</p>
                    <p className="text-sm text-gray-600">
                        🗓️ Semestres : {room.emploitDuTempsIDs.join(', ')}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default ClasseroomCardList;
