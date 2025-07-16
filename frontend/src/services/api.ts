import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:12000',
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

// Types pour les réponses API
export interface LoginResponse {
    type: string;
    token: string;
    role: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ErroreResponse {
    value: String;
}

export interface User {
    id?: string,
    firstname: string;
    lastname: string;
    email: string;
    avatar?: string;
    username: string;
    password: string;
    phone: string;
    birthday: string;
    role: string;
    reActif?: String[];
    dateNotActif?: string[];
    classeroom?: string; // Pour Eleve
    matiere?: string;    // Pour Enseignant
    childEmail?: string[]; // Pour Parent (séparé par des virgules)
}

export interface Classeroom {
    id?: string; // le ? indique que c'est optionnel (comme généré automatiquement)
    name: string;
    dateSchool: string;
    emploitDuTempsIDs: [string, string]; // tableau de 2 éléments exactement
    elevesID: string[];
    enseignantsID: string[];
}

export interface CoursLayout {
    id: string;
    name: string;
    avatar: string;
    title: string;
    type: string;
    classeroomID: string;
    semestre: number;
    validity: boolean;
}

export interface Sceance {
    id?: string,
    dayOfWeek: string;
    matiere: string;
    startTime: string;
    endTime: string;
}

export interface EmploiDuTemps {
    id: string;
    semestre: number;
    startDate: string;
    endDate: string;
    sceances: Sceance[];
}

export interface ClasseroomFormData {
    name: string;
    dateSchool: string;
    emploitDuTempsIDs: string[];
    elevesID: string[];
    enseignantsID: string[];
}

export interface Content {
    id?: number;
    title: string;
    data: string;
    image: string;
}

export interface CoursFormData {
    name: string;
    avatar: string;
    date: string;
    enseignantID: string;
    title: string;
    content: Content[];
    types: string;
    classeroomID: string;
    semestre: string;
    validity: boolean;
}
