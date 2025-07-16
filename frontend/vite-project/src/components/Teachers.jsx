import React from "react";
import styled from "styled-components";
import { FaChalkboardTeacher } from "react-icons/fa";
import { useNavigate } from "react-router-dom";  // <-- import

const Container = styled.div`
  padding: 20px;
`;

const Button = styled.button`
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-bottom: 20px;
  &:hover {
    background-color: #1d4ed8;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Icon = styled.div`
  font-size: 40px;
  color: #2563eb;
  margin-bottom: 10px;
`;

const Name = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const Subject = styled.p`
  font-size: 14px;
  color: #555;
`;

const Teachers = () => {
  const navigate = useNavigate();  // Hook navigation

  const teacherList = [
    { id: 1, firstName: "Marie", lastName: "Dupont", subject: "Mathématiques" },
    { id: 2, firstName: "Jean", lastName: "Martin", subject: "Physique" },
    { id: 3, firstName: "Sophie", lastName: "Bernard", subject: "Français" },
    { id: 4, firstName: "Ali", lastName: "Sarr", subject: "Informatique" },
    { id: 5, firstName: "Fatou", lastName: "Diop", subject: "Anglais" },
    // ajoute jusqu'à 18 teachers ici
  ];

  return (
    <Container>
      {/* Bouton Home */}
      <Button onClick={() => navigate("/")}>Home</Button>

      <h2>All Teachers</h2>
      <Grid>
        {teacherList.map(({ id, firstName, lastName, subject }) => (
          <Card key={id}>
            <Icon>
              <FaChalkboardTeacher />
            </Icon>
            <Name>{firstName} {lastName}</Name>
            <Subject>{subject}</Subject>
          </Card>
        ))}
      </Grid>
    </Container>
  );
};

export default Teachers;
