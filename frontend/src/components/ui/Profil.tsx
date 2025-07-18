import { useAuth } from "../../context/AuthContext";

const Profil: React.FC = () => {
    const { user } = useAuth();
    // Fonction pour formater la date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR');
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className="p-6">
                {/* En-tête avec nom et rôle */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">
                            {user?.firstname} {user?.lastname}
                        </h2>
                        <span className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full ${user?.role.substring(5) === 'ELEVE' ? 'bg-blue-100 text-blue-800' :
                            user?.role.substring(5) === 'ENSEIGNANT' ? 'bg-purple-100 text-purple-800' :
                                user?.role.substring(5) === 'PARENT' ?'bg-green-100 text-green-800':
                                user?.role.substring(5) === 'RESPONSABLE' ?'bg-orange-100 text-green-800':'bg-red-500 text-green-800'
                            }`}>
                            {user?.role.substring(5)}
                        </span>
                    </div>
                    <img src="src/assets/christe.jpg" alt="" className="border-4 border-dashed rounded-full w-28 h-28" />
                </div>

                {/* Informations principales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <p className="text-base text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{user?.email}</p>
                    </div>
                    <div>
                        <p className="text-base text-gray-500">Nom d'utilisateur</p>
                        <p className="text-gray-800 font-medium">{user?.username}</p>
                    </div>
                    <div>
                        <p className="text-base text-gray-500">Téléphone</p>
                        <p className="text-gray-800 font-medium">{user?.phone || 'Non renseigné'}</p>
                    </div>
                    <div>
                        <p className="text-base text-gray-500">Date de naissance</p>
                        <p className="text-gray-800 font-medium">{formatDate(String(user?.birthday))}</p>
                    </div>
                </div>

                {/* Champs spécifiques au rôle */}
                {user?.role === 'ELEVE' && user?.classeroom && (
                    <div className="mb-3">
                        <p className="text-base text-gray-500">Classe</p>
                        <p className="text-gray-800 font-medium">{user?.classeroom}</p>
                    </div>
                )}

                {user?.role === 'ENSEIGNANT' && user?.matiere && (
                    <div className="mb-3">
                        <p className="text-base text-gray-500">Matière enseignée</p>
                        <p className="text-gray-800 font-medium">{user?.matiere}</p>
                    </div>
                )}

                {user?.role === 'PARENT' && user?.childEmail && user?.childEmail.length > 0 && (
                    <div className="mb-3">
                        <p className="text-base text-gray-500">Enfants associés</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {user?.childEmail.map((email, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {email}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dates de réactivation */}
                {user?.reActif && user?.reActif.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-base text-gray-500 font-medium mb-2">Historique de réactivation</p>
                        <ul className="space-y-1">
                            {user?.reActif.map((date, index) => (
                                <li key={index} className="text-base text-gray-700">
                                    Réactivé le: {formatDate(String(date))}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Dates de désactivation */}
                {user?.dateNotActif && user?.dateNotActif.length > 0 && (
                    <div className="mt-3">
                        <p className="text-base text-gray-500 font-medium mb-2">Périodes d'inactivité</p>
                        <ul className="space-y-1">
                            {user?.dateNotActif.map((date, index) => (
                                <li key={index} className="text-base text-gray-700">
                                    Désactivé le: {formatDate(date)}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profil;