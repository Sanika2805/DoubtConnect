import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AskDoubt from './pages/AskDoubt';
import Questions from './pages/Questions';
import QuestionDetail from './pages/QuestionDetail';
import MyDoubts from './pages/MyDoubts';
import Profile from './pages/Profile';

// Wraps a page with the login check + sidebar layout.
function Private({ children }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Navigate to="/register" replace />} />

      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/questions" element={<Private><Questions /></Private>} />
      <Route path="/questions/:id" element={<Private><QuestionDetail /></Private>} />
      <Route path="/my-doubts" element={<Private><MyDoubts /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />

      {/* Ask Doubt keeps its own full-page design */}
      <Route path="/ask" element={<ProtectedRoute><AskDoubt /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
