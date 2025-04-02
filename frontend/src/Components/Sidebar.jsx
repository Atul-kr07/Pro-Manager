import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaHome, 
  FaTasks, 
  FaProjectDiagram, 
  FaChartBar, 
  FaUsers, 
  FaCalendarAlt, 
  FaInbox, 
  FaChevronLeft, 
  FaChevronRight,
  FaSearch,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
  FaInfoCircle,
  FaUserCircle,
  FaCog,
  FaEnvelope,
  FaClock,
  FaUser
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import '../styles/Sidebar.css';
import styled from 'styled-components';

const SidebarContainer = styled.aside`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.$isOpen ? '250px' : '80px'};
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  transition: width 0.3s ease;
  z-index: 1000;
  overflow-x: hidden;
`;

const SidebarHeader = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  padding: 0.5rem;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SidebarContent = styled.div`
  padding: 1rem;
`;

const UserProfile = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: ${props => props.theme.colors.danger};
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  display: ${props => props.$count > 0 ? 'block' : 'none'};
`;

const NavSection = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: ${props => props.theme.colors.textSecondary};
  letter-spacing: 0.5px;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: opacity 0.3s ease;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${props => props.$active ? props.theme.colors.primary : props.theme.colors.text};
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;

  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
`;

const IconWrapper = styled.span`
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.$isOpen ? '1rem' : '0'};
`;

const NavText = styled.span`
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: opacity 0.3s ease;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--danger-color);
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: auto;
  border-radius: 8px;
  gap: 1rem;

  &:hover {
    background: var(--bg-hover);
    color: var(--danger-color);
  }
`;

const Sidebar = ({ $isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/login');
    }
  };

  return (
    <SidebarContainer $isOpen={$isOpen}>
      <SidebarHeader>
        <Logo>
          {!$isOpen ? 'PM' : 'Pro Manager'}
        </Logo>
        <ToggleButton onClick={toggleSidebar}>
          {$isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </ToggleButton>
      </SidebarHeader>

      <UserProfile>
        <UserAvatar>
          <FaUser />
        </UserAvatar>
        <UserInfo>
          <UserName>Hi !! User</UserName>
          <UserRole>Administrator</UserRole>
        </UserInfo>
      </UserProfile>

      <SidebarContent>
        <NavSection>
          <SectionTitle $isOpen={$isOpen}>Main Menu</SectionTitle>
          <NavItem 
            to="/profile" 
            $active={location.pathname === '/profile'}
            $isOpen={$isOpen}
          >
            <IconWrapper $isOpen={$isOpen}>
              <FaUserCircle />
            </IconWrapper>
            <NavText $isOpen={$isOpen}>View Profile</NavText>
          </NavItem>

          <NavItem 
            to="/dashboard" 
            $active={location.pathname === '/dashboard'}
            $isOpen={$isOpen}
          >
            <IconWrapper $isOpen={$isOpen}>
              <MdDashboard />
            </IconWrapper>
            <NavText $isOpen={$isOpen}>Dashboard</NavText>
          </NavItem>

          <NavItem 
            to="/projects" 
            $active={location.pathname === '/projects'}
            $isOpen={$isOpen}
          >
            <IconWrapper $isOpen={$isOpen}>
              <FaProjectDiagram />
            </IconWrapper>
            <NavText $isOpen={$isOpen}>Projects</NavText>
          </NavItem>

          <NavItem 
            to="/tasks" 
            $active={location.pathname === '/tasks'}
            $isOpen={$isOpen}
          >
            <IconWrapper $isOpen={$isOpen}>
              <FaTasks />
            </IconWrapper>
            <NavText $isOpen={$isOpen}>Tasks</NavText>
          </NavItem>

          <NavItem 
            to="/reports" 
            $active={location.pathname === '/reports'}
            $isOpen={$isOpen}
          >
            <IconWrapper $isOpen={$isOpen}>
              <FaChartBar />
            </IconWrapper>
            <NavText $isOpen={$isOpen}>Reports</NavText>
          </NavItem>
        </NavSection>

        <NavSection>
          <SectionTitle $isOpen={$isOpen}>Support</SectionTitle>
          <NavItem 
            to="/about" 
            $active={location.pathname === '/about'}
            $isOpen={$isOpen}
          >
            <IconWrapper $isOpen={$isOpen}>
              <FaInfoCircle />
            </IconWrapper>
            <NavText $isOpen={$isOpen}>About</NavText>
          </NavItem>

          <NavItem 
            to="/help" 
            $active={location.pathname === '/help'}
            $isOpen={$isOpen}
          >
            <IconWrapper $isOpen={$isOpen}>
              <FaQuestionCircle />
            </IconWrapper>
            <NavText $isOpen={$isOpen}>Help & Support</NavText>
          </NavItem>
        </NavSection>

        <LogoutButton onClick={handleLogout}>
          <IconWrapper $isOpen={$isOpen}>
            <FaSignOutAlt />
          </IconWrapper>
          <NavText $isOpen={$isOpen}>Logout</NavText>
        </LogoutButton>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;
