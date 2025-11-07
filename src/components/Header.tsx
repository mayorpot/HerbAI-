// src/components/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin' | 'moderator';
}

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hide header on login/register pages - return null to remove completely
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  if (isAuthPage) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/assistant', label: 'Assistant', icon: '🤖' },
    { path: '/scanner', label: 'Scanner', icon: '📷' },
    { path: '/remedies', label: 'Remedies', icon: '🌿' },
    { path: '/library', label: 'Library', icon: '📚' },
    { path: '/store', label: 'Store', icon: '🛍️' },
    { path: '/consultation', label: 'Doctors', icon: '👨‍⚕️' },
  ];

  // Add admin link if user is admin
  if (user && user.role === 'admin') {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  return (
    <header style={headerStyles}>
      <nav style={navStyles}>
        {/* Logo */}
        <Link to="/" style={logoStyles}>
          <span>🌿</span>
          <span style={{ marginLeft: '0.5rem' }}>HerbAI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="nav-links-desktop" style={navLinksStyles}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{
                  ...navLinkStyles,
                  ...(isActive ? activeNavLinkStyles : {})
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.85rem' }}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="user-section-desktop" style={userSectionStyles}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link 
                to="/profile" 
                style={{
                  ...navLinkStyles,
                  ...(location.pathname === '/profile' ? activeNavLinkStyles : {})
                }}
              >
                <span>👤</span>
                <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name.split(' ')[0]}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                style={logoutButtonStyles}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link 
                to="/login" 
                style={loginButtonStyles}
              >
                Sign In
              </Link>
              <Link 
                to="/register"
                style={registerButtonStyles}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={mobileMenuButtonStyles}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" style={mobileMenuStyles}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                style={{
                  ...mobileNavLinkStyles,
                  ...(isActive ? activeNavLinkStyles : {})
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
          
          {/* Mobile Auth Section */}
          <div style={mobileAuthSectionStyles}>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  style={mobileNavLinkStyles}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>👤</span>
                  <span>Profile ({user.name.split(' ')[0]})</span>
                </Link>
                <button
                  onClick={handleLogout}
                  style={mobileLogoutButtonStyles}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  style={mobileNavLinkStyles}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>🔐</span>
                  <span>Sign In</span>
                </Link>
                <Link 
                  to="/register"
                  style={mobileRegisterButtonStyles}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>📝</span>
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

// Styles
const headerStyles: React.CSSProperties = {
  background: '#000000',
  borderBottom: '1px solid #333333',
  padding: '0.5rem 1rem',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
};

const navStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  maxWidth: '1200px',
  margin: '0 auto',
  height: '60px',
};

const logoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#48bb78',
  textDecoration: 'none',
  minWidth: '100px',
};

const navLinksStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flex: 1,
  justifyContent: 'center',
};

const navLinkStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0.5rem 0.75rem',
  textDecoration: 'none',
  color: '#e2e8f0',
  borderRadius: '8px',
  fontSize: '0.8rem',
  minWidth: '60px',
  transition: 'all 0.2s ease',
  gap: '0.25rem',
};

const activeNavLinkStyles: React.CSSProperties = {
  background: '#1a472a',
  color: '#48bb78',
  fontWeight: '500',
};

const userSectionStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  minWidth: '200px',
  justifyContent: 'flex-end',
};

const loginButtonStyles: React.CSSProperties = {
  background: 'transparent',
  color: '#e2e8f0',
  border: '1px solid #48bb78',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
};

const registerButtonStyles: React.CSSProperties = {
  background: '#48bb78',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '0.9rem',
  fontWeight: '500',
  border: 'none',
  transition: 'all 0.2s ease',
};

const logoutButtonStyles: React.CSSProperties = {
  background: 'transparent',
  color: '#e2e8f0',
  border: '1px solid #718096',
  padding: '0.5rem 1rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '500',
  transition: 'all 0.2s ease',
};

// Mobile Styles
const mobileMenuButtonStyles: React.CSSProperties = {
  display: 'none',
  background: 'transparent',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  padding: '0.5rem',
  color: '#e2e8f0',
};

const mobileMenuStyles: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  background: '#1a1a1a',
  borderTop: '1px solid #333333',
  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  gap: '0.5rem',
};

const mobileNavLinkStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  textDecoration: 'none',
  color: '#e2e8f0',
  borderRadius: '6px',
  fontSize: '1rem',
  border: '1px solid #333333',
  background: '#2d2d2d',
};

const mobileAuthSectionStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginTop: '1rem',
  paddingTop: '1rem',
  borderTop: '1px solid #333333',
};

const mobileLogoutButtonStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  textDecoration: 'none',
  color: '#f56565',
  borderRadius: '6px',
  fontSize: '1rem',
  border: '1px solid #f56565',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left' as const,
};

const mobileRegisterButtonStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '0.75rem 1rem',
  textDecoration: 'none',
  color: 'white',
  borderRadius: '6px',
  fontSize: '1rem',
  border: 'none',
  background: '#48bb78',
  justifyContent: 'center',
};

export default Header;