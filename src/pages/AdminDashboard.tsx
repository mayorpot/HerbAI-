// src/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { realtimeService } from '../services/realtimeService';

interface SystemStats {
  totalUsers: number;
  totalFeedback: number;
  averageRating: number;
  helpfulPercentage: number;
  topSymptoms: [string, number][];
  topRemedies: [string, number][];
  ratingDistribution?: {
    [key: number]: number;
  };
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  lastLogin: string;
  role?: string;
  status?: string;
}

const AdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'feedback' | 'herbs'>('overview');
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [realtimeUpdates, setRealtimeUpdates] = useState<any[]>([]);

  useEffect(() => {
    fetchSystemStats();
    
    // Real-time functionality
    realtimeService.connect();
    
    const handleNewFeedback = (feedback: any) => {
      // Update stats in real-time
      fetchSystemStats();
      
      // Show notification
      setRealtimeUpdates(prev => [
        ...prev.slice(-4), // Keep only last 5 updates
        { type: 'feedback', message: `New feedback received: ${feedback.rating}⭐`, timestamp: new Date() }
      ]);
    };

    const handleUserActivity = (activity: any) => {
      console.log('User activity:', activity);
      setRealtimeUpdates(prev => [
        ...prev.slice(-4),
        { type: 'user', message: `User activity: ${activity.type}`, timestamp: new Date() }
      ]);
    };

    realtimeService.on('newFeedback', handleNewFeedback);
    realtimeService.on('userActivity', handleUserActivity);

    // Simulate some real-time data for demo
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        realtimeService.simulateNewFeedback();
      }
      if (Math.random() > 0.8) {
        realtimeService.simulateUserActivity();
      }
    }, 10000);

    return () => {
      realtimeService.off('newFeedback', handleNewFeedback);
      realtimeService.off('userActivity', handleUserActivity);
      realtimeService.disconnect();
      clearInterval(interval);
    };
  }, []);

  const fetchSystemStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/feedback/system-stats');
      const data = await response.json();
      
      if (data.status === 'success') {
        setSystemStats(data.data.systemStats);
      }
    } catch (error) {
      console.error('Error fetching system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // This would be a real endpoint in production
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          createdAt: '2024-01-15',
          lastLogin: '2024-01-20',
          role: 'user',
          status: 'active'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          createdAt: '2024-01-10',
          lastLogin: '2024-01-19',
          role: 'admin',
          status: 'active'
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob@example.com',
          createdAt: '2024-01-05',
          lastLogin: '2024-01-18',
          role: 'user',
          status: 'suspended'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleUserAction = async (userId: string, action: string) => {
    // Implement user actions (suspend, delete, etc.)
    console.log(`Performing ${action} on user ${userId}`);
  };

  const handleHerbAction = async (herbName: string, action: string) => {
    // Implement herb actions (edit, delete, etc.)
    console.log(`Performing ${action} on herb ${herbName}`);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <h1>Loading Admin Dashboard...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header with real-time updates */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 className="page-title">Admin Dashboard</h1>
              <p className="page-subtitle">Manage ALBA system and monitor user activity</p>
            </div>
            
            {/* Real-time updates panel */}
            {realtimeUpdates.length > 0 && (
              <div style={{
                background: '#f8f9fa',
                padding: '0.75rem',
                borderRadius: '8px',
                maxWidth: '300px'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#666' }}>
                  Recent Activity
                </h4>
                {realtimeUpdates.slice(-3).map((update, index) => (
                  <div key={index} style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    padding: '0.25rem 0',
                    borderBottom: index < realtimeUpdates.slice(-3).length - 1 ? '1px solid #eee' : 'none'
                  }}>
                    {update.message}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          marginBottom: '2rem',
          borderBottom: '1px solid #E0E0E0'
        }}>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'users', label: 'Users', icon: '👥' },
            { id: 'feedback', label: 'Feedback', icon: '💬' },
            { id: 'herbs', label: 'Herbs', icon: '🌿' }
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

        {/* Overview Tab */}
        {activeTab === 'overview' && systemStats && (
          <div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👥</div>
                <h3 style={{ color: '#333333', marginBottom: '0.5rem' }}>Total Users</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E7D32' }}>
                  {systemStats.totalUsers || 2}
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                <h3 style={{ color: '#333333', marginBottom: '0.5rem' }}>Total Feedback</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E7D32' }}>
                  {systemStats.totalFeedback}
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⭐</div>
                <h3 style={{ color: '#333333', marginBottom: '0.5rem' }}>Average Rating</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E7D32' }}>
                  {systemStats.averageRating}/5
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👍</div>
                <h3 style={{ color: '#333333', marginBottom: '0.5rem' }}>Helpful Rate</h3>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2E7D32' }}>
                  {systemStats.helpfulPercentage}%
                </div>
              </div>
            </div>

            {/* Top Symptoms and Remedies */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '2rem' 
            }}>
              <div style={{
                background: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#333333', marginBottom: '1rem' }}>Top Symptoms</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {systemStats.topSymptoms.map(([symptom, count], index) => (
                    <div key={symptom} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: '#F8F9FA',
                      borderRadius: '8px'
                    }}>
                      <span style={{ color: '#333333' }}>
                        {index + 1}. {symptom}
                      </span>
                      <span style={{ 
                        background: '#2E7D32', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem'
                      }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{
                background: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ color: '#333333', marginBottom: '1rem' }}>Top Remedies</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {systemStats.topRemedies.map(([remedy, count], index) => (
                    <div key={remedy} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: '#F8F9FA',
                      borderRadius: '8px'
                    }}>
                      <span style={{ color: '#333333' }}>
                        {index + 1}. {remedy}
                      </span>
                      <span style={{ 
                        background: '#2E7D32', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem'
                      }}>
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{
            background: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333333', marginBottom: '1rem' }}>User Management</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E0E0E0' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666666' }}>User</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666666' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666666' }}>Role</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666666' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666666' }}>Joined</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666666' }}>Last Login</th>
                    <th style={{ padding: '1rem', textAlign: 'left', color: '#666666' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '1rem' }}>{user.name}</td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: user.role === 'admin' ? '#2E7D32' : '#666666',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem'
                        }}>
                          {user.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          background: user.status === 'active' ? '#4CAF50' : user.status === 'suspended' ? '#FF9800' : '#f44336',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '0.75rem'
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>{new Date(user.lastLogin).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => handleUserAction(user.id, 'edit')}
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'transparent',
                              color: '#2E7D32',
                              border: '1px solid #2E7D32',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUserAction(user.id, 'view')}
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'transparent',
                              color: '#666666',
                              border: '1px solid #E0E0E0',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && systemStats && (
          <div style={{
            background: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#333333', marginBottom: '1rem' }}>Feedback Analytics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ color: '#666666', marginBottom: '1rem' }}>Rating Distribution</h4>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = systemStats.ratingDistribution?.[rating] || 0;
                  const percentage = systemStats.totalFeedback > 0 
                    ? (count / systemStats.totalFeedback * 100).toFixed(1) 
                    : '0';
                  
                  return (
                    <div key={rating} style={{ marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#333333' }}>
                          {'⭐'.repeat(rating)} ({rating})
                        </span>
                        <span style={{ color: '#666666', fontSize: '0.875rem' }}>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '8px',
                        background: '#F0F0F0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: '#2E7D32',
                          borderRadius: '4px'
                        }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div>
                <h4 style={{ color: '#666666', marginBottom: '1rem' }}>Feedback Insights</h4>
                <div style={{ 
                  background: '#E8F5E8', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <strong>Most Common Concern:</strong> {systemStats.topSymptoms[0]?.[0] || 'Stress and Anxiety'}
                </div>
                <div style={{ 
                  background: '#E3F2FD', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <strong>Top Recommended Herb:</strong> {systemStats.topRemedies[0]?.[0] || 'Chamomile'}
                </div>
                <div style={{ 
                  background: '#FFF3E0', 
                  padding: '1rem', 
                  borderRadius: '8px'
                }}>
                  <strong>User Satisfaction:</strong> {systemStats.averageRating}/5
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Herbs Tab */}
        {activeTab === 'herbs' && (
          <div style={{
            background: '#FFFFFF',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#333333' }}>Herb Database Management</h3>
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#2E7D32',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Add New Herb
              </button>
            </div>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1rem' 
            }}>
              {[
                { name: 'Ginger', count: '45 recommendations', status: 'Active' },
                { name: 'Chamomile', count: '38 recommendations', status: 'Active' },
                { name: 'Turmeric', count: '32 recommendations', status: 'Active' },
                { name: 'Lavender', count: '28 recommendations', status: 'Active' },
                { name: 'Peppermint', count: '25 recommendations', status: 'Active' },
                { name: 'Ashwagandha', count: '22 recommendations', status: 'Active' }
              ].map((herb, index) => (
                <div
                  key={index}
                  style={{
                    background: '#F8F9FA',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#333333', margin: 0 }}>{herb.name}</h4>
                    <span style={{
                      background: herb.status === 'Active' ? '#4CAF50' : '#FF9800',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem'
                    }}>
                      {herb.status}
                    </span>
                  </div>
                  <p style={{ color: '#666666', margin: '0 0 1rem 0', fontSize: '0.875rem' }}>
                    {herb.count}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleHerbAction(herb.name, 'edit')}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#2E7D32',
                        border: '1px solid #2E7D32',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleHerbAction(herb.name, 'stats')}
                      style={{
                        padding: '0.5rem 1rem',
                        background: 'transparent',
                        color: '#666666',
                        border: '1px solid #E0E0E0',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}
                    >
                      View Stats
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;