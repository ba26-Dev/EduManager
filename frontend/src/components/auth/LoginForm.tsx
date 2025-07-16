import React, { useState } from 'react';
import { type LoginPayload } from '../../services/api';

interface LoginFormProps {
  onLogin: (payload: LoginPayload) => void;
  onSwitchForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSwitchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
       <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Connexion à EduManage</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-2 md:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
      >
        Se connecter
      </button>
      
      <p className="text-center mt-4 text-sm text-gray-600">
        Pas encore de compte?{' '}
        <button
          type="button"
          onClick={onSwitchForm}
          className="text-blue-600 hover:underline focus:outline-none"
        >
          S'inscrire
        </button>
      </p>
    </form>
  );
};

export default LoginForm;