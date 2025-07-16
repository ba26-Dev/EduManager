import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {opacity: 0;}
  to {opacity: 1;}
`;

const Container = styled.div`
  max-width: 420px;
  margin: 50px auto;
  padding: 40px 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  animation: ${fadeIn} 0.6s ease forwards;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 25px;
  color: #333;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 6px;
  font-weight: 600;
  color: #444;
`;

const Input = styled.input`
  padding: 12px 14px;
  margin-bottom: 18px;
  border-radius: 8px;
  border: 1.8px solid #ddd;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 8px rgba(79,70,229,0.4);
  }
`;

const ErrorMsg = styled.div`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-top: -14px;
  margin-bottom: 14px;
`;

const Button = styled.button`
  background: #4f46e5;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
  &:hover {
    background: #4338ca;
  }
  &:disabled {
    background: #999;
    cursor: not-allowed;
  }
`;

const StudentSignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide";
    if (!password) newErrors.password = "Mot de passe requis";
    else if (password.length < 4)
      newErrors.password = "Le mot de passe doit avoir au moins 4 caractères";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      setTimeout(() => {
        alert(`Bienvenue, ${email}!`);
        localStorage.setItem("studentEmail", email);
        setLoading(false);
        navigate("/student/dashboard");
      }, 1200);
    }
  };

  return (
    <Container>
      <Title>Connexion Étudiant</Title>
      <Form onSubmit={handleSubmit} noValidate>
        <Label>Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="exemple@domaine.com"
        />
        {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}

        <Label>Mot de passe</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="Votre mot de passe"
        />
        {errors.password && <ErrorMsg>{errors.password}</ErrorMsg>}

        <Button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </Form>
    </Container>
  );
};

export default StudentSignIn;
