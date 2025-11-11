// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row' as 'column' | 'row',
    background: 'white'
  };

  return (
    <div style={containerStyle}>
      {/* Left Side - Brand Section */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
        color: 'white',
        padding: isMobile ? '2rem 1.5rem' : '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '500px' }}>
          <div style={{ 
            fontSize: isMobile ? '3rem' : '4rem', 
            marginBottom: '1.5rem',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
          }}>
            🌿
          </div>
          <h1 style={{ 
            fontSize: isMobile ? '2rem' : '3rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem',
            lineHeight: 1.1
          }}>
            Welcome Back to HerbAI
          </h1>
          <p style={{ 
            fontSize: isMobile ? '1rem' : '1.25rem', 
            marginBottom: '2.5rem',
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Continue your herbal wellness journey with personalized AI-powered recommendations.
          </p>
          
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                🔒
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Secure Access</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Your health data is protected with enterprise-grade security
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                📊
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Personalized Insights</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Access your tailored herbal recommendations and progress tracking
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                🌱
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Continuous Learning</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Your recommendations improve as we learn more about your wellness journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        padding: isMobile ? '2rem 1.5rem' : '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'white',
        overflowY: 'auto'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#2E7D32',
              marginBottom: '0.5rem'
            }}>
              Sign In
            </h1>
            <p style={{ 
              color: '#666666', 
              fontSize: '1rem',
              margin: 0
            }}>
              Welcome back! Please sign in to your account.
            </p>
          </div>

          {error && (
            <div style={errorStyles}>
              <div style={errorIconStyles}>⚠️</div>
              <div style={errorTextStyles}>{error}</div>
            </div>
          )}

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
    </div>
  );
};

// Updated Styles for Light Theme
const errorStyles: React.CSSProperties = {
  background: '#FFEBEE',
  border: '1px solid #F44336',
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
  color: '#C62828',
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
  color: '#333333',
  fontWeight: '500',
  fontSize: '0.875rem',
  marginBottom: '0.5rem',
};

const inputStyles: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem 1rem',
  border: '2px solid #E0E0E0',
  borderRadius: '8px',
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  outline: 'none',
  boxSizing: 'border-box',
  background: 'white',
  color: '#333333',
};

const disabledInputStyles: React.CSSProperties = {
  opacity: 0.6,
  cursor: 'not-allowed',
  background: '#F5F5F5',
};

const forgotPasswordStyles: React.CSSProperties = {
  color: '#2E7D32',
  fontSize: '0.875rem',
  fontWeight: '500',
  textDecoration: 'none',
};

const submitButtonStyles: React.CSSProperties = {
  width: '100%',
  padding: '1rem',
  background: '#2E7D32',
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
  background: '#CCCCCC',
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
  borderTop: '1px solid #E0E0E0',
};

const signupTextStyles: React.CSSProperties = {
  color: '#666666',
  fontSize: '0.875rem',
};

const signupLinkStyles: React.CSSProperties = {
  color: '#2E7D32',
  fontWeight: '600',
  textDecoration: 'none',
  fontSize: '0.875rem',
};

export default Login;