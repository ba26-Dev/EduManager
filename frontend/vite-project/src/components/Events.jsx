import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;

const EventCard = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-size: 18px;
  margin-bottom: 5px;
`;

const Info = styled.p`
  font-size: 14px;
  color: #555;
`;

const eventsList = [
  { id: 1, title: "Réunion des professeurs", date: "2025-07-25", time: "10:00", location: "Salle 1" },
  { id: 2, title: "Fête de fin d'année", date: "2025-08-01", time: "15:00", location: "Cour de l'école" },
  { id: 3, title: "Exposition scientifique", date: "2025-08-10", time: "09:00", location: "Amphithéâtre" },
];

const Events = () => {
  return (
    <Container>
      <h2>Événements à venir</h2>
      {eventsList.map((event) => (
        <EventCard key={event.id}>
          <Title>{event.title}</Title>
          <Info>Date : {event.date}</Info>
          <Info>Heure : {event.time}</Info>
          <Info>Lieu : {event.location}</Info>
        </EventCard>
      ))}
    </Container>
  );
};

export default Events;
