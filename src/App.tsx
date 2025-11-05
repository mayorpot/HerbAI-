// src/App.tsx - Updated with protected routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import Remedies from './pages/Remedies';
import Consultation from './pages/Consultation';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import HealthAssistant from './pages/HealthAssistant';
import HealthLibrary from './pages/HealthLibrary';
import HerbalStore from './pages/HerbalStore';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } />
              <Route path="/forgot-password" element={
                <ProtectedRoute requireAuth={false}>
                  <ForgotPassword />
                </ProtectedRoute>
              } />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/assistant" element={
                <ProtectedRoute>
                  <HealthAssistant />
                </ProtectedRoute>
              } />
              <Route path="/scanner" element={
                <ProtectedRoute>
                  <Scanner />
                </ProtectedRoute>
              } />
              <Route path="/remedies" element={
                <ProtectedRoute>
                  <Remedies />
                </ProtectedRoute>
              } />
              <Route path="/library" element={
                <ProtectedRoute>
                  <HealthLibrary />
                </ProtectedRoute>
              } />
              <Route path="/store" element={
                <ProtectedRoute>
                  <HerbalStore />
                </ProtectedRoute>
              } />
              <Route path="/consultation" element={
                <ProtectedRoute>
                  <Consultation />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;