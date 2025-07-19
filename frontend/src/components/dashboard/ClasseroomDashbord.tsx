import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import type { EmploiDuTemps, CoursLayout, User } from '../../types/auth.d';
import CoursCardList from '../ui/CoursCartList';
import EmploiDuTempsCard from "../ui/EmploiDuTempsCard";
import CreateCoursForm from '../ui/CreateCoursForm';
import CreateAbsenceForm from '../ui/CreateAbsenceForm';
import UserListCard from '../ui/UserListCard';
import { HttpStatusCode } from 'axios';

interface Props {
  classeroomID: string;
}

interface UsersListes {
  elevesID: String[],
  enseignantsID: String[]
}


const ClasseroomDashboard: React.FC<Props> = ({ classeroomID }) => {
  const { user } = useAuth(); // Assure-toi que user.role existe
  const [semestre, setSemestre] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [emploi, setEmploi] = useState<EmploiDuTemps | null>(null);
  const [coursList, setCoursList] = useState<CoursLayout[]>([]);
  const [showCreateAbsence, setShowCreateAbsence] = useState(false);
  const [showCreateCours, setShowCreateCours] = useState(false);
  const [selectingType, setSelectingType] = useState<'eleve' | 'enseignant' | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<User[]>([])
  const [showModalUsers, setShowModalUsers] = useState(false);
  const [form, setForm] = useState<UsersListes>({
    elevesID: [],
    enseignantsID: [],
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const emploiResp = await api.get<EmploiDuTemps>(`/users/get_emploi_du_temps/classeroomID/${classeroomID}/semestre/${semestre}`);
        if (emploiResp.data.id != '') {
          setEmploi(emploiResp.data);
        } else {
          setSuccessMessage("" + emploiResp.data);
          setTimeout(() => setSuccessMessage(''), 5000)
        }

        const coursResp = await api.get<CoursLayout[]>(`/users/get_cours_of_classeroom/classeroomID/${classeroomID}/semestre/${semestre}`);
        if (emploiResp.status == HttpStatusCode.Ok) {
          setCoursList(coursResp.data);
        }
        const users = await api.get<User[]>('/users/')
        if (emploiResp.status == HttpStatusCode.Ok) {
          setUsers(users.data);
        }

      } catch (err: any) {
        setSuccessMessage(err.code);
        setTimeout(() => setSuccessMessage(''), 5000); // Cache après 5s
        console.error('Erreur fetch dashboard:', err);
      }
    };
    fetchData();
  }, [classeroomID, semestre, users]);

  const openModalFor = (type: 'eleve' | 'enseignant') => {
    setSelectingType(type);
    setSelectedUsers(new Set()); // reset sélection
    setShowModalUsers(true);
  };

  const confirmUserSelection = () => {
    if (!selectingType) return;

    const key = selectingType === 'eleve' ? 'elevesID' : 'enseignantsID';
    const newIDs = Array.from(new Set([...form[key], ...selectedUsers]));
    setForm({ ...form, [key]: newIDs });

    setShowModalUsers(false);
    setSelectedUsers(new Set());
  };

  const handleToggleUser = (userId: string, type: 'eleve' | 'enseignant') => {
    const key = type === 'eleve' ? 'elevesID' : 'enseignantsID';

    const alreadySelected = form[key].includes(userId);

    if (alreadySelected) {
      const updated = form[key].filter((id) => id !== userId);
      setForm({ ...form, [key]: updated });
    } else {
      setForm({ ...form, [key]: [...form[key], userId] });
    }
  };


  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Classe</h1>
        {successMessage && (
          <div className="bg-gray-200 text-red-900 font-bold p-3 rounded mb-2 fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            {successMessage}
          </div>
        )}
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
        {/* Afficher les bouttons d'ajout des eleves et des enseigants dans la classe */}
        {user?.role.substring(5) === 'ADMIN' && (
          <div className="flex gap-4">
            <button onClick={() => openModalFor('eleve')} className="bg-blue-500 text-white px-4 py-2 rounded">
              Ajouter des élèves
            </button>
            <button onClick={() => openModalFor('enseignant')} className="bg-green-500 text-white px-4 py-2 rounded">
              Ajouter des enseignants
            </button>
          </div>
        )}

        {/* Liste des élèves sélectionnés */}
        {form.elevesID.length > 0 && (
          <div className="mt-2">
            <strong>Élèves sélectionnés :</strong>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {form.elevesID.map((id) => {
                const user = users?.find((u) => u.id === id);
                return <li key={id.toString()}>{user?.firstname} {user?.lastname}</li>;
              })}
            </ul>
          </div>
        )}

        {/* Liste des enseignants sélectionnés */}
        {form.enseignantsID.length > 0 && (
          <div className="mt-2">
            <strong>Enseignants sélectionnés :</strong>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {form.enseignantsID.map((id) => {
                const user = users?.find((u) => u.id === id);
                return <li key={id.toString()}>{user?.firstname} {user?.lastname}</li>;
              })}
            </ul>
          </div>
        )}
        {showModalUsers && selectingType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl" onClick={() => setShowModalUsers(false)}>×</button>
              <h3 className="text-lg font-semibold mb-4">Sélectionner des {selectingType}s</h3>

              <UserListCard
                users={users.filter((u) => u.role.toLowerCase().substring(5) === selectingType)}
                selected={new Set(
                  selectingType === 'eleve' ? form.elevesID.toString() : form.enseignantsID.toString()
                )}
                onToggle={(userId) => handleToggleUser(userId, selectingType)}
              />


              <button
                onClick={confirmUserSelection}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ajouter
              </button>
            </div>
          </div>
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
