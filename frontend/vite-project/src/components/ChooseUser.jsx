import React from "react";
import { useNavigate } from "react-router-dom";

const ChooseUser = () => {
  const navigate = useNavigate();

  const users = [
    { role: "Admin", path: "/adminsignin", color: "bg-blue-600" },
    { role: "Professeur", path: "/teachersignin", color: "bg-green-600" },
    { role: "Étudiant", path: "/studentsignin", color: "bg-purple-600" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4">Bienvenue 👋</h2>
        <p className="text-gray-600 mb-6">Veuillez choisir un type d'utilisateur :</p>

        <div className="space-y-4">
          {users.map((user) => (
            <button
              key={user.role}
              onClick={() => navigate(user.path)}
              className={`w-full py-3 px-6 text-white text-lg font-semibold rounded-xl hover:opacity-90 transition ${user.color}`}
            >
              {user.role}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChooseUser;

