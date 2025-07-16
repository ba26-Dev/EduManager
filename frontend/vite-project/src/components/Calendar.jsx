import React, { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { dateFnsLocalizer } from "react-big-calendar";

const locales = {
  "fr": require("date-fns/locale/fr"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "Réunion de direction",
    start: new Date(2025, 6, 20, 10, 0), // 20 juillet 2025 10h00
    end: new Date(2025, 6, 20, 11, 0),
  },
  {
    title: "Examen Maths",
    start: new Date(2025, 6, 22, 9, 0),
    end: new Date(2025, 6, 22, 12, 0),
  },
];

export default function Calendar() {
  return (
    <div style={{ height: "600px", padding: "20px" }}>
      <h2>Calendrier des événements</h2>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        culture="fr"
        messages={{
          next: "Suivant",
          previous: "Précédent",
          today: "Aujourd'hui",
          month: "Mois",
          week: "Semaine",
          day: "Jour",
          agenda: "Agenda",
          noEventsInRange: "Aucun événement",
        }}
      />
    </div>
  );
}
