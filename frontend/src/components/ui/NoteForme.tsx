import React, { useState, type Dispatch, type SetStateAction } from 'react';
import { Input, Button, Typography, Card, CardBody } from '@material-tailwind/react';
import type { NoteFormData } from '../../types/auth';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface NoteFormProps {
    eleveID: string;
    onSubmit: (bool: boolean) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ eleveID, onSubmit }) => {
    const { user, selectedLayoutCourse } = useAuth();
    const [formData, setFormData] = useState<NoteFormData>({
        matiere: `${selectedLayoutCourse?.name}`,
        date: new Date().toISOString().split('T')[0],
        semestre: 1,
        value: 0,
        coef: 1,
        coursID: selectedLayoutCourse?.id,
        eleveID: eleveID,
        enseignantID: user?.id,
    });
    console.log(formData.semestre);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'value' || name === 'coef' ? parseInt(value) : name === 'semestre' ? selectedLayoutCourse?.semestre : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        api.post<NoteFormData>("/users/create_note", formData)
            .then((response) => {
                onSubmit(false);
                console.log(`response after take note ${response.data}`);
            })

    };

    return (
        <Card className="max-w-xl mx-auto mt-6 p-6">
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-4 text-center">
                    Assigner une note
                </Typography>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Matière" name="matiere" value={selectedLayoutCourse?.name} required crossOrigin="" />
                    <Input label="Date" type="date" name="date" value={formData.date} required crossOrigin="" />
                    <Input label="Semestre" type="number" name="semestre" value={formData.semestre} min={1} max={2} required crossOrigin="" />
                    <Input label="Note" type="number" name="value" value={formData.value} onChange={handleChange} min={0} max={20} required crossOrigin="" />
                    <Input label="Coefficient" type="number" name="coef" value={formData.coef} onChange={handleChange} min={1} max={10} required crossOrigin="" />

                    <Button type="submit" color="blue" fullWidth>
                        Soumettre
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
};

export default NoteForm;
