// components/layouts/AdminLayout.jsx
import React from "react";
import styled from "styled-components";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaBookOpen, FaFileAlt,
  FaChartBar, FaCalendarAlt, FaBook, FaBullhorn, FaCog, FaUserCircle
} from "react-icons/fa";

const Layout = styled.div`
  display: flex;
  height: 100vh;
  background: #f8fafc;
`;

const Sidebar = styled.div`
  width: 240px;
  background: #0f172a;
  color: #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const TopBar = styled.div`
  height: 60px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  border-bottom: 1px solid #e2e8f0;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  color: ${({ active }) => (active === "true" ? "#38bdf8" : "#e2e8f0")};
  background: ${({ active }) => (active === "true" ? "#1e293b" : "transparent")};
  text-decoration: none;
  margin-bottom: 10px;
  transition: all 0.2s;

  &:hover {
    background: #1e293b;
    padding-left: 20px;
  }

  svg {
    margin-right: 10px;
  }
`;

const navItems = [
  { to: "/admin/dashboard", icon: <FaTachometerAlt />, label: "Dashboard" },
  { to: "/admin/students", icon: <FaUserGraduate />, label: "Students" },
  { to: "/admin/teachers", icon: <FaChalkboardTeacher />, label: "Teachers" },
  { to: "/admin/courses", icon: <FaBookOpen />, label: "Courses" },
  { to: "/admin/assignments", icon: <FaFileAlt />, label: "Assignments" },
  { to: "/admin/performance", icon: <FaChartBar />, label: "Performance" },
  { to: "/admin/calendar", icon: <FaCalendarAlt />, label: "Calendar" },
  { to: "/admin/library", icon: <FaBook />, label: "Library" },
  { to: "/admin/announcements", icon: <FaBullhorn />, label: "Announcements" },
  { to: "/admin/settings", icon: <FaCog />, label: "Settings" },
  { to: "/admin/profile", icon: <FaUserCircle />, label: "Profile" },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <Layout>
      <Sidebar>
        <h2 style={{ marginBottom: "30px", color: "#38bdf8" }}>University Admin</h2>
        {navItems.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} active={(location.pathname === to).toString()}>
            {icon} {label}
          </NavLink>
        ))}
      </Sidebar>

      <Content>
        <TopBar>
          <span style={{ marginRight: "10px" }}>Admin</span>
          <FaUserCircle size={24} />
        </TopBar>

        <div style={{ padding: "30px", overflowY: "auto", flex: 1 }}>
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default AdminLayout;
