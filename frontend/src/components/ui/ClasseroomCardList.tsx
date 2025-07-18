import React, { useState } from 'react';
import { type Classeroom } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ClasseroomDashboard from '../dashboard/ClasseroomDashbord';
import { UserGroupIcon } from '@heroicons/react/16/solid';

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {classerooms.map((room) => (
                <button
                    key={room.id}
                    onClick={() => setSelectedClasseroom(room)}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:scale-105 transition-transform hover:shadow-lg text-gray-800 text-left h-[380px] w-full"
                >
                   {room.name.startsWith('TS')?
                   <img src='src/assets/TS2.jpeg' className="bg-gray-200 border-4 border-dashed rounded-xl w-full h-[200px]"/>:
                   <img src='src/assets/CM2.jpeg' className="bg-gray-200 border-4 border-dashed rounded-xl w-full h-[200px]"/>
                   }
                    <div className='pl-[80px]'>
                        <h2 className="text-xl font-semibold mb-2 flex items-center"><UserGroupIcon className="w-5 h-5 text-gray-500 mr-2" />{room.name}</h2>
                        <p className="text-base text-gray-600 mb-1 flex items-center">
                            <span className="mr-2">📅</span>
                            Année scolaire : {room.dateSchool.substring(6)}
                        </p>
                        <p className="text-base text-gray-600 mb-1 flex items-center"><span className="mr-2">👨‍🎓</span> Élèves : {room.elevesID.length}</p>
                        <p className="text-base text-gray-600 mb-1 flex items-center"><span className="mr-2">👩‍🏫</span> Enseignants : {room.enseignantsID.length}</p>
                        {/* <p className="text-base text-gray-600">
                        🗓️ Semestres : {room.emploitDuTempsIDs.join(', ')}
                    </p> */}
                    </div>
                </button>
            ))}
        </div>

    );
};

export default ClasseroomCardList;
