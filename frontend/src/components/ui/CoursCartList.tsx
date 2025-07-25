import React, { useState } from 'react';
import type { CoursFormData, CoursLayout } from '../../types/auth.d';
import { FaBook, FaRegBookmark, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import LayoutCourse from "../layout/LayoutCourse";
import api from '../../services/api';
import { Card, CardHeader, CardBody, Typography, Button } from "@material-tailwind/react";
import { useAuth } from '../../context/AuthContext';

interface Props {
    coursList: CoursLayout[];
}

const CoursCardList: React.FC<Props> = ({ coursList }) => {
    const { selectedLayoutCourse, setSelectedLayoutCourse } = useAuth();

    const handleSave = (updatedCourse: CoursFormData) => {
        api.put<CoursFormData>(`/users/update_cours/${selectedLayoutCourse?.id}`, updatedCourse)
            .then((response) => console.log('Cours mis à jour:', response.data));
    };

    if (selectedLayoutCourse) {
        return (
            <div className="p-4">
                <Button
                    variant="outlined"
                    color="gray"
                    onClick={() => setSelectedLayoutCourse(null)}
                    className="mb-4"
                >
                    ← Retour aux cours
                </Button>
                <LayoutCourse courseID={selectedLayoutCourse.id!} onSave={handleSave} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {coursList.map((course) => (
                <Card
                    key={course.id}
                    className="hover:scale-[1.02] transition-transform cursor-pointer"
                    onClick={() => setSelectedLayoutCourse(course)}
                >
                    <CardHeader floated={false} className="h-48">
                        <img
                            src={course.avatar ?? ''}
                            alt={course.name}
                            className="w-full h-full object-cover"
                        />
                    </CardHeader>
                    <CardBody>
                        <Typography variant="h6" color="blue-gray" className="text-center mb-2">
                            {course.name}
                        </Typography>

                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                            <FaBook className="text-indigo-500" />
                            <span className="font-semibold">Titre :</span> {course.title}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                            <FaRegBookmark className="text-blue-500" />
                            <span className="font-semibold">Type :</span> {course.types}
                        </div>

                        <div className={`flex items-center gap-2 text-sm font-medium ${course.validity ? 'text-green-600' : 'text-red-500'}`}>
                            {course.validity ? <FaCheckCircle /> : <FaTimesCircle />} {course.validity ? 'Cours Valide' : 'Non Valide'}
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default CoursCardList;
