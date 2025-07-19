import React from 'react';
import type { EmploiDuTemps, Sceance } from '../../types/auth.d';

interface Props {
    emploi: EmploiDuTemps;
}

const EmploiDuTempsCard: React.FC<Props> = ({ emploi }) => {
    const joursOrdres = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    const sceancesOrdonnees = [...emploi.sceances].sort((a, b) =>
        joursOrdres.indexOf(a.dayOfWeek) - joursOrdres.indexOf(b.dayOfWeek)
    );

    return (
        <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">🗓️ Emploi du temps - Semestre {emploi.semestre}</h2>
            <p className="text-sm text-gray-600 mb-4">
                Du {emploi.startDate} au {emploi.endDate}
            </p>

            <div className="space-y-3">
                {sceancesOrdonnees.map((sceance, index) => (
                    <div
                        key={index}
                        className="border border-gray-100 rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <p className="font-medium text-gray-800">
                            📅 {sceance.dayOfWeek}
                        </p>
                        <p className="text-gray-700">📚 Matière : {sceance.matiere}</p>
                        <p className="text-gray-600">
                            🕒 {sceance.startTime} → {sceance.endTime}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmploiDuTempsCard;
