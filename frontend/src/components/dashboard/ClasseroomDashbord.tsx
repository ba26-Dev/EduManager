import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import type { EmploiDuTemps, Sceance, CoursLayout } from '../../services/api';
import CoursCardList from '../ui/CoursCartList';
import EmploiDuTempsCard from "../ui/EmploiDuTempsCard";
import CreateCoursForm from '../ui/CreateCoursForm';
import CreateAbsenceForm from '../ui/CreateAbsenceForm';

interface Props {
  classeroomID: string;
}

const ClasseroomDashboard: React.FC<Props> = ({ classeroomID }) => {
  const { user, role } = useAuth(); // Assure-toi que user.role existe
  const [semestre, setSemestre] = useState<number>(1);
  const [emploi, setEmploi] = useState<EmploiDuTemps | null>(null);
  const [coursList, setCoursList] = useState<CoursLayout[]>([]);
  const [showCreateAbsence, setShowCreateAbsence] = useState(false);
  const [showCreateCours, setShowCreateCours] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const emploiRes = await api.get<EmploiDuTemps>(`/users/get_emploi_du_temps/classeroomID/${classeroomID}/semestre/${semestre}`);
        setEmploi(emploiRes.data);

        const coursRes = await api.get<CoursLayout[]>(`/users/get_cours_of_classeroom/classeroomID/${classeroomID}/semestre${semestre}`);
        setCoursList(coursRes.data);
      } catch (err) {
        console.error('Erreur fetch dashboard:', err);
      }
    };
    fetchData();
  }, [classeroomID, semestre]);

  console.log("role classeroom === " + user);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Classe</h1>

        {user?.role.substring(5) === 'ELEVE' && (
          <button
            onClick={() => setShowCreateAbsence(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Demande d’absence
          </button>
        )}
        {user?.role.substring(5) === 'ENSEIGNANT' && (
          <button
            onClick={() => setShowCreateCours(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Créer un cours
          </button>
        )}
        <CreateAbsenceForm
          isOpen={showCreateAbsence}
          onClose={() => setShowCreateAbsence(false)}
          eleveID={user?.id}
          semestre={semestre}
        />
        <CreateCoursForm
          isOpen={showCreateCours}
          onClose={() => setShowCreateCours(false)}
          enseignantID={user?.id || ""}
          classeroomID={classeroomID}
        />
        {/* <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {user?.role.substring(5) === 'ELEVE' ? 'Demande d’absence' :
            user?.role.substring(5) === 'ENSEIGNANT' ? 'Créer un cours' :
              user?.role.substring(5) === 'ADMIN' ? 'Gérer la classe' :
                user?.role.substring(5) === 'RESPONSABLE' ? 'Valider les absences' :
                  'Rôle inconnu'}
        </button> */}
      </header>

      <div className="flex gap-4">
        {[1, 2].map((s) => (
          <button
            key={s}
            onClick={() => setSemestre(s)}
            className={`px-4 py-2 rounded ${semestre === s
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } transition`}
          >
            Semestre {s}
          </button>
        ))}
      </div>

      {emploi ? (
        <EmploiDuTempsCard emploi={emploi} />
      ) : (
        <p>Chargement de l'emploi du temps...</p>
      )}

      <div>
        <h2 className="text-2xl font-semibold mb-4">Cours du semestre {semestre}</h2>
        <CoursCardList coursList={coursList} />
      </div>
    </div>
  );
};

export default ClasseroomDashboard;
