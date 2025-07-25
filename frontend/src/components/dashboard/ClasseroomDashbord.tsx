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
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react";
import EmploiDuTempsForm from '../ui/EmploiDuTempsForm';
interface Props {
  classeroomID: string;
  lenEmploie: number;
}

interface UsersListes {
  elevesID: String[],
  enseignantsID: String[]
}


const ClasseroomDashboard: React.FC<Props> = ({ classeroomID, lenEmploie }) => {
  const { user, selectedClasseroom } = useAuth(); // Assure-toi que user.role existe
  const [semestre, setSemestre] = useState<number>(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [emploi, setEmploi] = useState<EmploiDuTemps | null>(null);
  const [coursList, setCoursList] = useState<CoursLayout[]>([]);
  const [showCreateAbsence, setShowCreateAbsence] = useState(false);
  const [showCreateCours, setShowCreateCours] = useState(false);
  const [selectingType, setSelectingType] = useState<'eleve' | 'enseignant' | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [users, setUsers] = useState<User[]>([])
  const [showModalEmpoi, setShowModalEmploi] = useState(false);
  const [showModalUsers, setShowModalUsers] = useState(false);
  const [currentSemestre, setCurrentSemestre] = useState<number>(0);
  const [form, setForm] = useState<UsersListes>({
    elevesID: [],
    enseignantsID: [],
  });


  useEffect(() => {
    const fetchData = () => {
      api.get<EmploiDuTemps>(`/users/get_emploi_du_temps/classeroomID/${classeroomID}/semestre/${semestre}`)
        .then((response) => {
          if (response.data.id != '') {
            setEmploi(response.data);
          } else {
            setSuccessMessage("" + response.data);
            setTimeout(() => setSuccessMessage(''), 5000)
          }
        })

      api.get<CoursLayout[]>(`/users/get_cours_of_classeroom/classeroomID/${classeroomID}/semestre/${semestre}`)
        .then((response) => {
          if (response.status == HttpStatusCode.Ok) {
            setCoursList(response.data);
          }
        })
      api.get<User[]>('/users/')
        .then((response) => {
          if (response.status == HttpStatusCode.Ok) {
            setUsers(response.data);
          }
        })
    };
    fetchData();
  }, [classeroomID, semestre]);

  const onClose = () => {
    setShowModalUsers(false)
    setForm({
      elevesID: [],
      enseignantsID: [],
    });
    setSelectedUsers(new Set())
  }

  const openModalFor = (type: 'eleve' | 'enseignant') => {
    setSelectingType(type);
    setSelectedUsers(new Set()); // reset sélection
    setShowModalUsers(true);
  };

  const changeSmestre = () => {
    if (selectedClasseroom?.emploitDuTempsIDs[0] != "" && selectedClasseroom?.emploitDuTempsIDs[1] == "") {
      setCurrentSemestre(2)
    } else if (selectedClasseroom?.emploitDuTempsIDs[0] == "" && selectedClasseroom?.emploitDuTempsIDs[1] != "") {
      setCurrentSemestre(1)
    }else{
      setCurrentSemestre(1)
    }
  }

  const confirmUserSelection = () => {
    if (!selectingType) return;
    const key = selectingType === 'eleve' ? 'elevesID' : 'enseignantsID';
    const newIDs = Array.from(new Set([...form[key], ...selectedUsers]));
    setForm({ ...form, [key]: newIDs });
    if (key === 'elevesID') {
      api.put<string[]>(`/users/add-eleve/${classeroomID}`, newIDs)
        .then((response) => {
          console.log('response add eleve ==>');
          console.log(response.data);


        })
    } else {
      api.put<string[]>(`/users/add-enseignant/${classeroomID}`, newIDs)
        .then((response) => {
          console.log('response add enseignant ==>');
          console.log(response.data);
        })
    }
    onClose();
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
          <Button
            onClick={() => setShowCreateAbsence(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Demande d’absence
          </Button>
        )}
        {user?.role.substring(5) === 'ENSEIGNANT' && (
          <Button
            onClick={() => setShowCreateCours(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Créer un cours
          </Button>
        )}
        {/* Afficher les bouttons d'ajout des eleves et des enseigants dans la classe */}
        {user?.role.substring(5) === 'ADMIN' && (
          <div className="flex gap-4">
            {lenEmploie != 2 ?
              <Button onClick={() => {
                setShowModalEmploi(true)
                changeSmestre()
              }} className="bg-[#FACC15] text-white px-4 py-2 rounded">
                + emploi Du Temps
              </Button> : ''}
            <Button onClick={() => openModalFor('eleve')} className="bg-[#A78BFA] text-white px-4 py-2 rounded">
              + Eleves
            </Button>
            <Button onClick={() => openModalFor('enseignant')} className="bg-[#10B981] text-white px-4 py-2 rounded">
              + Enseignants
            </Button>
          </div>
        )}

        {showModalUsers && selectingType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <Button className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl" onClick={onClose}>×</Button>
              <h3 className="text-lg font-semibold mb-4">Sélectionner des {selectingType}s</h3>

              <UserListCard
                users={users.filter((u) => u.role.toLowerCase().substring(5) === selectingType)}
                selected={new Set(
                  selectingType === 'eleve' ? `${form.elevesID}` : `${form.enseignantsID}`
                )}
                onToggle={(userId) => handleToggleUser(userId, selectingType)}
              />


              <Button
                onClick={confirmUserSelection}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Ajouter
              </Button>
              {/* Liste des élèves sélectionnés */}
              {form.elevesID.length > 0 && (
                <div className="mt-2">
                  <strong>Élèves sélectionnés :</strong>
                  <ul className="list-disc ml-6 text-sm text-gray-700">
                    {form.elevesID.map((id) => {
                      const user = users?.find((u) => u.id === id);
                      return <li key={`${id}`}>{user?.firstname} {user?.lastname}</li>;
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
                      return <li key={`${id}`}>{user?.firstname} {user?.lastname}</li>;
                    })}
                  </ul>
                </div>
              )}
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


        {/* Modal Dialog pour NoteForm */}
        <Dialog open={showModalEmpoi} handler={() => setShowModalEmploi(false)} size="lg">
          <DialogHeader>Ajouter un emploi du temps au classe {selectedClasseroom?.name}</DialogHeader>
          <DialogBody>
            {showModalEmpoi ?
              <EmploiDuTempsForm emploitDuTempsIDs={['', '']} currentSemestre={currentSemestre} onChange={(updatedIDs: string[]) => {
                // setForm({ ...form, emploitDuTempsIDs: updatedIDs });
                setShowModalEmploi(false); // Fermer le modal après ajout
              }} /> : ''
            }
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="red" onClick={() => setShowModalEmploi(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </Dialog>
      </header>

      <div className="flex gap-4">
        {[1, 2].map((s) => (
          <Button
            key={s}
            onClick={() => setSemestre(s)}
            className={`px-4 py-2 rounded ${semestre === s
              ? 'bg-[#6366F1] text-white'
              : 'bg-[#7779cf] text-gray-700 hover:bg-gray-300'
              } transition`}
          >
            Semestre {s}
          </Button>
        ))}
      </div>

      {emploi ? (
        <EmploiDuTempsCard emploi={emploi} />
      ) : (
        <p>Chargement de l'emploi du temps...</p>
      )}

      {emploi?.id ? <div>
        <h2 className="text-2xl font-semibold mb-4">Cours du semestre {semestre}</h2>
        <CoursCardList coursList={coursList} />
      </div> : ''}
    </div>
  );
};

export default ClasseroomDashboard;
