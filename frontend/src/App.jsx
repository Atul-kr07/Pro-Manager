import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Projects from './Pages/Projects';
import Tasks from './Pages/Tasks';
import Reports from './Pages/Reports';
import About from './Pages/About';
import Help from './Pages/Help';
import Profile from './Pages/Profile';
import MainLayout from './layouts/MainLayout';
import './styles/App.css';

const lightTheme = {
  mode: 'light',
  colors: {
    primary: '#007bff',
    secondary: '#6c757d',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
  }
};

const darkTheme = {
  mode: 'dark',
  colors: {
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#0dcaf0',
    background: '#121212',
    surface: '#242424',
    text: '#ffffff',
    textSecondary: '#aaaaaa',
    border: '#333333',
  }
};

const App = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          // Verify the user data is valid JSON
          JSON.parse(user);
          setIsAuth(true);
        } catch (e) {
          // If user data is invalid, clear auth
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuth(false);
        }
      } else {
        setIsAuth(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogin = (authData) => {
    if (authData && authData.token && authData.user) {
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(authData.user));
      setIsAuth(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuth(false);
  };

  if (isLoading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: theme === 'light' ? lightTheme.colors.background : darkTheme.colors.background,
        color: theme === 'light' ? lightTheme.colors.text : darkTheme.colors.text
      }}>
        Loading...
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            !isAuth ? (
              <Login onLogin={handleLogin} theme={theme} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />
          <Route path="/register" element={
            !isAuth ? (
              <Register theme={theme} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />

          {/* Protected routes */}
          <Route path="/" element={
            isAuth ? (
              <MainLayout toggleTheme={toggleTheme} theme={theme} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="reports" element={<Reports />} />
            <Route path="about" element={<About />} />
            <Route path="help" element={<Help />} />
          </Route>

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;