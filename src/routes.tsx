
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Lazy-loaded components
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Signup = lazy(() => import("@/pages/Signup"));
const ProfessionalSignup = lazy(() => import("@/pages/ProfessionalSignup"));
const InstitutionSignup = lazy(() => import("@/pages/InstitutionSignup"));
const Login = lazy(() => import("@/pages/Login"));
const ProfessionalDashboard = lazy(() => import("@/pages/ProfessionalDashboard"));
const InstitutionDashboard = lazy(() => import("@/pages/InstitutionDashboard"));
const SolviaLearning = lazy(() => import("@/pages/SolviaLearning"));
const Professionals = lazy(() => import("@/pages/Professionals"));
const Institutions = lazy(() => import("@/pages/Institutions"));
const Vacancies = lazy(() => import("@/pages/Vacancies"));
const VacancyDetail = lazy(() => import("@/pages/VacancyDetail"));
const Messages = lazy(() => import("@/pages/Messages"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/professional" element={<ProfessionalSignup />} />
        <Route path="/signup/institution" element={<InstitutionSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/learning" element={<SolviaLearning />} />
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/institutions" element={<Institutions />} />
        <Route path="/vacancies" element={<Vacancies />} />
        <Route path="/vacancies/:id" element={<VacancyDetail />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard/professional"
          element={
            <ProtectedRoute requiredUserType="professional">
              <ProfessionalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/institution"
          element={
            <ProtectedRoute requiredUserType="institution">
              <InstitutionDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Messages routes */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/new"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages/:id"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        
        {/* Fallback routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
