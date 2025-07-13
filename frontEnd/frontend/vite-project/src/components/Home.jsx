import React from "react";
import {Navbar,
    logo,
    NavigationLink,
    NavLink, 
    ButtonsContainer,
    NavLink,
     ButtonsContainer,
LoginButton, 
GuestButton, 
Homecontainer, 
SchoolInfo, 
SchoolImage, 
Title, 
LoremTextContainer,
AdminRegisterLink, 
}from '../styles/styles';
import {LoremIpsum}from 'lorem-ipsum';
import bg from '../assets/bg.jpeg';
import bg1 from '../assets/bg1.png';
import { Link, useNavigate }from 'react-dom';

const Lorem =new LoremIpsum();
const LoremText = Lorem.generateParagraph(1);
const Home = () =>{
    const navigate = useNavigate();
    

    const handleLoginClick = () => {

    };

    return (
        <>
        <Navbar>
        
            <NavigationLinks>
                <Navlink href = "#">About Us</Navlink>
                <Navlink href = "#">Products</Navlink>
                <Navlink href = "#">Contact Us</Navlink>
                 <Navlink href = "#">Contact Us</Navlink>
            </NavigationLinks>
            <ButtonContainer>
                <LoginsButton>Sign In</LoginsButton>
                <GuestButton>Guest Mode</GuestButton>
            </ButtonContainer>
        </Navbar>
        <Homecontainer>
            <SchoolInfo>
                <Title> School Management System</Title>
                <LoremTextContainer>
               <p>{LoremText} </p>
                </LoremTextContainer >
                <AdminRegisterLink>Admin Register</AdminRegisterLink>
            </SchoolInfo>
            <SchoolImage src = {bg} alt = "Student"/>
        </Homecontainer>
        </>
    )
};
export default Home;