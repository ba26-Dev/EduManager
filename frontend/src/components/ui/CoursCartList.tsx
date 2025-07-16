import React from 'react';
import type { CoursLayout } from '../../services/api';

interface Props {
    coursList: CoursLayout[];
}

const CoursCardList: React.FC<Props> = ({ coursList }) => {
    return (
        <div className="flex flex-wrap gap-4 p-4">
            {coursList.map((cours) => (
                <div
                    key={cours.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-md p-4 w-72 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <img
                            src={cours.avatar}
                            alt={cours.name}
                            className="w-12 h-12 rounded-full object-cover border border-gray-300"
                        />
                        <div>
                            <h2 className="text-lg font-semibold">{cours.title}</h2>
                            <p className="text-sm text-gray-500">{cours.name}</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">📘 Type : {cours.type}</p>
                    <p className="text-sm text-gray-600 mb-1">🏫 Classe : {cours.classeroomID}</p>
                    <p className={`text-sm font-medium ${cours.validity ? 'text-green-600' : 'text-red-500'}`}>
                        {cours.validity ? '✔️ Valide' : '❌ Non valide'}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default CoursCardList;
