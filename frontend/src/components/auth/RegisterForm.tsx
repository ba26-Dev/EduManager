// Ajouter ces imports
import { useState, useEffect } from 'react';
import { type User } from '../../types/auth.d';
// Mettre à jour l'interface des props
interface RegisterFormProps {
    onRegister: (payload: User) => void;
    onSwitchForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchForm }) => {
    // États pour les champs communs
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [birthday, setBirthday] = useState('');
    const [role, setRole] = useState('ELEVE'); // Valeur par défaut

    // États pour les champs spécifiques aux rôles
    const [classeroom, setClasseroom] = useState('');
    const [matiere, setMatiere] = useState('');
    const [childEmail, setChildEmail] = useState('');

    // Fonction pour gérer la soumission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas');
            return;
        }

        // Créer le payload de base
        const payload: User = {
            firstname,
            lastname,
            username,
            email,
            password,
            phone,
            birthday,
            role
        };

        // Ajouter les champs spécifiques au rôle
        if (role === 'ELEVE') {
            payload.classeroom = classeroom;
        } else if (role === 'ENSEIGNANT') {
            payload.matiere = matiere;
        } else if (role === 'PARENT') {
            payload.childEmail = childEmail.split(",");
        } else if (role === 'RESPONSABLE') {
            payload.role = 'RESPONSABLE';
        }

        onRegister(payload);
    };

    // Fonction pour rendre les champs spécifiques
    const renderRoleSpecificFields = () => {
        switch (role) {
            case 'ELEVE':
                return (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="classeroom">
                            Classe
                        </label>
                        <input
                            type="text"
                            id="classeroom"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Votre classe"
                            value={classeroom}
                            onChange={(e) => setClasseroom(e.target.value)}
                            required
                        />
                    </div>
                );
            case 'ENSEIGNANT':
                return (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="matiere">
                            Matière enseignée
                        </label>
                        <input
                            type="text"
                            id="matiere"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Votre matière"
                            value={matiere}
                            onChange={(e) => setMatiere(e.target.value)}
                            required
                        />
                    </div>
                );
            case 'PARENT':
                return (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="childEmail">
                            Emails des enfants (séparés par des virgules)
                        </label>
                        <input
                            type="text"
                            id="childEmail"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="enfant1@email.com, enfant2@email.com"
                            value={childEmail}
                            onChange={(e) => setChildEmail(e.target.value)}
                            required
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Inscription à EduManager</h2>

            {/* Sélecteur de rôle */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                    Rôle
                </label>
                <select
                    id="role"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="RESPONSABLE">RESPONSABLE</option>
                    <option value="ELEVE">Élève</option>
                    <option value="ENSEIGNANT">Enseignant</option>
                    <option value="PARENT">Parent</option>
                </select>
            </div>

            {/* Champs communs à tous les rôles */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstname">
                    Prénom
                </label>
                <input
                    type="text"
                    id="firstname"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre prénom"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastname">
                    Nom
                </label>
                <input
                    type="text"
                    id="lastname"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre nom"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="student26"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                    Téléphone
                </label>
                <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre numéro"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="birthday">
                    Date de naissance
                </label>
                <input
                    type="date"
                    id="birthday"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                    Mot de passe
                </label>
                <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirm">
                    Confirmer le mot de passe
                </label>
                <input
                    type="password"
                    id="confirm"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
            </div>
            {renderRoleSpecificFields()}
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
                S'inscrire
            </button>

            <p className="text-center mt-4 text-sm text-gray-600">
                Déjà un compte?{' '}
                <button
                    type="button"
                    onClick={onSwitchForm}
                    className="text-blue-600 hover:underline focus:outline-none"
                >
                    Se connecter
                </button>
            </p>
        </form>
    );
};

export default RegisterForm;