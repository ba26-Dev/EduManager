import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Sidebar = styled.div`
  width: 250px;
  background: #34495e;
  height: 100vh;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  position: fixed;
  overflow-y: auto;
`;

const Content = styled.div`
  margin-left: 250px;
  padding: 20px;
  min-height: 100vh;
  background: #f4f6f8;
`;

const Logo = styled.h2`
  font-size: 24px;
  margin-bottom: 40px;
  cursor: pointer;
`;

const MenuLink = styled(Link)`
  display: block;
  padding: 10px 0;
  color: white;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    background-color: #2c3e50;
    padding-left: 10px;
    transition: all 0.3s ease;
  }
`;

export default function DashboardLayout() {
  return (
    <>
      <Sidebar>
        <Logo>SchoolMS</Logo>
        <MenuLink to="/dashboard">Dashboard</MenuLink>
        <MenuLink to="/students">Students</MenuLink>
        <MenuLink to="/teachers">Teachers</MenuLink>
        <MenuLink to="/assignments">Assignments</MenuLink>
        <MenuLink to="/exams">Exams</MenuLink>
        <MenuLink to="/performance">Performance</MenuLink>
        <MenuLink to="/attendance">Attendance</MenuLink>
        <MenuLink to="/library">Library</MenuLink>
        <MenuLink to="/announcements">Announcements</MenuLink>
        <MenuLink to="/events">Events & Calendar</MenuLink>
        <MenuLink to="/settings">Settings</MenuLink>
        <MenuLink to="/profile">Profile</MenuLink>
      </Sidebar>
      <Content>
        <Outlet />
      </Content>
    </>
  );
}
