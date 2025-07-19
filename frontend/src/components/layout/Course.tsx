import React, { useState } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { CoursFormData, Content } from "../../types/auth.d";
interface LayoutCourseProps {
    course: CoursFormData;
    onSave: (updatedCourse: CoursFormData) => void;
}

const LayoutCourse: React.FC<LayoutCourseProps> = ({ course, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCourse, setEditedCourse] = useState<CoursFormData>({ ...course });
    const [expandedContent, setExpandedContent] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditedCourse(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (index: number, field: keyof Content, value: string) => {
        const newContent = [...editedCourse.content];
        newContent[index] = { ...newContent[index], [field]: value };
        setEditedCourse(prev => ({ ...prev, content: newContent }));
    };

    const addContent = () => {
        setEditedCourse(prev => ({
            ...prev,
            content: [...prev.content, { title: '', data: '', image: '' }]
        }));
    };

    const removeContent = (index: number) => {
        const newContent = [...editedCourse.content];
        newContent.splice(index, 1);
        setEditedCourse(prev => ({ ...prev, content: newContent }));
    };

    const toggleExpand = (index: number) => {
        setExpandedContent(expandedContent === index ? null : index);
    };

    const handleSave = () => {
        onSave(editedCourse);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedCourse({ ...course });
        setIsEditing(false);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header avec boutons d'action */}
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="title"
                                    value={editedCourse.title}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg font-bold text-2xl"
                                    placeholder="Titre du cours"
                                />
                            ) : (
                                course.title
                            )}
                        </h1>
                        <div className="flex items-center mt-2">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {course.types}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                                Semestre {course.semestre}
                            </span>
                        </div>
                    </div>

                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Modifier le cours
                        </button>
                    ) : (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSave}
                                className="flex items-center text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Confirmer
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                                <XMarkIcon className="h-4 w-4 mr-1" />
                                Annuler
                            </button>
                        </div>
                    )}
                </div>

                {/* Informations principales */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="mb-6">
                            <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={editedCourse.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Description du cours"
                                />
                            ) : (
                                <p className="text-gray-600">{course.name}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        name="date"
                                        value={editedCourse.date}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                ) : (
                                    <p className="text-gray-800">{new Date(course.date).toLocaleDateString()}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Type de cours</h3>
                                {isEditing ? (
                                    <select
                                        name="types"
                                        value={editedCourse.types}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="Cours">Cours</option>
                                        <option value="TD">Travaux Dirigés</option>
                                        <option value="TP">Travaux Pratiques</option>
                                        <option value="Examen">Examen</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-800">{course.types}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Enseignant</h2>
                        <div className="flex items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                            <div className="ml-4">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="enseignantID"
                                        value={editedCourse.enseignantID}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        placeholder="ID enseignant"
                                    />
                                ) : (
                                    <p className="font-medium">Enseignant ID: {course.enseignantID}</p>
                                )}
                                <p className="text-sm text-gray-500">Responsable du cours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu du cours */}
                <div className="p-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Contenu du cours</h2>
                        {isEditing && (
                            <button
                                onClick={addContent}
                                className="flex items-center text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Ajouter un contenu
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        {editedCourse.content.map((content, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div
                                    className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleExpand(index)}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 mr-3" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={content.title}
                                                onChange={(e) => handleContentChange(index, 'title', e.target.value)}
                                                className="font-medium text-lg"
                                                placeholder="Titre du contenu"
                                            />
                                        ) : (
                                            <h3 className="font-medium text-lg">{content.title || `Contenu ${index + 1}`}</h3>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        {isEditing && (
                                            <button
                                                onClick={() => removeContent(index)}
                                                className="text-red-500 hover:text-red-700 mr-3"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                        <span className={`transform transition-transform ${expandedContent === index ? 'rotate-180' : ''
                                            }`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>

                                {(expandedContent === index || isEditing) && (
                                    <div className="p-4 bg-white">
                                        {isEditing ? (
                                            <>
                                                <div className="mb-4">
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                                                    <textarea
                                                        rows={4}
                                                        value={content.data}
                                                        onChange={(e) => handleContentChange(index, 'data', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                        placeholder="Détails du contenu"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'image</label>
                                                    <input
                                                        type="text"
                                                        value={content.image}
                                                        onChange={(e) => handleContentChange(index, 'image', e.target.value)}
                                                        className="w-full px-3 py-2 border rounded-lg"
                                                        placeholder="https://example.com/image.jpg"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="prose max-w-none">
                                                <p className="text-gray-700 mb-4">{content.data}</p>
                                                {content.image && (
                                                    <img
                                                        src={content.image}
                                                        alt={content.title}
                                                        className="w-full h-auto rounded-lg"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500">
                    Classe: {course.classeroomID} • Statut: {course.validity ? 'Actif' : 'Inactif'}
                </div>
            </div>
        </div>
    );
};

export default LayoutCourse;