import React, { useEffect, useState } from 'react';
import UserListCard from './UserListCard';
import { getSchoolYear, type ClasseroomFormData, type User } from '../../services/api';
import api from '../../services/api';
import EmploiDuTempsForm from './EmploiDuTempsForm';

interface CreateClasseroomFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateClasseroomForm: React.FC<CreateClasseroomFormProps> = ({
    isOpen,
    onClose,
}) => {
    const [form, setForm] = useState<ClasseroomFormData>({
        name: '',
        dateSchool: getSchoolYear(),
        emploitDuTempsIDs: ['', ''],
        elevesID: [],
        enseignantsID: [],
    });

    // const [showEleveSelector, setShowEleveSelector] = useState(false);
    // const [showEnseignantSelector, setShowEnseignantSelector] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectingType, setSelectingType] = useState<'eleve' | 'enseignant' | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

    const [users, setUsers] = useState<User[]>([])
    const [showEmploiModal, setShowEmploiModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get<User[]>(`/users/`);
                setUsers(response.data);

            } catch (err) {
                console.error('Erreur fetch dashboard:', err);
            }
        };
        fetchData();
        if (isOpen) {
            setForm({
                name: '',
                dateSchool: getSchoolYear(),
                emploitDuTempsIDs: ['', ''],
                elevesID: [],
                enseignantsID: [],
            }
            )
        }
    }, [isOpen]);
    console.log("les users ===> " + users);

    const openModalFor = (type: 'eleve' | 'enseignant') => {
        setSelectingType(type);
        setSelectedUsers(new Set()); // reset sélection
        setShowModal(true);
    };
    const confirmUserSelection = () => {
        if (!selectingType) return;

        const key = selectingType === 'eleve' ? 'elevesID' : 'enseignantsID';
        const newIDs = Array.from(new Set([...form[key], ...selectedUsers]));
        setForm({ ...form, [key]: newIDs });

        setShowModal(false);
        setSelectedUsers(new Set());
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
        const { name, value } = e.target;
        if (name === 'emploitDuTempsIDs' && index !== undefined) {
            const newIDs = [...form.emploitDuTempsIDs];
            newIDs[index] = value;
            setForm({ ...form, emploitDuTempsIDs: newIDs });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await api.post(`/users/create-classeroom`, form);
            console.log("Réponse du serveur:", response.data);
            onClose();
        } catch (err) {
            console.error('Erreur création classe:', err);
        } finally {
            setIsSubmitting(false);
        }
    };


    const filteredUsers = users.filter((u) =>
        selectingType === 'eleve'
            ? u.role?.toLowerCase().includes('eleve')
            : u.role?.toLowerCase().includes('enseignant')
    )

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
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Créer une nouvelle classe</h2>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
                <input
                    type="text"
                    name="name"
                    placeholder="Nom de la classe"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                />
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                        Année scolaire
                    </label>
                    <div className="w-full border p-2 rounded bg-gray-700 space-y-4  p-4 rounded shadow">
                        {form.dateSchool}
                    </div> 
                    <input
                        type="hidden"
                        name="dateSchool"
                        value={form.dateSchool}
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setShowEmploiModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Ajouter un emploi du temps
                </button>
                <div className="flex gap-4">
                    <button onClick={() => openModalFor('eleve')} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Ajouter des élèves
                    </button>
                    <button onClick={() => openModalFor('enseignant')} className="bg-green-500 text-white px-4 py-2 rounded">
                        Ajouter des enseignants
                    </button>
                </div>

                {/* Liste des élèves sélectionnés */}
                {form.elevesID.length > 0 && (
                    <div className="mt-2">
                        <strong>Élèves sélectionnés :</strong>
                        <ul className="list-disc ml-6 text-sm text-gray-700">
                            {form.elevesID.map((id) => {
                                const user = users?.find((u) => u.id === id);
                                return <li key={id}>{user?.firstname} {user?.lastname}</li>;
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
                                return <li key={id}>{user?.firstname} {user?.lastname}</li>;
                            })}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                >
                    {isSubmitting ? 'Création en cours...' : 'Créer la classe'}
                </button>
            </form>

            {showModal && selectingType && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                        <button className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl" onClick={() => setShowModal(false)}>×</button>
                        <h3 className="text-lg font-semibold mb-4">Sélectionner des {selectingType}s</h3>

                        <UserListCard
                            users={users.filter((u) => u.role.toLowerCase().substring(5) === selectingType)}
                            selected={new Set(
                                selectingType === 'eleve' ? form.elevesID : form.enseignantsID
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

            {showEmploiModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-xl relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                            onClick={() => setShowEmploiModal(false)}
                        >
                            ×
                        </button>

                        <EmploiDuTempsForm
                            emploitDuTempsIDs={form.emploitDuTempsIDs}
                            onChange={(updatedIDs: string[]) => {
                                setForm({ ...form, emploitDuTempsIDs: updatedIDs });
                                setShowEmploiModal(false); // Fermer le modal après ajout
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateClasseroomForm;
