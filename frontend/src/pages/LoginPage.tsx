import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardBody, Input, Button, Typography, Select, Option } from "@material-tailwind/react";
import { FaEnvelope, FaLock, FaUser, FaPhone, FaCalendarAlt, FaChalkboardTeacher, FaGraduationCap, FaChild } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import type { LoginPayload, LoginResponse, User } from '../types/auth.d';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState<any>({ role: 'ELEVE' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const payload: LoginPayload = {
        email: form.email,
        password: form.password
      };
      const response = await api.post<LoginResponse>('/auth/login', payload, { withCredentials: true });
      console.log("status ====> ", response.status);

      login(response.data.token, response.data.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data || 'Erreur de connexion');
    }
  };

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    const payload: User = { ...form };
    if (form.role === 'PARENT') {
      payload.childEmail = form.childEmail?.split(',') || [];
    }
    try {
      await api.post('/auth/register', payload);
      setIsLogin(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data || 'Erreur lors de l’inscription');
    }
  };

  const renderInput = (label: string, name: string, type: string, Icon: any, extraProps = {}) => (
    <div className="mb-4">
      <label className="text-gray-700 text-sm font-semibold mb-1 block">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-500">
          <Icon />
        </span>
        <Input
          type={type}
          name={name}
          value={form[name] || ''}
          onChange={handleChange}
          className="pl-10"
          crossOrigin=""
          {...extraProps}
        />
      </div>
    </div>
  );

  const roleSpecificFields = () => {
    switch (form.role) {
      case 'ELEVE': return renderInput("Classe", "classeroom", "text", FaGraduationCap);
      case 'ENSEIGNANT': return renderInput("Matière enseignée", "matiere", "text", FaChalkboardTeacher);
      case 'PARENT': return renderInput("Emails des enfants", "childEmail", "text", FaChild);
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
      <motion.div
        className="absolute w-full h-full top-0 left-0 z-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.2 }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
        style={{ background: 'radial-gradient(circle at top left, rgba(255,255,255,0.1), transparent)', pointerEvents: 'none' }}
      />
      <Card className="z-10 w-full max-w-xl">
        <CardBody>
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h4" color="blue-gray">
              {isLogin ? 'Connexion' : 'Inscription'} à EduManager
            </Typography>
            <Button
              size="sm"
              color="blue"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </Button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                {renderInput("Email", "email", "email", FaEnvelope)}
                {renderInput("Mot de passe", "password", "password", FaLock)}
                <Button color="blue" fullWidth onClick={handleLogin} className="mt-4">
                  Se connecter
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-4">
                  <label className="text-gray-700 text-sm font-semibold mb-1 block">Rôle</label>
                  <Select name="role" value={form.role} onChange={(val) => setForm({ ...form, role: val })}>
                    <Option value="ELEVE">Élève</Option>
                    <Option value="ENSEIGNANT">Enseignant</Option>
                    <Option value="PARENT">Parent</Option>
                    <Option value="RESPONSABLE">Responsable</Option>
                  </Select>
                </div>
                {renderInput("Prénom", "firstname", "text", FaUser)}
                {renderInput("Nom", "lastname", "text", FaUser)}
                {renderInput("Nom d'utilisateur", "username", "text", FaUser)}
                {renderInput("Email", "email", "email", FaEnvelope)}
                {renderInput("Téléphone", "phone", "tel", FaPhone)}
                {renderInput("Date de naissance", "birthday", "date", FaCalendarAlt)}
                {renderInput("Mot de passe", "password", "password", FaLock)}
                {renderInput("Confirmation", "confirmPassword", "password", FaLock)}
                {roleSpecificFields()}
                <Button color="green" fullWidth onClick={handleRegister} className="mt-4">
                  S'inscrire
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoginPage;
