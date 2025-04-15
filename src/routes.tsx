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
  const { isLoggedIn, userType } = useAuth();
  
  // Debug
  console.log("Routes rendering with auth state:", { isLoggedIn, userType });
  
  return (
    <Routes>
      {/* Redirect to dashboard if user is logged in and accessing the home page */}
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
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/professional" element={<ProfessionalSignup />} />
      <Route path="/signup/institution" element={<InstitutionSignup />} />
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/institutions" element={<Institutions />} />
      <Route path="/vacancies" element={<Vacancies />} />
      <Route path="/vacancies/:id" element={<VacancyDetail />} />
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
          isLoggedIn ? (
            userType === 'professional' ? (
              <Navigate to="/dashboard/professional" replace />
            ) : (
              <Navigate to="/dashboard/institution" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      
      <Route path="*" element={<NotFound />} />
      
      {/* Add new auth route */}
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

export default AppRoutes;
