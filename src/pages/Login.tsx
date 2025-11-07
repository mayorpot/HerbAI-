// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainerStyles}>
      <div style={cardStyles}>
        {/* Header Section */}
        <div style={headerStyles}>
          <div style={logoStyles}>🌿</div>
          <h1 style={titleStyles}>Welcome to HerbAI</h1>
          <p style={subtitleStyles}>Sign in to your account</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={errorStyles}>
            <div style={errorIconStyles}>⚠️</div>
            <div style={errorTextStyles}>{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={formStyles}>
          <div style={inputGroupStyles}>
            <label style={labelStyles}>
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              disabled={loading}
              style={{
                ...inputStyles,
                ...(loading ? disabledInputStyles : {})
              }}
              placeholder="Enter your email address"
            />
          </div>

          <div style={inputGroupStyles}>
            <div style={labelContainerStyles}>
              <label style={labelStyles}>
                Password
              </label>
              <Link 
                to="/forgot-password" 
                style={forgotPasswordStyles}
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              disabled={loading}
              style={{
                ...inputStyles,
                ...(loading ? disabledInputStyles : {})
              }}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...submitButtonStyles,
              ...(loading ? disabledButtonStyles : {})
            }}
          >
            {loading ? (
              <div style={loadingContainerStyles}>
                <div style={spinnerStyles}></div>
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div style={signupContainerStyles}>
          <span style={signupTextStyles}>
            Don't have an account?{' '}
          </span>
          <Link 
            to="/register" 
            style={signupLinkStyles}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

// Styles - UPDATED: Removed all extra margins and padding
const pageContainerStyles: React.CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#000000',
  padding: '0',
  margin: '0',
  overflow: 'hidden',
};

const cardStyles: React.CSSProperties = {
  background: '#1a1a1a',
  borderRadius: '16px',
  padding: '2.5rem 2rem',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #333333',
  margin: '1rem',
};

const headerStyles: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '2rem',
  padding: '0',
};

const logoStyles: React.CSSProperties = {
  fontSize: '3rem',
  marginBottom: '1rem',
  display: 'block',
  filter: 'brightness(1.2)',
};

const titleStyles: React.CSSProperties = {
  fontSize: '1.75rem',
  fontWeight: '700',
  color: '#ffffff',
  margin: '0 0 0.5rem 0',
  lineHeight: 1.2,
};

const subtitleStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#a0a0a0',
  margin: '0',
  fontWeight: '400',
};

const errorStyles: React.CSSProperties = {
  background: '#2a1a1a',
  border: '1px solid #5c2e2e',
  borderRadius: '12px',
  padding: '1rem',
  marginBottom: '1.5rem',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.75rem',
};

const errorIconStyles: React.CSSProperties = {
  fontSize: '1rem',
  flexShrink: 0,
  marginTop: '0.125rem',
};

const errorTextStyles: React.CSSProperties = {
  color: '#f56565',
  fontSize: '0.875rem',
  lineHeight: 1.4,
  flex: 1,
};

const formStyles: React.CSSProperties = {
  marginBottom: '1.5rem',
};

const inputGroupStyles: React.CSSProperties = {
  marginBottom: '1.25rem',
};

const labelContainerStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem',
};

const labelStyles: React.CSSProperties = {
  display: 'block',
  color: '#e2e8f0',
  fontWeight: '500',
  fontSize: '0.875rem',
  marginBottom: '0.5rem',
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  border: '2px solid #333333',
  borderRadius: '8px',
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#2d2d2d',
  color: '#ffffff',
};

const disabledInputStyles: React.CSSProperties = {
  opacity: 0.6,
  cursor: 'not-allowed',
  background: '#252525',
};

const forgotPasswordStyles: React.CSSProperties = {
  color: '#48bb78',
  fontSize: '0.875rem',
  fontWeight: '500',
  textDecoration: 'none',
};

const submitButtonStyles: React.CSSProperties = {
  width: '100%',
  padding: '1rem',
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  marginBottom: '1.5rem',
};

const disabledButtonStyles: React.CSSProperties = {
  opacity: 0.7,
  cursor: 'not-allowed',
};

const loadingContainerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
};

const spinnerStyles: React.CSSProperties = {
  width: '16px',
  height: '16px',
  border: '2px solid transparent',
  borderTop: '2px solid white',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const signupContainerStyles: React.CSSProperties = {
  textAlign: 'center',
  paddingTop: '1.5rem',
  borderTop: '1px solid #333333',
};

const signupTextStyles: React.CSSProperties = {
  color: '#a0a0a0',
  fontSize: '0.875rem',
};

const signupLinkStyles: React.CSSProperties = {
  color: '#48bb78',
  fontWeight: '600',
  textDecoration: 'none',
  fontSize: '0.875rem',
};

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Remove any global margins and padding that might cause white space */
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  #root {
    height: 100%;
  }
`;
document.head.appendChild(style);

export default Login;