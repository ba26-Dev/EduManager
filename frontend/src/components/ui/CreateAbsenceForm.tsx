import React, { useEffect, useState } from 'react';
import api from '../../services/api';

interface CreateAbsenceProps {
    isOpen: boolean;
    onClose: () => void;
    eleveID?: string;
    semestre: number;
}

const CreateAbsenceForm: React.FC<CreateAbsenceProps> = ({ isOpen, onClose, eleveID, semestre }) => {
    const [date, setDate] = useState('');
    const [motif, setMotif] = useState('');
    const [preuve, setPreuve] = useState('');
    const [justify, setJustify] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const absence = {
            date,
            eleveID,
            motif,
            preuve,
            semestre,
            status: false,
            justify
        };

        // useEffect(() => {
        const today = new Date();
        const formatted = today.toLocaleDateString('fr-FR'); // Donne "16/07/2025"
        const [jour, mois, annee] = formatted.split('/');
        setDate(`${jour}-${mois}-${annee}`); // Format "dd-MM-yyyy"
        const fetchData = async () => {
            try {
                const response = await api.post('/users/request_absence', absence);
                setSuccessMessage('Demande envoyée avec succès !');
                setTimeout(() => setSuccessMessage(''), 5000); // Cache après 5s
                onClose();
            } catch (err) {
                console.error('Erreur lors de l’envoi de l’absence:', err);
            }
        }
        fetchData();
        // }, []);

    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                <h2 className="text-xl font-semibold mb-4">Demande d’absence</h2>
                {successMessage && (
                    <div className="bg-green-100 text-green-800 p-3 rounded mb-2">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full border rounded px-3 py-2" />
                    <input type="text" value={motif} placeholder="Motif" onChange={(e) => setMotif(e.target.value)} required className="w-full border rounded px-3 py-2" />
                    <input type="text" value={preuve} placeholder="Lien ou description de la preuve" onChange={(e) => setPreuve(e.target.value)} className="w-full border rounded px-3 py-2" />
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={justify} onChange={() => setJustify(!justify)} />
                        Justifiée ?
                    </label>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">Annuler</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Envoyer</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAbsenceForm;
