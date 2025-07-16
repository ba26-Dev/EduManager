import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import ChooseUser from "./components/ChooseUser.jsx";
import AdminSignIn from "./components/AdminSignIn.jsx";
import TeacherSignIn from "./components/TeacherSignIn.jsx";
import StudentSignIn from "./components/StudentSignIn.jsx";
import TeacherDashboard from "./components/TeacherDashboard.jsx";
import StudentDashboard from "./components/StudentDashboard.jsx";

// Pages Admin
import Dashboard from "./components/AdminDashboard.jsx";
import Students from "./components/Students.jsx";
import Teachers from "./components/Teachers.jsx";
import Assignments from "./components/Assignments.jsx";
import Exams from "./components/Exams.jsx";
import Performance from "./components/Performance.jsx";
import Attendance from "./components/Attendance.jsx";
import Library from "./components/Library.jsx";
import Announcements from "./components/Announcements.jsx";
import Events from "./components/Events.jsx";
import Settings from "./components/Settings.jsx";
import Profile from "./components/Profile.jsx";

// Layouts
import AdminLayout from "./components/layouts/AdminLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/choose-user" element={<ChooseUser />} />

      {/* Connexions */}
      <Route path="/adminsignin" element={<AdminSignIn />} />
      <Route path="/teachersignin" element={<TeacherSignIn />} />
      <Route path="/studentsignin" element={<StudentSignIn />} />

      {/* Dashboards directs */}
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/student/dashboard" element={<StudentDashboard />} />

      {/* Admin avec layout complet */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="teachers" element={<Teachers />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="exams" element={<Exams />} />
        <Route path="performance" element={<Performance />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="library" element={<Library />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="events" element={<Events />} />
        <Route path="settings" element={<Settings />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;
