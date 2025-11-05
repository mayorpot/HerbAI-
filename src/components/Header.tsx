// src/components/Header.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/assistant', label: 'AI Assistant', icon: '🤖' },
    { path: '/scanner', label: 'Scanner', icon: '📷' },
    { path: '/remedies', label: 'Remedies', icon: '🌿' },
    { path: '/library', label: 'Library', icon: '📚' },
    { path: '/store', label: 'Store', icon: '🛍️' },
    { path: '/consultation', label: 'Doctors', icon: '👨‍⚕️' },
  ];

  // Add admin link if user is admin (you can implement admin check)
  if (user) {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="logo">
          <span>🌿</span>
          <span>ALBA</span>
        </Link>
        
        <div className="nav-links">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                <span>👤</span>
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  color: '#666666',
                  border: '1px solid #E0E0E0',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                style={{ 
                  background: 'transparent', 
                  border: '1px solid #E0E0E0',
                  textDecoration: 'none'
                }}
              >
                <span>🔐</span>
                <span>Sign In</span>
              </Link>
              <Link 
                to="/register"
                style={{
                  background: '#2E7D32',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;