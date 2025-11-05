// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  name: string;
  email: string;
  phone?: string;
  allergies?: string[];
  medicalHistory?: string[];
  preferences?: string[];
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'health' | 'appointments'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/');
  };

  const updateUser = (updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates } as User;
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const addAllergy = (allergy: string) => {
    if (allergy.trim() && !user?.allergies?.includes(allergy)) {
      updateUser({
        allergies: [...(user?.allergies || []), allergy.trim()]
      });
    }
  };

  const removeAllergy = (allergy: string) => {
    updateUser({
      allergies: user?.allergies?.filter(a => a !== allergy) || []
    });
  };

  const addMedicalHistory = (condition: string) => {
    if (condition.trim() && !user?.medicalHistory?.includes(condition)) {
      updateUser({
        medicalHistory: [...(user?.medicalHistory || []), condition.trim()]
      });
    }
  };

  const removeMedicalHistory = (condition: string) => {
    updateUser({
      medicalHistory: user?.medicalHistory?.filter(m => m !== condition) || []
    });
  };

  if (!user) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h1 className="page-title">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 className="page-title">My Profile</h1>
            <p className="page-subtitle" style={{ textAlign: 'left', marginBottom: 0 }}>
              Manage your health information and preferences
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#666666',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid #E0E0E0'
        }}>
          {[
            { id: 'profile', label: 'Personal Info', icon: '👤' },
            { id: 'health', label: 'Health Profile', icon: '❤️' },
            { id: 'appointments', label: 'Appointments', icon: '📅' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '1rem 0',
                background: 'transparent',
                color: activeTab === tab.id ? '#2E7D32' : '#666666',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? '#2E7D32' : 'transparent'}`,
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
            {/* Sidebar */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '4rem', 
                background: '#E8F5E8', 
                borderRadius: '50%', 
                width: '100px', 
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                👤
              </div>
              <h3 style={{ color: '#333333', marginBottom: '0.5rem' }}>{user.name}</h3>
              <p style={{ color: '#666666' }}>{user.email}</p>
              <button
                onClick={() => setIsEditing(!isEditing)}
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem 1.5rem',
                  background: isEditing ? '#666666' : '#2E7D32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </button>
            </div>

            {/* Profile Form */}
            <div>
              {isEditing ? (
                <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginBottom: '1.5rem', color: '#333333' }}>Edit Profile</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={user.name}
                        onChange={(e) => updateUser({ name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        onChange={(e) => updateUser({ email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333333', fontWeight: '500' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={user.phone || ''}
                        onChange={(e) => updateUser({ phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #E0E0E0',
                          borderRadius: '8px',
                          fontSize: '1rem'
                        }}
                        placeholder="Add phone number"
                      />
                    </div>
                    <button
                      onClick={() => setIsEditing(false)}
                      style={{
                        padding: '1rem 2rem',
                        background: '#2E7D32',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ marginBottom: '1.5rem', color: '#333333' }}>Personal Information</h3>
                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                      <strong style={{ color: '#666666' }}>Full Name:</strong>
                      <p style={{ color: '#333333', marginTop: '0.25rem' }}>{user.name}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#666666' }}>Email Address:</strong>
                      <p style={{ color: '#333333', marginTop: '0.25rem' }}>{user.email}</p>
                    </div>
                    <div>
                      <strong style={{ color: '#666666' }}>Phone Number:</strong>
                      <p style={{ color: '#333333', marginTop: '0.25rem' }}>
                        {user.phone || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <strong style={{ color: '#666666' }}>Member Since:</strong>
                      <p style={{ color: '#333333', marginTop: '0.25rem' }}>January 2024</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Allergies */}
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333333', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🤧</span> Allergies
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Add an allergy (e.g., Pollen, Penicillin)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addAllergy((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    marginBottom: '1rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user.allergies?.map((allergy, index) => (
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
                      onClick={() => removeAllergy(allergy)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#C62828',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(!user.allergies || user.allergies.length === 0) && (
                  <p style={{ color: '#666666', fontStyle: 'italic' }}>No allergies recorded</p>
                )}
              </div>
            </div>

            {/* Medical History */}
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333333', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🏥</span> Medical History
              </h3>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Add a condition (e.g., Diabetes, Hypertension)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addMedicalHistory((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #E0E0E0',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    marginBottom: '1rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {user.medicalHistory?.map((condition, index) => (
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
                      onClick={() => removeMedicalHistory(condition)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#1565C0',
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {(!user.medicalHistory || user.medicalHistory.length === 0) && (
                  <p style={{ color: '#666666', fontStyle: 'italic' }}>No medical conditions recorded</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333333' }}>My Appointments</h3>
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666666' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
              <h4>No appointments yet</h4>
              <p style={{ marginBottom: '2rem' }}>Book your first consultation with our herbal doctors</p>
              <button
                onClick={() => navigate('/consultation')}
                style={{
                  padding: '1rem 2rem',
                  background: '#2E7D32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Book Consultation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;