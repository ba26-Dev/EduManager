import React, { createContext, useContext, useState, useEffect, type ReactNode, type SetStateAction, type Dispatch } from 'react';
import type { Classeroom, CoursLayout, User } from '../types/auth';
import api from "../services/api";
interface AuthContextType {
    token: string | null;
    role: string | null;
    user: User | null;
    classerooms: Classeroom[];
    selectedClasseroom: Classeroom | null,
    setSelectedClasseroom: Dispatch<SetStateAction<Classeroom | null>>,
    selectedLayoutCourse: CoursLayout | null,
    setSelectedLayoutCourse: Dispatch<SetStateAction<CoursLayout | null>>,
    login: (token: string, role: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [user, setUser] = useState<User>({
        id: '',
        firstname: '',
        lastname: '',
        email: '',
        avatar: '',
        username: '',
        password: '',
        phone: '',
        birthday: '',
        role: '',
        reActif: [],
        dateNotActif: [],
        classeroom: '',
        matiere: '',
        childEmail: []
    });
    const [classeroom, setClasseroom] = useState<Classeroom>({
        name: '',
        dateSchool: '',
        emploitDuTempsIDs: ['', ''],
        elevesID: [],
        enseignantsID: []
    });
    const [classerooms, setClasserooms] = useState<Classeroom[]>([]);
    const [selectedClasseroom, setSelectedClasseroom] = useState<Classeroom | null>(null);
    const [selectedLayoutCourse, setSelectedLayoutCourse] = useState<CoursLayout | null>(null);


    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    useEffect(() => {

        if (storedToken && storedRole) {
            setToken(storedToken);
            setRole(storedRole);
        }
        const fetchUser = async () => {
            if (storedToken) {
                try {
                    // Recuperer le user connecté
                    await api.get<User>('/users/current_user', {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    }).then((resp) => setUser(resp.data));
                    // Récupération de la liste des classerooms
                    await api.get<Classeroom[]>('/users/get_my_Classerooms', {
                        headers: { Authorization: `Bearer ${storedToken}` }
                    }).then((classerooms) => setClasserooms(classerooms.data));
                    if (user.role) {
                        setRole(user.role.substring(5))
                    }

                } catch (err) {
                    console.error('Erreur lors du fetch du user :', err);
                    logout(); // Token invalide => déconnexion
                }
            }
        }
        console.log("role authcontext  ===> " + storedRole);
        fetchUser();
    }, [storedToken]);

    const login = (newToken: string, newRole: string) => {
        setToken(newToken);
        setRole(newRole);
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole.substring(5));
    };

    const logout = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider value={{ token, role, user, selectedClasseroom, setSelectedClasseroom, selectedLayoutCourse, setSelectedLayoutCourse, classerooms, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};