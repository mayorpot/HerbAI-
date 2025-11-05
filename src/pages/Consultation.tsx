// src/pages/Consultation.tsx
import React, { useState } from 'react';

const Consultation: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<'select' | 'form' | 'confirmation'>('select');
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    phone: '',
    symptoms: ''
  });

  const herbalDoctors = [
    {
      id: '1',
      name: 'Dr. Amina Chukwu',
      specialty: 'Traditional African Medicine',
      experience: '15 years',
      rating: '4.9',
      patients: '1200+',
      image: '👩‍⚕️',
      description: 'Specialist in West African herbal traditions and modern integrative approaches'
    },
    {
      id: '2',
      name: 'Dr. Raj Patel',
      specialty: 'Ayurvedic Medicine',
      experience: '12 years',
      rating: '4.8',
      patients: '950+',
      image: '👨‍⚕️',
      description: 'Expert in Ayurvedic principles and herbal formulations'
    },
    {
      id: '3',
      name: 'Dr. Maria Santos',
      specialty: 'Latin American Herbalism',
      experience: '10 years',
      rating: '4.7',
      patients: '800+',
      image: '👩‍⚕️',
      description: 'Knowledgeable in Amazonian and traditional Latin American remedies'
    },
    {
      id: '4',
      name: 'Dr. Chen Wei',
      specialty: 'Traditional Chinese Medicine',
      experience: '18 years',
      rating: '4.9',
      patients: '1500+',
      image: '👨‍⚕️',
      description: 'Master of TCM herbs and acupuncture integration'
    }
  ];

  const availableDates = [
    '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19'
  ];

  const availableTimes = [
    '09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'
  ];

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setBookingStep('form');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep('confirmation');
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetBooking = () => {
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setBookingStep('select');
    setBookingDetails({
      name: '',
      email: '',
      phone: '',
      symptoms: ''
    });
  };

  const getSelectedDoctor = () => {
    return herbalDoctors.find(doctor => doctor.id === selectedDoctor);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Book Consultation</h1>
      <p className="page-subtitle">
        Connect with certified herbal medicine practitioners
      </p>

      {bookingStep === 'select' && (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {herbalDoctors.map((doctor) => (
              <div
                key={doctor.id}
                style={{
                  background: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: '16px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
                  border: '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleDoctorSelect(doctor.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ fontSize: '3rem' }}>{doctor.image}</div>
                  <div>
                    <h3 style={{ color: '#2E7D32', marginBottom: '0.25rem' }}>{doctor.name}</h3>
                    <p style={{ color: '#666666', fontSize: '0.9rem' }}>{doctor.specialty}</p>
                  </div>
                </div>

                <p style={{ color: '#666666', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {doctor.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ color: '#666666', fontSize: '0.875rem' }}>
                      ⭐ {doctor.rating}
                    </span>
                    <span style={{ color: '#666666', fontSize: '0.875rem' }}>
                      👥 {doctor.patients}
                    </span>
                    <span style={{ color: '#666666', fontSize: '0.875rem' }}>
                      📅 {doctor.experience}
                    </span>
                  </div>
                  <button
                    style={{
                      background: '#2E7D32',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bookingStep === 'form' && selectedDoctor && (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ 
            background: '#F8F9FA', 
            padding: '2rem', 
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <h2 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Booking Appointment</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{getSelectedDoctor()?.image}</div>
              <div>
                <h3 style={{ marginBottom: '0.25rem' }}>{getSelectedDoctor()?.name}</h3>
                <p style={{ color: '#666666' }}>{getSelectedDoctor()?.specialty}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleBookingSubmit}>
            {/* Date Selection */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#333333' }}>Select Date</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {availableDates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    style={{
                      padding: '1rem',
                      border: `2px solid ${selectedDate === date ? '#2E7D32' : '#E0E0E0'}`,
                      borderRadius: '8px',
                      background: selectedDate === date ? '#2E7D3215' : '#FFFFFF',
                      color: selectedDate === date ? '#2E7D32' : '#333333',
                      cursor: 'pointer',
                      minWidth: '120px'
                    }}
                  >
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#333333' }}>Select Time</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      style={{
                        padding: '1rem',
                        border: `2px solid ${selectedTime === time ? '#2E7D32' : '#E0E0E0'}`,
                        borderRadius: '8px',
                        background: selectedTime === time ? '#2E7D3215' : '#FFFFFF',
                        color: selectedTime === time ? '#2E7D32' : '#333333',
                        cursor: 'pointer',
                        minWidth: '100px'
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Patient Information */}
            {selectedTime && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: '#333333' }}>Your Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={bookingDetails.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    style={{
                      padding: '1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={bookingDetails.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    style={{
                      padding: '1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={bookingDetails.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    style={{
                      padding: '1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem'
                    }}
                  />
                  <textarea
                    placeholder="Brief description of your symptoms or concerns..."
                    value={bookingDetails.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    rows={4}
                    style={{
                      padding: '1rem',
                      border: '2px solid #E0E0E0',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={() => setBookingStep('select')}
                style={{
                  padding: '1rem 2rem',
                  background: 'transparent',
                  color: '#666666',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Back to Doctors
              </button>
              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || !bookingDetails.name || !bookingDetails.email}
                style={{
                  padding: '1rem 2rem',
                  background: selectedDate && selectedTime && bookingDetails.name && bookingDetails.email ? '#2E7D32' : '#CCCCCC',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: selectedDate && selectedTime && bookingDetails.name && bookingDetails.email ? 'pointer' : 'not-allowed'
                }}
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {bookingStep === 'confirmation' && selectedDoctor && (
        <div style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ color: '#2E7D32', marginBottom: '1rem' }}>Appointment Booked!</h2>
          <div style={{ 
            background: '#F8F9FA', 
            padding: '2rem', 
            borderRadius: '12px',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#333333' }}>Appointment Details</h3>
            <p><strong>Doctor:</strong> {getSelectedDoctor()?.name}</p>
            <p><strong>Date:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Patient:</strong> {bookingDetails.name}</p>
            <p><strong>Email:</strong> {bookingDetails.email}</p>
          </div>
          <p style={{ color: '#666666', marginBottom: '2rem' }}>
            You will receive a confirmation email with video call details shortly.
          </p>
          <button
            onClick={resetBooking}
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
            Book Another Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default Consultation;