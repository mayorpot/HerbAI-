// src/pages/Register.tsx - Enhanced with health profile
import React, { useState } from 'react';
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
  const { register } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="page-container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h1 className="page-title">Create Account</h1>
          <p className="page-subtitle">Join ALBA and discover personalized herbal wellness</p>
        </div>

        {error && (
          <div style={{
            background: '#FFEBEE',
            border: '1px solid #F44336',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#C62828',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Personal Information */}
          <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
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
                    padding: '1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    opacity: loading ? 0.7 : 1
                  }}
                  placeholder="First name"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
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
                    padding: '1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    opacity: loading ? 0.7 : 1
                  }}
                  placeholder="Last name"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
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
                  padding: '1rem',
                  border: '2px solid #E0E0E0',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  opacity: loading ? 0.7 : 1
                }}
                placeholder="Enter your email"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
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
                    padding: '1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    opacity: loading ? 0.7 : 1
                  }}
                  placeholder="Create a password"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
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
                    padding: '1rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    opacity: loading ? 0.7 : 1
                  }}
                  placeholder="Confirm your password"
                />
              </div>
            </div>
          </div>

          {/* Health Profile */}
          <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
            <h3 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Health Profile (Optional)</h3>
            <p style={{ color: '#666666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              This information helps us provide personalized and safe herbal recommendations.
            </p>

            {/* Allergies */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
                Allergies
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
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
                    fontSize: '1rem',
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
                    opacity: loading ? 0.7 : 1
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
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
                Medical Conditions
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
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
                    fontSize: '1rem',
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
                    opacity: loading ? 0.7 : 1
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
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
                Current Medications
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
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
                    fontSize: '1rem',
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
                    opacity: loading ? 0.7 : 1
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
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                disabled={loading}
                style={{ marginTop: '0.25rem', cursor: loading ? 'not-allowed' : 'pointer' }}
              />
              <span style={{ color: '#666666', fontSize: '0.9rem', opacity: loading ? 0.7 : 1 }}>
                I agree to the{' '}
                <Link to="/terms" style={{ color: '#2E7D32' }}>Terms of Service</Link> and{' '}
                <Link to="/privacy" style={{ color: '#2E7D32' }}>Privacy Policy</Link>
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
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '1.5rem',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div style={{ textAlign: 'center', color: '#666666' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#2E7D32', fontWeight: '500', textDecoration: 'none' }}>
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;