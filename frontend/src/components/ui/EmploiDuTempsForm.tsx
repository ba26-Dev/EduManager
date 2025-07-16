import React, { useEffect, useState } from 'react';
import type { EmploiDuTemps, Sceance } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';
import api from '../../services/api';

interface Props {
    emploitDuTempsIDs: string[];
    onChange: (ids: string[]) => void;
}

const EmploiDuTempsForm: React.FC<Props> = ({ emploitDuTempsIDs, onChange }) => {
    const [semestre, setSemestre] = useState<number>(1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sceances, setSceances] = useState<Sceance[]>([]);
    const [showModal, setShowModal] = useState(false);

    // Sceance temporaire pour le popup
    const [tempSceance, setTempSceance] = useState<Omit<Sceance, 'id'>>({
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        matiere: '',
    });

    const handleAddSceance = () => {
        const newSceance: Sceance = {
            id: uuidv4(),
            ...tempSceance,
        };
        setSceances((prev) => [...prev, newSceance]);
        setTempSceance({ dayOfWeek: '', startTime: '', endTime: '', matiere: '' });
        setShowModal(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const emploiDuTemps: EmploiDuTemps = {
            id: uuidv4(),
            semestre,
            startDate,
            endDate,
            sceances,
        };

        console.log('Emploi du temps créé :', emploiDuTemps);
        // Envoyer vers le backend ici...
        // Appelle onChange avec le nouvel ID ajouté
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await api.post(`/add-emploi-du-temps`, emploiDuTemps);
                    console.log(response.data);
                    onChange([...emploitDuTempsIDs, response.data.id]);

                } catch (err) {
                    console.error('Erreur fetch dashboard:', err);
                }
            };
            fetchData();
        }, []);

    };

    return (
        <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Créer un emploi du temps</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    placeholder="Semestre"
                    value={semestre}
                    onChange={(e) => setSemestre(Number(e.target.value))}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="date"
                    placeholder="Date de début"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="date"
                    placeholder="Date de fin"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />

                <div>
                    <h3 className="text-md font-semibold">Séances :</h3>
                    {sceances.length > 0 ? (
                        <ul className="list-disc ml-6 text-sm">
                            {sceances.map((s) => (
                                <li key={s.id}>
                                    {s.dayOfWeek} - {s.matiere} ({s.startTime} - {s.endTime})
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">Aucune séance ajoutée</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4  m-4 w-full max-w-md relative">
                    <button
                        type="button"
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Ajouter une séance
                    </button>

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                    >
                        Créer l'emploi du temps
                    </button>

                </div>
            </form>

            {/* Modal de création de séance */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                        <h3 className="text-lg font-bold mb-4">Ajouter une séance</h3>
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Jour (ex: Lundi)"
                                value={tempSceance.dayOfWeek}
                                onChange={(e) => setTempSceance({ ...tempSceance, dayOfWeek: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Matière"
                                value={tempSceance.matiere}
                                onChange={(e) => setTempSceance({ ...tempSceance, matiere: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="time"
                                value={tempSceance.startTime}
                                onChange={(e) => setTempSceance({ ...tempSceance, startTime: e.target.value })}
                                className="w-full border p-2 rounded"
                            />
                            <input
                                type="time"
                                value={tempSceance.endTime}
                                onChange={(e) => setTempSceance({ ...tempSceance, endTime: e.target.value })}
                                className="w-full border p-2 rounded"
                            />

                            <button
                                type="button"
                                onClick={handleAddSceance}
                                className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Ajouter la séance
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmploiDuTempsForm;

