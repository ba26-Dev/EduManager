import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
    Chip,
    Alert
} from '@material-tailwind/react';
import { FaPlus, FaTimes, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa';
import UserListCard from './UserListCard';
import { getSchoolYear, type ClasseroomFormData, type User } from '../../types/auth.d';
import api from '../../services/api';
import EmploiDuTempsForm from './EmploiDuTempsForm';

interface CreateClasseroomFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; // Callback pour notifier la création réussie
}

const CreateClasseroomForm: React.FC<CreateClasseroomFormProps> = ({
    isOpen,
    onClose,
    onSuccess
}) => {
    const [form, setForm] = useState<ClasseroomFormData>({
        name: '',
        dateSchool: getSchoolYear(),
        emploitDuTempsIDs: ['', ''],
        elevesID: [],
        enseignantsID: [],
    });

    const [selectingType, setSelectingType] = useState<'eleve' | 'enseignant' | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [showEmploiModal, setShowEmploiModal] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState<string | null>(null);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Réinitialiser le formulaire à l'ouverture
    useEffect(() => {
        if (isOpen) {
            setForm({
                name: '',
                dateSchool: getSchoolYear(),
                emploitDuTempsIDs: ['', ''],
                elevesID: [],
                enseignantsID: [],
            });
            setErrors({});
            setApiError(null);
        }
    }, [isOpen]);

    // Charger les utilisateurs
    useEffect(() => {
        if (!isOpen || !showUserModal) return;

        const fetchUsers = async () => {
            setLoadingUsers(true);
            setApiError(null);

            try {
                const response = await api.get<User[]>('/users/');
                setUsers(response.data);
            } catch (err) {
                console.error('Erreur fetch users:', err);
                setApiError('Impossible de charger la liste des utilisateurs');
            } finally {
                setLoadingUsers(false);
            }
        };

        fetchUsers();
    }, [isOpen, showUserModal]);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim()) {
            newErrors.name = 'Le nom de la classe est requis';
        }

        if (form.elevesID.length === 0) {
            newErrors.eleves = 'Au moins un élève doit être sélectionné';
        }

        if (form.enseignantsID.length === 0) {
            newErrors.enseignants = 'Au moins un enseignant doit être sélectionné';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const openUserModal = (type: 'eleve' | 'enseignant') => {
        setSelectingType(type);
        setShowUserModal(true);
        setApiError(null);
    };

    const handleToggleUser = (userId: string) => {
        if (!selectingType) return;

        const key = selectingType === 'eleve' ? 'elevesID' : 'enseignantsID';
        setForm(prev => ({
            ...prev,
            [key]: prev[key].includes(userId)
                ? prev[key].filter(id => id !== userId)
                : [...prev[key], userId]
        }));

        // Effacer l'erreur après sélection
        if (errors[selectingType]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[selectingType];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setApiError(null);

        try {
            await api.post('/users/create-classeroom', form);
            onSuccess(); // Notifier le succès
            onClose(); // Fermer le formulaire
        } catch (err: any) {
            console.error('Erreur création classe:', err);

            let errorMessage = 'Erreur lors de la création de la classe';
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setApiError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} size="xl">
            <DialogHeader className="border-b p-4 flex justify-between items-center">
                <Typography variant="h5">Créer une nouvelle classe</Typography>
                <Button variant="text" color='red' onClick={onClose} className="rounded-full">
                    <FaTimes />
                </Button>
            </DialogHeader>

            <DialogBody className="p-4">
                {(apiError || Object.keys(errors).length > 0) && (
                    <div className="mb-6 space-y-2">
                        {apiError && (
                            <Alert color="red" icon={<FaExclamationTriangle />}>
                                {apiError}
                            </Alert>
                        )}

                        {Object.entries(errors).map(([key, message]) => (
                            <Alert key={key} color="red">
                                {message}
                            </Alert>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Input
                            crossOrigin=""
                            name="name"
                            label="Nom de la classe *"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            error={!!errors.name}
                        />
                        {errors.name && (
                            <Typography variant="small" color="red" className="mt-1">
                                {errors.name}
                            </Typography>
                        )}
                    </div>

                    <div className="flex items-center gap-3 bg-blue-50 p-3 rounded border border-blue-100">
                        <FaCalendarAlt className="text-blue-500 flex-shrink-0" />
                        <Typography className='text-blue-500'>
                            Année scolaire: <span className="font-semibold ">{form.dateSchool}</span>
                        </Typography>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Button
                            onClick={() => setShowEmploiModal(true)}
                            className="flex items-center justify-center gap-2 h-full"
                            variant="outlined"
                            color='blue'
                        >
                            <FaPlus /> Emploi du temps
                        </Button>

                        <Button
                            onClick={() => openUserModal('eleve')}
                            className="flex items-center justify-center gap-2 h-full"
                            variant="outlined"
                            color={errors.eleves ? "red" : "blue"}
                        >
                            <FaPlus />
                            {form.elevesID.length > 0
                                ? `${form.elevesID.length} élève(s)`
                                : 'Ajouter élèves'}
                        </Button>

                        <Button
                            onClick={() => openUserModal('enseignant')}
                            className="flex items-center justify-center gap-2 h-full"
                            variant="outlined"
                            color={errors.enseignants ? "red" : "blue"}
                        >
                            <FaPlus />
                            {form.enseignantsID.length > 0
                                ? `${form.enseignantsID.length} enseignant(s)`
                                : 'Ajouter enseignants'}
                        </Button>
                    </div>

                    {errors.eleves && (
                        <Typography variant="small" color="red">
                            {errors.eleves}
                        </Typography>
                    )}

                    {form.elevesID.length > 0 && (
                        <div className="mt-4">
                            <Typography variant="h6" className="mb-2">Élèves sélectionnés</Typography>
                            <div className="flex flex-wrap gap-2">
                                {form.elevesID.map(id => {
                                    const user = users.find(u => u.id === id);
                                    return user ? (
                                        <Chip
                                            key={id}
                                            value={`${user.firstname} ${user.lastname}`}
                                            onClose={() => handleToggleUser(id)}
                                            className="max-w-full truncate"
                                        />
                                    ) : (
                                        <Chip key={id} value={`ID: ${id}`} />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {errors.enseignants && (
                        <Typography variant="small" color="red">
                            {errors.enseignants}
                        </Typography>
                    )}

                    {form.enseignantsID.length > 0 && (
                        <div className="mt-4">
                            <Typography variant="h6" className="mb-2">Enseignants sélectionnés</Typography>
                            <div className="flex flex-wrap gap-2">
                                {form.enseignantsID.map(id => {
                                    const user = users.find(u => u.id === id);
                                    return user ? (
                                        <Chip
                                            key={id}
                                            value={`${user.firstname} ${user.lastname}`}
                                            onClose={() => handleToggleUser(id)}
                                            className="max-w-full truncate"
                                        />
                                    ) : (
                                        <Chip key={id} value={`ID: ${id}`} />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="mt-6">
                        <Button variant="outlined" color="red" onClick={onClose} className="mr-2">
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            color="green"
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            {isSubmitting ? 'Création en cours...' : 'Créer la classe'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogBody>

            {/* Modal pour la sélection des utilisateurs */}
            <Dialog
                open={showUserModal && !!selectingType}
                handler={() => setShowUserModal(false)}
                size="lg"
            >
                <DialogHeader>
                    Sélectionner des {selectingType}s
                </DialogHeader>
                <DialogBody className="max-h-[60vh] overflow-y-auto">
                    {loadingUsers ? (
                        <div className="text-center py-8">
                            <Typography variant="h5">Chargement des utilisateurs...</Typography>
                        </div>
                    ) : apiError ? (
                        <Alert color="red" className="mb-4">
                            {apiError}
                        </Alert>
                    ) : (
                        <UserListCard
                            users={users.filter(u =>
                                selectingType === 'eleve'
                                    ? u.role?.toLowerCase().includes('eleve')
                                    : u.role?.toLowerCase().includes('enseignant')
                            )}
                            selected={new Set(
                                selectingType === 'eleve'
                                    ? form.elevesID
                                    : form.enseignantsID
                            )}
                            onToggle={handleToggleUser}
                        />
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button onClick={() => setShowUserModal(false)}>
                        Fermer
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Modal pour l'emploi du temps */}
            <Dialog
                open={showEmploiModal}
                handler={() => setShowEmploiModal(false)}
                size="xl"
            >
                <DialogHeader className="border-b p-4 flex justify-between items-center">
                    <Typography variant="h5">Gérer l'emploi du temps</Typography>
                    <Button variant="text" onClick={() => setShowEmploiModal(false)} className="rounded-full">
                        <FaTimes />
                    </Button>
                </DialogHeader>
                <DialogBody>
                    <EmploiDuTempsForm
                        emploitDuTempsIDs={form.emploitDuTempsIDs}
                        onChange={(updatedIDs) => {
                            setForm({ ...form, emploitDuTempsIDs: updatedIDs });
                            setShowEmploiModal(false);
                        }}
                    />
                </DialogBody>
            </Dialog>
        </Dialog>
    );
};

export default CreateClasseroomForm;