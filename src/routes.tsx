import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

// Simple loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Group related components with improved code splitting
const landingPageComponents = {
  Index: lazy(() => import("@/pages/Index")),
  About: lazy(() => import("@/pages/About")),
  Contact: lazy(() => import("@/pages/Contact")),
  Privacy: lazy(() => import("@/pages/Privacy")),
  Terms: lazy(() => import("@/pages/Terms")),
  EmployersLanding: lazy(() => import("@/pages/EmployersLanding")),
};

// Auth pages bundle
const authPageComponents = {
  Signup: lazy(() => import("@/pages/Signup")),
  ProfessionalSignup: lazy(() => import("@/pages/ProfessionalSignup")),
  InstitutionSignup: lazy(() => import("@/pages/InstitutionSignup")),
  Login: lazy(() => import("@/pages/Login")),
};

// Dashboard pages bundle - load only when needed
const dashboardPageComponents = {
  ProfessionalDashboard: lazy(() => import("@/pages/ProfessionalDashboard")),
  InstitutionDashboard: lazy(() => import("@/pages/InstitutionDashboard")),
};

// Other pages - load individually as needed
const SolviaLearning = lazy(() => import("@/pages/SolviaLearning"));
const Professionals = lazy(() => import("@/pages/Professionals"));
const Institutions = lazy(() => import("@/pages/Institutions"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Vacancy related pages bundle
const vacancyPageComponents = {
  Vacancies: lazy(() => import("@/pages/Vacancies")),
  VacancyDetail: lazy(() => import("@/pages/VacancyDetail")),
};

// Messaging page - load only when needed
const Messages = lazy(() => import("@/pages/Messages"));

// Insights page - load only when needed
const Insights = lazy(() => import("@/pages/Insights"));

const AppRoutes = () => {
  const { isLoggedIn, userType } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Only render routes once auth state is determined
  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setIsInitialized(true);
    }
  }, [isLoggedIn]);

  // Redirect logged-in users to their respective dashboards
  const renderIndex = () => {
    if (isLoggedIn) {
      if (userType === 'professional') {
        return <Navigate to="/dashboard/professional" replace />;
      } else if (userType === 'institution') {
        return <Navigate to="/dashboard/institution" replace />;
      }
    }
    return <landingPageComponents.Index />;
  };
  
  if (!isInitialized) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={renderIndex()} />
        <Route path="/about" element={<landingPageComponents.About />} />
        <Route path="/contact" element={<landingPageComponents.Contact />} />
        <Route path="/privacy" element={<landingPageComponents.Privacy />} />
        <Route path="/terms" element={<landingPageComponents.Terms />} />
        <Route path="/employers" element={<landingPageComponents.EmployersLanding />} />
        
        {/* Auth routes - grouped for better code splitting */}
        <Route path="/signup" element={<authPageComponents.Signup />} />
        <Route path="/signup/professional" element={<authPageComponents.ProfessionalSignup />} />
        <Route path="/signup/institution" element={<authPageComponents.InstitutionSignup />} />
        <Route path="/login" element={<authPageComponents.Login />} />
        
        <Route path="/learning" element={<SolviaLearning />} />

        {/* Protected routes */}
        <Route
          path="/insights"
          element={
            <ProtectedRoute userType="institution">
              <Insights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/professional"
          element={
            <ProtectedRoute userType="professional">
              <dashboardPageComponents.ProfessionalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/institution"
          element={
            <ProtectedRoute userType="institution">
              <dashboardPageComponents.InstitutionDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Messages routes - only load if user navigates to them */}
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
