import React, { useState } from 'react';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { FaUsers, FaCalendarAlt, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { useAuth } from "../../context/AuthContext";
import ClasseroomDashboard from '../dashboard/ClasseroomDashbord';
import { number } from 'framer-motion';

const ClasseroomCardList: React.FC = () => {
    const { classerooms, selectedClasseroom, setSelectedClasseroom } = useAuth();
    const [len, setLen] = useState<number>(0);
    // Affiche la liste des classes disponibles
    if (selectedClasseroom) {
        return (
            <>
                <ClasseroomDashboard classeroomID={`${selectedClasseroom.id}`} lenEmploie={len} />
            </>
        )
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
            {classerooms.map((room) => (
                <Card
                    key={room.id}
                    className="hover:scale-105 transition-transform shadow-emerald-50 hover:shadow-xl cursor-pointer"
                    onClick={() => {
                        setSelectedClasseroom(room)
                        if (room.emploitDuTempsIDs[0] != '') {
                            setLen(len + 1)
                        }
                        if (room.emploitDuTempsIDs[1] != '') {
                            setLen(len + 1)
                        }
                    }}
                >
                    {/* Affichage de l'image selon le nom de la classe */}
                    <img
                        src={room.name.startsWith('TS') ? 'src/assets/TS2.jpeg' : 'src/assets/CM2.jpeg'}
                        alt="Image classe"
                        className="w-full h-[200px] object-cover rounded-t-lg"
                    />
                    <CardBody>
                        {/* Titre de la classe avec une icône */}
                        <Typography variant="h5" className="flex items-center gap-2 text-gray-800 mb-3">
                            <FaUsers className="text-indigo-500 w-5 h-5" /> {room.name}
                        </Typography>

                        {/* Informations supplémentaires sur la classe */}
                        <Typography className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <FaCalendarAlt className="text-green-500 w-4 h-4" /> Année scolaire : {room.dateSchool.substring(6)}
                        </Typography>
                        <Typography className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <FaUserGraduate className="text-blue-500 w-4 h-4" /> Élèves : {room.elevesID.length}
                        </Typography>
                        <Typography className="flex items-center gap-2 text-sm text-gray-600">
                            <FaChalkboardTeacher className="text-pink-500 w-4 h-4" /> Enseignants : {room.enseignantsID.length}
                        </Typography>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default ClasseroomCardList;
