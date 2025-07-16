import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { Content, CoursFormData } from '../../services/api';

interface CreateCoursFormProps {
    isOpen: boolean;
    onClose: () => void;
    enseignantID: string;
    classeroomID: string;
}

const CreateCoursForm: React.FC<CreateCoursFormProps> = ({
    isOpen,
    onClose,
    enseignantID,
    classeroomID
}) => {
    const [formData, setFormData] = useState<CoursFormData>({
        name: '',
        avatar: '',
        date: new Date().toISOString().split('T')[0],
        enseignantID: enseignantID,
        title: '',
        content: [{ title: '', data: '', image: '' }],
        types: '',
        classeroomID: classeroomID,
        semestre: '1',
        validity: true,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleContentChange = (index: number, field: keyof Content, value: string) => {
        const newContent = [...formData.content];
        newContent[index] = { ...newContent[index], [field]: value };

        setFormData({
            ...formData,
            content: newContent
        });
    };

    const addContent = () => {
        setFormData({
            ...formData,
            content: [...formData.content, { title: '', data: '', image: '' }]
        });
    };

    const removeContent = (index: number) => {
        if (formData.content.length <= 1) return;

        const newContent = [...formData.content];
        newContent.splice(index, 1);

        setFormData({
            ...formData,
            content: newContent
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Convertir le semestre en nombre
            const payload = {
                ...formData,
                semestre: parseInt(formData.semestre),
                content: formData.content.map(c => ({
                    title: c.title,
                    data: c.data,
                    image: c.image
                }))
            };

            const reponse = await axios.post('/users/create_cours', payload);
            
        } catch (err) {
            setError('Erreur lors de la création du cours. Veuillez réessayer.');
            console.error('Create course error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            // Réinitialiser le formulaire quand le popup s'ouvre
            setFormData({
                name: '',
                avatar: '',
                date: new Date().toISOString().split('T')[0],
                enseignantID: enseignantID,
                title: '',
                content: [{ title: '', data: '', image: '' }],
                types: '',
                classeroomID: classeroomID,
                semestre: '1',
                validity: true,
            });
        }
    }, [isOpen, enseignantID, classeroomID]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Créer un nouveau cours</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                                    Nom du cours *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
                                    Titre *
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="date">
                                    Date *
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="types">
                                    Type de cours *
                                </label>
                                <select
                                    id="types"
                                    name="types"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.types}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Sélectionnez un type</option>
                                    <option value="Cours">Cours</option>
                                    <option value="TD">Travaux Dirigés</option>
                                    <option value="TP">Travaux Pratiques</option>
                                    <option value="Examen">Examen</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="enseignantID">
                                    ID Enseignant *
                                </label>
                                <input
                                    type="hidden"
                                    name="enseignantID"
                                    value={formData.enseignantID}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="classeroomID">
                                    ID Classe *
                                </label>
                                <input
                                    type="hidden"
                                    name="classeroomID"
                                    value={formData.classeroomID}
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="semestre">
                                    Semestre *
                                </label>
                                <select
                                    id="semestre"
                                    name="semestre"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.semestre}
                                    onChange={handleInputChange}
                                >
                                    <option value="1">Semestre 1</option>
                                    <option value="2">Semestre 2</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="avatar">
                                    URL de l'avatar
                                </label>
                                <input
                                    type="text"
                                    id="avatar"
                                    name="avatar"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.avatar}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="hidden"
                                    name="validity"
                                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                                    checked={formData.validity}
                                    onChange={handleInputChange}
                                />
                                <label className="ml-2 text-gray-700 text-sm font-medium" htmlFor="validity">
                                    Cours actif
                                </label>
                            </div>
                        </div>

                        {/* Section Contenu */}
                        <div className="border-t border-gray-200 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Contenu du cours</h3>
                                <button
                                    type="button"
                                    onClick={addContent}
                                    className="flex items-center text-sm bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600"
                                >
                                    <PlusIcon className="h-4 w-4 mr-1" />
                                    Ajouter un contenu
                                </button>
                            </div>

                            {formData.content.map((content, index) => (
                                <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-medium text-gray-700">Contenu #{index + 1}</h4>
                                        {formData.content.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeContent(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={`content-title-${index}`}>
                                                Titre *
                                            </label>
                                            <input
                                                type="text"
                                                id={`content-title-${index}`}
                                                required
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={content.title}
                                                onChange={(e) => handleContentChange(index, 'title', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={`content-data-${index}`}>
                                                Contenu *
                                            </label>
                                            <textarea
                                                id={`content-data-${index}`}
                                                required
                                                rows={3}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={content.data}
                                                onChange={(e) => handleContentChange(index, 'data', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor={`content-image-${index}`}>
                                                URL de l'image
                                            </label>
                                            <input
                                                type="text"
                                                id={`content-image-${index}`}
                                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={content.image}
                                                onChange={(e) => handleContentChange(index, 'image', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => onClose()}
                                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? 'Création en cours...' : 'Créer le cours'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default CreateCoursForm;