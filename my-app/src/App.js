import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Skills from './pages/Skills';
import SkillForm from './pages/SkillForm';
import Exchanges from './pages/Exchanges';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/skills/new" element={
            <ProtectedRoute><SkillForm /></ProtectedRoute>
          } />
          <Route path="/skills/:id/edit" element={
            <ProtectedRoute><SkillForm /></ProtectedRoute>
          } />
          <Route path="/exchanges" element={
            <ProtectedRoute><Exchanges /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;