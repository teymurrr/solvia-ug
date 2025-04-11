
import React from 'react';
import { Route, Routes } from 'react-router-dom';
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
import ProtectedRoute from '@/components/ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup/professional" element={<ProfessionalSignup />} />
      <Route path="/signup/institution" element={<InstitutionSignup />} />
      <Route path="/professionals" element={<Professionals />} />
      <Route path="/institutions" element={<Institutions />} />
      <Route path="/vacancies" element={<Vacancies />} />
      <Route 
        path="/dashboard/professional" 
        element={
          <ProtectedRoute>
            <ProfessionalDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard/institution" 
        element={
          <ProtectedRoute>
            <InstitutionDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
