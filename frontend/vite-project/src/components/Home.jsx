import React from "react";
import {
  Navbar,
  Logo,
  NavigationLinks,
  NavLink,
  ButtonsContainer,
  LoginButton,
  GuestButton,
  HomeContainer,
  SchoolInfo,
  SchoolImage,
  Title,
  LoremTextContainer,
  AdminRegisterLink,
} from "../styles/styles";
import { LoremIpsum } from "lorem-ipsum";
import bg from "../assets/bg.jpeg";
import { useNavigate } from "react-router-dom";

const Lorem = new LoremIpsum();

const Home = () => {
  const navigate = useNavigate();
  const LoremText = Lorem.generateParagraphs(1);
  const handleLoginClick = () => {
    navigate("/choose-user");
  };

  return (
    <>
      <Navbar>
        <NavigationLinks>
          <NavLink href="#">About Us</NavLink>
          <NavLink href="#">Products</NavLink>
          <NavLink href="#">Contact Us</NavLink>
          <NavLink href="#">Help</NavLink>
        </NavigationLinks>
        <ButtonsContainer>
          <LoginButton onClick={handleLoginClick}>Sign In</LoginButton>
          <GuestButton onClick={handleLoginClick}>Guest Mode</GuestButton>
        </ButtonsContainer>
      </Navbar>

      <HomeContainer>
        <SchoolInfo>
          <Title>School Management System</Title>
          <LoremTextContainer>
            <p>{LoremText}</p>
          </LoremTextContainer>
          <AdminRegisterLink to="/adminregister">Admin Register</AdminRegisterLink>
        </SchoolInfo>
        <SchoolImage src={bg} alt="Student" />
      </HomeContainer>
    </>
  );
};

export default Home;
