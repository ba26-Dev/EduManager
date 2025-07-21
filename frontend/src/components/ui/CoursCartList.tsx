import React, { useState } from 'react';
import type { CoursFormData, CoursLayout } from '../../types/auth.d';
import { DocumentTextIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import LayoutCourse from "../layout/Course";

interface Props {
    coursList: CoursLayout[];
}


const CoursCardList: React.FC<Props> = ({ coursList }) => {
    console.log('cours layout =====>');
    console.log(coursList);
    const [selectedLayoutCourse, setSelectedLayoutCourse] = useState<CoursLayout | null>(null);
    const handleSave = (updatedCourse: CoursFormData) => {
        // Logique pour sauvegarder les modifications
        console.log('Cours mis à jour:', updatedCourse);
    };

    // Si une classe est sélectionnée, affiche le LayoutCourseDashboard
    if (selectedLayoutCourse) {
        return (
            <div className="p-4">
                <button
                    onClick={() => setSelectedLayoutCourse(null)}
                    className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    ← Retour aux classes
                </button>
                <LayoutCourse courseID={selectedLayoutCourse.id!} onSave={handleSave} />
            </div>
        );
    }
    return (
        <div className="flex flex-wrap gap-4 p-4">
            {coursList.map((course) => (
                <button
                    key={course.id}
                    onClick={() => setSelectedLayoutCourse(course)}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:scale-105 transition-transform hover:shadow-lg text-gray-800 text-left h-[380px] w-full"
                >
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                        <img
                            src={course.avatar ?? ''}
                            alt={course.name}
                            className="w-full h-[200px] rounded-xl object-cover border border-gray-300"
                        />
                        <div>
                            <p className="text-lg text-center font-extrabold text-gray-500">{course.name}</p>
                            <h2 className="text-lg text-gray-500 font-semibold flex">
                                <DocumentTextIcon className="h-6 w-6 text-indigo-500" />: {course.title}</h2>
                        </div>
                    </div>
                    <h2 className="text-lg flex text-gray-600 mb-1"> <BookmarkIcon className='h-6 w-6 text-indigo-500' /> : {course.types}</h2>
                    {/* <p className="text-sm text-gray-600 mb-1">🏫 Classe : {course.classeroomID}</p> */}
                    <p className={`text-sm font-medium ${course.validity ? 'text-green-600' : 'text-red-500'}`}>
                        {course.validity ? '✔️ Valide' : '❌ Non valide'}
                    </p>
                </button>
            ))}
        </div>
    );
};

export default CoursCardList;
