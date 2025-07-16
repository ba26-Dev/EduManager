import React from 'react';
import styled from 'styled-components';

const CardsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const Card = styled.div`
  flex: 1 1 200px;
  background-color: #4f46e5;
  color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Number = styled.div`
  font-size: 3rem;
  font-weight: bold;
`;

const Label = styled.div`
  margin-top: 8px;
  font-size: 1.2rem;
  font-weight: 500;
`;

const DashboardCards = () => {
  // Données simulées
  const data = {
    students: 1423,
    teachers: 56,
    courses: 24,
    classrooms: 12,
  };

  return (
    <CardsContainer>
      <Card>
        <Number>{data.students}</Number>
        <Label>Étudiants</Label>
      </Card>
      <Card>
        <Number>{data.teachers}</Number>
        <Label>Enseignants</Label>
      </Card>
      <Card>
        <Number>{data.courses}</Number>
        <Label>Cours</Label>
      </Card>
      <Card>
        <Number>{data.classrooms}</Number>
        <Label>Salles</Label>
      </Card>
    </CardsContainer>
  );
};

export default DashboardCards;
