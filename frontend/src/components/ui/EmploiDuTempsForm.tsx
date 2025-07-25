import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Input,
    Button,
    Typography,
    Card,
    CardBody,
    Dialog,
} from '@material-tailwind/react';
import api from '../../services/api';
import type { EmploiDuTemps, Sceance } from '../../types/auth.d';

interface Props {
    emploitDuTempsIDs: string[];
    onChange: (ids: string[]) => void;
    currentSemestre?: number;
}

const EmploiDuTempsForm: React.FC<Props> = ({
    emploitDuTempsIDs,
    onChange,
    currentSemestre,
}) => {
    const [semestre, setSemestre] = useState<number>(currentSemestre || 1);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sceances, setSceances] = useState<Sceance[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [tempSceance, setTempSceance] = useState<Omit<Sceance, 'id'>>({
        dayOfWeek: '',
        startTime: '',
        endTime: '',
        matiere: '',
    });

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!semestre) newErrors.semestre = 'Le semestre est requis';
        if (!startDate) newErrors.startDate = 'La date de début est requise';
        if (!endDate) newErrors.endDate = 'La date de fin est requise';
        if (sceances.length === 0) newErrors.sceances = 'Ajoutez au moins une séance';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddSceance = () => {
        if (!tempSceance.dayOfWeek || !tempSceance.startTime || !tempSceance.endTime || !tempSceance.matiere) {
            return alert("Veuillez remplir tous les champs de la séance.");
        }
        setSceances((prev) => [
            ...prev,
            { id: uuidv4(), ...tempSceance },
        ]);
        setTempSceance({
            dayOfWeek: '',
            startTime: '',
            endTime: '',
            matiere: '',
        });
        setShowModal(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const emploiDuTemps: EmploiDuTemps = {
            id: uuidv4(),
            semestre,
            startDate,
            endDate,
            sceances,
        };

        const fetchData = async () => {
            try {
                const res = await api.post(`/users/add-emploi-du-temps`, emploiDuTemps);
                if (semestre === 1) emploitDuTempsIDs[0] = res.data.id;
                else if (semestre === 2) emploitDuTempsIDs[1] = res.data.id;
                onChange(emploitDuTempsIDs);
            } catch (err) {
                console.error('Erreur:', err);
            }
        };

        fetchData();
    };

    return (
        <Card className="max-w-xl mx-auto mt-6 p-6">
            <Typography variant="h4" className="mb-4">Créer un emploi du temps</Typography>
            <form onSubmit={handleSubmit} className="space-y-4">

                <Input crossOrigin=""
                    label="Semestre"
                    type="number"
                    value={semestre}
                    onChange={(e) => setSemestre(Number(e.target.value))}
                    error={!!errors.semestre}
                />
                {errors.semestre && <Typography variant="small" color="red">{errors.semestre}</Typography>}

                <Input crossOrigin=""
                    label="Date de début"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    error={!!errors.startDate}
                />
                {errors.startDate && <Typography variant="small" color="red">{errors.startDate}</Typography>}

                <Input crossOrigin=""
                    label="Date de fin"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    error={!!errors.endDate}
                />
                {errors.endDate && <Typography variant="small" color="red">{errors.endDate}</Typography>}

                <div>
                    <Typography variant="h6">Séances :</Typography>
                    {sceances.length > 0 ? (
                        <ul className="list-disc ml-6 text-sm">
                            {sceances.map((s) => (
                                <li key={s.id}>{s.dayOfWeek} - {s.matiere} ({s.startTime} - {s.endTime})</li>
                            ))}
                        </ul>
                    ) : (
                        <Typography variant="small" color="gray">Aucune séance ajoutée</Typography>
                    )}
                    {errors.sceances && <Typography variant="small" color="red">{errors.sceances}</Typography>}
                </div>

                <div className="flex justify-between gap-4 pt-4">
                    <Button onClick={() => setShowModal(true)} color="blue">Ajouter une séance</Button>
                    <Button type="submit" color="green">Créer</Button>
                </div>
            </form>

            {/* Modal */}
            <Dialog open={showModal} handler={setShowModal}>
                <Card className="p-4 w-full max-w-md mx-auto">
                    <Typography variant="h5" className="mb-4">Nouvelle séance</Typography>
                    <div className="space-y-3">
                        <Input crossOrigin=""
                            label="Jour (ex: Lundi)"
                            value={tempSceance.dayOfWeek}
                            onChange={(e) => setTempSceance({ ...tempSceance, dayOfWeek: e.target.value })}
                        />
                        <Input crossOrigin=""
                            label="Matière"
                            value={tempSceance.matiere}
                            onChange={(e) => setTempSceance({ ...tempSceance, matiere: e.target.value })}
                        />
                        <Input crossOrigin=""
                            label="Heure de début"
                            type="time"
                            value={tempSceance.startTime}
                            onChange={(e) => setTempSceance({ ...tempSceance, startTime: e.target.value })}
                        />
                        <Input crossOrigin=""
                            label="Heure de fin"
                            type="time"
                            value={tempSceance.endTime}
                            onChange={(e) => setTempSceance({ ...tempSceance, endTime: e.target.value })}
                        />
                        <div className="flex justify-between pt-2">
                            <Button onClick={() => setShowModal(false)} color="red" variant="outlined">Annuler</Button>
                            <Button onClick={handleAddSceance} color="green">Ajouter</Button>
                        </div>
                    </div>
                </Card>
            </Dialog>
        </Card>
    );
};

export default EmploiDuTempsForm;
