import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { type LoginPayload, type LoginResponse, type User } from '../services/api';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (payload: LoginPayload) => {
        try {
            const response = await api.post<LoginResponse>('/auth/login', payload);
            login(response.data.token, response.data.role);
            console.log("response ==>>>>>>>>>>>> " + response.data);

            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response.data);
        }
    };

    const handleRegister = async (payload: User) => {
        try {
            await api.post('/auth/register', payload);
            setIsLogin(true);
            setError('');
        } catch (err:any) {
            setError(err.response.data);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-700 p-4 sm:p-8">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-lg md:max-w-xl">
                <div className="p-8">
                    <div className="flex justify-center mb-8">
                        <div className="bg-blue-100 p-4 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6m0 0l-3-3m3 3l3-3" />
                            </svg>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {isLogin ? (
                        <LoginForm
                            onLogin={handleLogin}
                            onSwitchForm={() => setIsLogin(false)}
                        />
                    ) : (
                        <RegisterForm
                            onRegister={handleRegister}
                            onSwitchForm={() => setIsLogin(true)}
                        />
                    )}
                </div>
                <div className="bg-gray-50 px-8 py-4 text-center">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} EduManage - Tous droits réservés</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;