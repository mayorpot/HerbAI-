// src/App.simple.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Scanner - Coming Soon</h1></div>} />
            <Route path="/remedies" element={<div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Remedies - Coming Soon</h1></div>} />
            <Route path="/consultation" element={<div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Consultation - Coming Soon</h1></div>} />
            <Route path="/profile" element={<div style={{padding: '100px 20px', textAlign: 'center'}}><h1>Profile - Coming Soon</h1></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;