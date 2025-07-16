// TeacherSignIn.jsx
import React, { useState } from 'react';
import {
  TeacherSignInContainer,
  FormContainer,
  InputField,
  SubmitButton,
} from '../styles/TeacherSignInStyles'; // adapte le chemin selon ta structure

const TeacherSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Professeur connecté : ${email}`);
    // Ici, ajoute la logique de navigation / connexion selon ton app
  };

  return (
    <TeacherSignInContainer>
      <FormContainer onSubmit={handleSubmit}>
        <h2>Connexion Professeur</h2>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {/* SubmitButton est un Link stylisé, donc ici il faut mieux utiliser un <button> */}
        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          marginTop: '20px',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#FF4500',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
        }}>
          Se connecter
        </button>
      </FormContainer>
    </TeacherSignInContainer>
  );
};

export default TeacherSignIn;
