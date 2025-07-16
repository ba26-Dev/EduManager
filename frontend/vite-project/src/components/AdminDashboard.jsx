import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: #555;
`;

const AdminDashboard = () => {
  return (
    <Wrapper>
      <Title>Welcome to the Admin Dashboard</Title>
      <Subtitle>Select a menu item to manage the school system.</Subtitle>
    </Wrapper>
  );
};

export default AdminDashboard;
