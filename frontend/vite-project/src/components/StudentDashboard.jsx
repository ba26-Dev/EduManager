import React from "react";
import styled from "styled-components";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import fr from "date-fns/locale/fr";

// Localisation française
const locales = {
  fr: fr,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Simuler les cours ou événements
const events = [
  {
    title: "Cours de Mathématiques",
    start: new Date(2025, 6, 17, 8, 0),
    end: new Date(2025, 6, 17, 10, 0),
  },
  {
    title: "Cours d'Anglais",
    start: new Date(2025, 6, 18, 14, 0),
    end: new Date(2025, 6, 18, 15, 30),
  },
  {
    title: "Examen de Physique",
    start: new Date(2025, 6, 19, 9, 0),
    end: new Date(2025, 6, 19, 12, 0),
  },
];

const Container = styled.div`
  padding: 20px;
  background: #f8fafc;
  min-height: 100vh;
`;

const StudentDashboard = () => {
  const email = localStorage.getItem("studentEmail") || "Étudiant";

  return (
    <Container>
      <h2>🎓 Bienvenue, {email}</h2>
      <p>Voici ton calendrier :</p>

      <div style={{ height: "500px", marginTop: "20px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          culture="fr"
          style={{ height: 500 }}
          messages={{
            today: "Aujourd'hui",
            previous: "Précédent",
            next: "Suivant",
            month: "Mois",
            week: "Semaine",
            day: "Jour",
            agenda: "Agenda",
            noEventsInRange: "Aucun événement",
          }}
        />
      </div>
    </Container>
  );
};

export default StudentDashboard;
