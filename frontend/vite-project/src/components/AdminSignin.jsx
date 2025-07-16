import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FormWrapper,
  Title,
  StyledForm,
  Input,
  SubmitButton,
} from "../styles/AdminSignInStyles";

const AdminSignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Admin connecté: ${email}`);
    navigate("/admin/dashboard");
  };

  return (
    <FormWrapper>
      <Title>Connexion Administrateur</Title>
      <StyledForm onSubmit={handleSubmit}>
        <label>Email :</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Mot de passe :</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton type="submit">Se connecter</SubmitButton>
      </StyledForm>
    </FormWrapper>
  );
};

export default AdminSignIn;
