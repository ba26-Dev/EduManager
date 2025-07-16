// src/components/AdminDashboard.jsx (pareil pour Teacher ou Student)
import React from "react";
import { Link } from "react-router-dom";
import "./dashboard.css"; // tu peux le remplacer par styled-components si tu préfères

const AdminDashboard = () => {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">🎓 SchoolManager</h2>
        <nav className="nav-menu">
          <Link to="/admin/dashboard">Dashboard</Link>
          <Link to="/admin/students">Students</Link>
          <Link to="/admin/teachers">Teachers</Link>
          <Link to="/admin/assignments">Assignments</Link>
          <Link to="/admin/exams">Exams</Link>
          <Link to="/admin/performance">Performance</Link>
          <Link to="/admin/attendance">Attendance</Link>
          <Link to="/admin/library">Library</Link>
          <Link to="/admin/announcements">Announcements</Link>
          <Link to="/admin/events">Events & Calendar</Link>
          <Link to="/admin/settings">Settings</Link>
          <Link to="/admin/profile">Profile</Link>
        </nav>
      </aside>

      <main className="main-content">
        <h1>🎉 Bienvenue sur le tableau de bord Administrateur</h1>
        <p>Sélectionnez une section dans le menu à gauche.</p>
      </main>
    </div>
  );
};

export default AdminDashboard;
