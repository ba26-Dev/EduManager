import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Side = styled.div`
  width: 200px;
  background: #1e293b;
  color: white;
  height: 100vh;
  padding: 20px;
`;

const NavLink = styled(Link)`
  display: block;
  color: white;
  padding: 10px 0;
  text-decoration: none;

  &:hover {
    background-color: #334155;
    padding-left: 10px;
  }
`;

const Sidebar = () => {
  return (
    <Side>
      <h2>Admin Panel</h2>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="students">Students</NavLink>
      <NavLink to="teachers">Teachers</NavLink>
      <NavLink to="settings">Settings</NavLink>
    </Side>
  );
};

export default Sidebar;
