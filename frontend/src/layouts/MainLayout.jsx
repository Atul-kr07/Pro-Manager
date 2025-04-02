import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: ${props => props.$isSidebarOpen ? '250px' : '80px'};
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const PageContent = styled.main`
  flex: 1;
  overflow-y: auto;
  background: ${props => props.theme.colors.background};
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const ContentWrapper = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  min-height: calc(100vh - 7rem);
  overflow-y: auto;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.secondary};
  }
`;

const MainLayout = ({ toggleTheme, theme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutContainer>
      <Sidebar $isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <MainContent $isSidebarOpen={isSidebarOpen}>
        <PageContent>
          <ContentWrapper>
            <Outlet />
          </ContentWrapper>
        </PageContent>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout; 