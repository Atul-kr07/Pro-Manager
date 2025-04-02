import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  background: ${props => props.theme.colors.primary};
  padding: 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: white;
    color: ${props => props.theme.colors.primary};
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
`;

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <LayoutContainer>
      <Navbar>
        <NavLinks>
          <NavLink to="/">Projects</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
        </NavLinks>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Navbar>
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 