import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Checkbox,
    Typography
} from '@material-tailwind/react';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import api from '../../services/api';
import type { Absence } from '../../types/auth';

interface CreateAbsenceProps {
    isOpen: boolean;
    onClose: () => void;
    eleveID?: string;
    semestre: number;
}

const CreateAbsenceForm: React.FC<CreateAbsenceProps> = ({
    isOpen,
    onClose,
    eleveID,
    semestre
}) => {
    const [formData, setFormData] = useState<Absence>({
        id: "",
        date: '',
        motif: '',
        preuve: '',
        eleveID: eleveID,
        semestre: semestre,
        status: false,
        justify: false
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            await api.post('/users/request_absence', formData);

            setSuccessMessage('Demande envoyée avec succès !');
            setTimeout(() => {
                setSuccessMessage('');
                onClose();
                setFormData({
                    id: "",
                    date: '',
                    motif: '',
                    preuve: '',
                    eleveID: eleveID,
                    semestre: semestre,
                    status: false,
                    justify: false
                });
            }, 3000);
        } catch (err) {
            setError('Erreur lors de l\'envoi de la demande');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="sm">
            <DialogHeader className="border-b p-4">
                <Typography variant="h5">Demande d'absence</Typography>
                <Button variant="text" onClick={onClose} className="absolute right-4 top-4">
                    <FaTimes />
                </Button>
            </DialogHeader>

            <DialogBody className="p-4">
                {successMessage && (
                    <div className="bg-green-100 p-3 rounded mb-4 text-green-800">
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 p-3 rounded mb-4 text-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        crossOrigin=""
                        type="date"
                        name="date"
                        label="Date d'absence"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        crossOrigin=""
                        type="text"
                        name="motif"
                        label="Motif"
                        value={formData.motif}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        crossOrigin=""
                        type="text"
                        name="preuve"
                        label="Lien ou description de la preuve"
                        value={formData.preuve}
                        onChange={handleChange}
                    />

                    <Checkbox
                        crossOrigin=""
                        name="justify"
                        label="Absence justifiée"
                        checked={formData.justify}
                        onChange={handleChange}
                    />

                    <DialogFooter className="pt-4">
                        <Button variant="outlined" color="red" onClick={onClose} className="mr-2">
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            color="green"
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            <FaPaperPlane /> Envoyer
                        </Button>
                    </DialogFooter>
                </form>
            </DialogBody>
        </Dialog>
    );
};

export default CreateAbsenceForm;