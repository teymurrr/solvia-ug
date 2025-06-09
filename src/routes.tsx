
import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import OwnerRoute from "@/components/OwnerRoute";
import { useAuth } from "@/contexts/AuthContext";
import { createLazyComponent } from "@/utils/lazyLoad";

// Optimized loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Critical route components - load immediately
const Index = lazy(() => import("@/pages/Index"));

// Auth pages - high priority
const authComponents = {
  Signup: createLazyComponent(() => import("@/pages/Signup")),
  ProfessionalSignup: createLazyComponent(() => import("@/pages/ProfessionalSignup")),
  InstitutionSignup: createLazyComponent(() => import("@/pages/InstitutionSignup")),
  Login: createLazyComponent(() => import("@/pages/Login")),
  EmailConfirmationRequired: createLazyComponent(() => import("@/pages/EmailConfirmationRequired")),
  AuthCallback: createLazyComponent(() => import("@/pages/AuthCallback"))
};

// Dashboard pages - medium priority
const dashboardComponents = {
  ProfessionalDashboard: createLazyComponent(() => import("@/pages/ProfessionalDashboard")),
  InstitutionDashboard: createLazyComponent(() => import("@/pages/InstitutionDashboard"))
};

// Landing pages - defer loading
const landingComponents = {
  About: createLazyComponent(() => import("@/pages/About"), 'h-96'),
  Contact: createLazyComponent(() => import("@/pages/Contact"), 'h-64'),
  Privacy: createLazyComponent(() => import("@/pages/Privacy"), 'h-96'),
  Terms: createLazyComponent(() => import("@/pages/Terms"), 'h-96'),
  EmployersLanding: createLazyComponent(() => import("@/pages/EmployersLanding"), 'h-96'),
  Blog: createLazyComponent(() => import("@/pages/Blog"), 'h-80'),
  BlogDetail: createLazyComponent(() => import("@/pages/BlogDetail"), 'h-96')
};

// Admin pages - lowest priority, load on demand
const adminComponents = {
  AdminBlogList: createLazyComponent(() => import("@/pages/admin/BlogList")),
  BlogEditor: createLazyComponent(() => import("@/pages/admin/BlogEditor")),
  AdminManagement: createLazyComponent(() => import("@/pages/admin/AdminManagement")),
  BlogStatistics: createLazyComponent(() => import("@/pages/admin/BlogStatistics"))
};

// Feature pages - defer loading
const featureComponents = {
  SolviaLearning: createLazyComponent(() => import("@/pages/SolviaLearning"), 'h-80'),
  Professionals: createLazyComponent(() => import("@/pages/Professionals"), 'h-80'),
  Institutions: createLazyComponent(() => import("@/pages/Institutions"), 'h-80'),
  Vacancies: createLazyComponent(() => import("@/pages/Vacancies"), 'h-80'),
  VacancyDetail: createLazyComponent(() => import("@/pages/VacancyDetail"), 'h-96'),
  VacancyApply: createLazyComponent(() => import("@/pages/VacancyApply"), 'h-64'),
  Messages: createLazyComponent(() => import("@/pages/Messages"), 'h-64'),
  Insights: createLazyComponent(() => import("@/pages/Insights"), 'h-80'),
  NotFound: createLazyComponent(() => import("@/pages/NotFound"), 'h-64')
};

const AppRoutes = () => {
  const { isLoggedIn, userType } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (isLoggedIn !== undefined) {
      setIsInitialized(true);
    }
  }, [isLoggedIn]);

  const renderIndex = () => {
    if (isLoggedIn) {
      if (userType === 'professional') {
        return <Navigate to="/dashboard/professional" replace />;
      } else if (userType === 'institution') {
        return <Navigate to="/dashboard/institution" replace />;
      }
    }
    return <Index />;
  };
  
  if (!isInitialized) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={renderIndex()} />
        
        {/* Landing pages */}
        <Route path="/about" element={<landingComponents.About />} />
        <Route path="/contact" element={<landingComponents.Contact />} />
        <Route path="/privacy" element={<landingComponents.Privacy />} />
        <Route path="/terms" element={<landingComponents.Terms />} />
        <Route path="/employers" element={<landingComponents.EmployersLanding />} />
        <Route path="/blog" element={<landingComponents.Blog />} />
        <Route path="/blog/:id" element={<landingComponents.BlogDetail />} />
        
        {/* Admin routes */}
        <Route path="/admin/blog" element={<AdminRoute><adminComponents.AdminBlogList /></AdminRoute>} />
        <Route path="/admin/blog/new" element={<AdminRoute><adminComponents.BlogEditor /></AdminRoute>} />
        <Route path="/admin/blog/edit/:id" element={<AdminRoute><adminComponents.BlogEditor /></AdminRoute>} />
        <Route path="/admin/manage-admins" element={<OwnerRoute><adminComponents.AdminManagement /></OwnerRoute>} />
        <Route path="/admin/blog/statistics" element={<AdminRoute><adminComponents.BlogStatistics /></AdminRoute>} />
        
        {/* Auth routes */}
        <Route path="/signup" element={<authComponents.Signup />} />
        <Route path="/signup/professional" element={<authComponents.ProfessionalSignup />} />
        <Route path="/signup/institution" element={<authComponents.InstitutionSignup />} />
        <Route path="/login" element={<authComponents.Login />} />
        <Route path="/confirm-email" element={<authComponents.EmailConfirmationRequired />} />
        <Route path="/auth/callback" element={<authComponents.AuthCallback />} />
        <Route path="/auth/*" element={<authComponents.AuthCallback />} />
        
        {/* Feature routes */}
        <Route path="/learning" element={<featureComponents.SolviaLearning />} />
        <Route path="/vacancies" element={<featureComponents.Vacancies />} />
        <Route path="/vacancies/:id" element={<featureComponents.VacancyDetail />} />
        <Route path="/vacancies/:id/apply" element={<ProtectedRoute userType="professional"><featureComponents.VacancyApply /></ProtectedRoute>} />
        
        {/* Protected routes */}
        <Route path="/insights" element={<ProtectedRoute userType="institution"><featureComponents.Insights /></ProtectedRoute>} />
        <Route path="/dashboard/professional" element={<ProtectedRoute userType="professional"><dashboardComponents.ProfessionalDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/institution" element={<ProtectedRoute userType="institution"><dashboardComponents.InstitutionDashboard /></ProtectedRoute>} />
        
        {/* Messages routes */}
        <Route path="/messages" element={<ProtectedRoute><featureComponents.Messages /></ProtectedRoute>} />
        <Route path="/messages/new" element={<ProtectedRoute><featureComponents.Messages /></ProtectedRoute>} />
        <Route path="/messages/:id" element={<ProtectedRoute><featureComponents.Messages /></ProtectedRoute>} />
        
        {/* Fallback route */}
        <Route path="*" element={<featureComponents.NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
