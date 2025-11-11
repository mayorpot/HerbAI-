// src/pages/Register.tsx - Enhanced with split-screen layout and responsive design
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [healthProfile, setHealthProfile] = useState({
    allergies: [] as string[],
    medicalHistory: [] as string[],
    medications: [] as string[]
  });
  const [currentAllergy, setCurrentAllergy] = useState('');
  const [currentCondition, setCurrentCondition] = useState('');
  const [currentMedication, setCurrentMedication] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const addAllergy = () => {
    if (currentAllergy.trim() && !healthProfile.allergies.includes(currentAllergy)) {
      setHealthProfile(prev => ({
        ...prev,
        allergies: [...prev.allergies, currentAllergy.trim()]
      }));
      setCurrentAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setHealthProfile(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addMedicalHistory = () => {
    if (currentCondition.trim() && !healthProfile.medicalHistory.includes(currentCondition)) {
      setHealthProfile(prev => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, currentCondition.trim()]
      }));
      setCurrentCondition('');
    }
  };

  const removeMedicalHistory = (condition: string) => {
    setHealthProfile(prev => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter(m => m !== condition)
    }));
  };

  const addMedication = () => {
    if (currentMedication.trim() && !healthProfile.medications.includes(currentMedication)) {
      setHealthProfile(prev => ({
        ...prev,
        medications: [...prev.medications, currentMedication.trim()]
      }));
      setCurrentMedication('');
    }
  };

  const removeMedication = (medication: string) => {
    setHealthProfile(prev => ({
      ...prev,
      medications: prev.medications.filter(m => m !== medication)
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        healthProfile
      });
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
            Welcome to HerbAI
          </h1>
          <p style={{ 
            fontSize: isMobile ? '1rem' : '1.25rem', 
            marginBottom: '2.5rem',
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            Discover the power of nature with AI-powered herbal wellness recommendations tailored just for you.
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
                💡
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>AI-Powered Insights</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Get personalized herbal recommendations based on your unique health profile
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
                🔒
              </div>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Safe & Secure</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Your health data is encrypted and protected with enterprise-grade security
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
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Natural Wellness</h3>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem' }}>
                  Access centuries of herbal wisdom combined with modern scientific research
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div style={{
        flex: 1,
        padding: isMobile ? '2rem 1.5rem' : '3rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'white',
        overflowY: 'auto'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: isMobile ? '2rem' : '2.5rem', 
              fontWeight: '700', 
              color: '#2E7D32',
              marginBottom: '0.5rem'
            }}>
              Create Account
            </h1>
            <p style={{ 
              color: '#666666', 
              fontSize: isMobile ? '0.95rem' : '1.1rem',
              margin: 0
            }}>
              Join HerbAI and start your wellness journey today
            </p>
          </div>

          {error && (
            <div style={{
              background: '#FFEBEE',
              border: '1px solid #F44336',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
              color: '#C62828',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Personal Information */}
            <div style={{ 
              background: '#F8F9FA', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              marginBottom: '1.5rem',
              border: '1px solid #E8E8E8'
            }}>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.1rem' }}>
                Personal Information
              </h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '1rem', 
                marginBottom: '1.5rem' 
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500', fontSize: '0.9rem' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      opacity: loading ? 0.7 : 1,
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500', fontSize: '0.9rem' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      opacity: loading ? 0.7 : 1,
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500', fontSize: '0.9rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    opacity: loading ? 0.7 : 1,
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="Enter your email"
                />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                gap: '1rem' 
              }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500', fontSize: '0.9rem' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      opacity: loading ? 0.7 : 1,
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="Create a password"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500', fontSize: '0.9rem' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      opacity: loading ? 0.7 : 1,
                      transition: 'border-color 0.2s'
                    }}
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            {/* Health Profile Section */}
            <div style={{ 
              background: '#F8F9FA', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              marginBottom: '1.5rem',
              border: '1px solid #E8E8E8'
            }}>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.1rem' }}>
                Health Profile (Optional)
              </h3>
              <p style={{ color: '#666666', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                This information helps us provide personalized and safe herbal recommendations.
              </p>

              {/* Allergies */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500', fontSize: '0.9rem' }}>
                  Allergies
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexDirection: isMobile ? 'column' : 'row' }}>
                  <input
                    type="text"
                    value={currentAllergy}
                    onChange={(e) => setCurrentAllergy(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      opacity: loading ? 0.7 : 1
                    }}
                    placeholder="Add an allergy (e.g., Pollen, Penicillin)"
                  />
                  <button
                    type="button"
                    onClick={addAllergy}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#2E7D32',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      fontSize: '0.9rem',
                      minWidth: isMobile ? '100%' : 'auto'
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {healthProfile.allergies.map((allergy, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#FFEBEE',
                        color: '#C62828',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => removeAllergy(allergy)}
                        disabled={loading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#C62828',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Medical Conditions */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500', fontSize: '0.9rem' }}>
                  Medical Conditions
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexDirection: isMobile ? 'column' : 'row' }}>
                  <input
                    type="text"
                    value={currentCondition}
                    onChange={(e) => setCurrentCondition(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedicalHistory())}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      opacity: loading ? 0.7 : 1
                    }}
                    placeholder="Add a condition (e.g., Diabetes, Hypertension)"
                  />
                  <button
                    type="button"
                    onClick={addMedicalHistory}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#2E7D32',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      fontSize: '0.9rem',
                      minWidth: isMobile ? '100%' : 'auto'
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {healthProfile.medicalHistory.map((condition, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#E3F2FD',
                        color: '#1565C0',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeMedicalHistory(condition)}
                        disabled={loading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#1565C0',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Medications */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500', fontSize: '0.9rem' }}>
                  Current Medications
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexDirection: isMobile ? 'column' : 'row' }}>
                  <input
                    type="text"
                    value={currentMedication}
                    onChange={(e) => setCurrentMedication(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
                    disabled={loading}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      opacity: loading ? 0.7 : 1
                    }}
                    placeholder="Add medication (e.g., Metformin, Lisinopril)"
                  />
                  <button
                    type="button"
                    onClick={addMedication}
                    disabled={loading}
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#2E7D32',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1,
                      fontSize: '0.9rem',
                      minWidth: isMobile ? '100%' : 'auto'
                    }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {healthProfile.medications.map((medication, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#E8F5E8',
                        color: '#2E7D32',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {medication}
                      <button
                        type="button"
                        onClick={() => removeMedication(medication)}
                        disabled={loading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2E7D32',
                          cursor: loading ? 'not-allowed' : 'pointer',
                          fontSize: '1rem'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                  disabled={loading}
                  style={{ marginTop: '0.25rem', cursor: loading ? 'not-allowed' : 'pointer' }}
                />
                <span style={{ color: '#666666', fontSize: '0.85rem', opacity: loading ? 0.7 : 1 }}>
                  I agree to the{' '}
                  <Link to="/terms" style={{ color: '#2E7D32', textDecoration: 'none' }}>Terms of Service</Link> and{' '}
                  <Link to="/privacy" style={{ color: '#2E7D32', textDecoration: 'none' }}>Privacy Policy</Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                background: loading ? '#CCCCCC' : '#2E7D32',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '1.5rem',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div style={{ textAlign: 'center', color: '#666666', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#2E7D32', fontWeight: '500', textDecoration: 'none' }}>
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;