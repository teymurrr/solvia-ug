
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Index from '@/pages/Index';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ProfessionalSignup from '@/pages/ProfessionalSignup';
import InstitutionSignup from '@/pages/InstitutionSignup';
import ProfessionalDashboard from '@/pages/ProfessionalDashboard';
import InstitutionDashboard from '@/pages/InstitutionDashboard';
import Professionals from '@/pages/Professionals';
import Institutions from '@/pages/Institutions';
import Vacancies from '@/pages/Vacancies';
import VacancyDetail from '@/pages/VacancyDetail';
import SolviaLearning from '@/pages/SolviaLearning';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Auth from '@/pages/Auth';

export const AppRoutes = () => {
  const { isLoggedIn, userType, loading } = useAuth();
  
  // Debug
  console.log("Routes rendering with auth state:", { isLoggedIn, userType, loading });
  
  // If auth is still loading, show a simple loading indicator
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <Routes>
      {/* Home route - conditionally redirect based on auth state */}
      <Route 
        path="/" 
        element={
          isLoggedIn ? (
            userType === 'professional' ? (
              <Navigate to="/dashboard/professional" replace />
            ) : (
              <Navigate to="/dashboard/institution" replace />
            )
          ) : (
            <Index />
          )
        } 
      />
      <Route path="/about" element={<About />} />
      
      {/* Auth routes - redirect if already logged in */}
      <Route 
        path="/login" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Signup />} 
      />
      <Route 
        path="/signup/professional" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <ProfessionalSignup />} 
      />
      <Route 
        path="/signup/institution" 
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <InstitutionSignup />} 
      />
      
      {/* Public routes */}
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/institutions" element={<Institutions />} />
      <Route path="/vacancies" element={<Vacancies />} />
      <Route path="/vacancies/:id" element={<VacancyDetail />} />
      
      {/* Protected routes */}
      <Route 
        path="/learning" 
        element={
          <ProtectedRoute>
            <SolviaLearning />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/dashboard/professional" 
        element={
          <ProtectedRoute userType="professional">
            <ProfessionalDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/institution" 
        element={
          <ProtectedRoute userType="institution">
            <InstitutionDashboard />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect to appropriate dashboard if user is already logged in */}
      <Route 
        path="/dashboard" 
        element={
          !isLoggedIn ? (
            <Navigate to="/login" replace />
          ) : userType === 'professional' ? (
            <Navigate to="/dashboard/professional" replace />
          ) : (
            <Navigate to="/dashboard/institution" replace />
          )
        } 
      />
      
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
