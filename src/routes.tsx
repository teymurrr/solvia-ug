
import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PaidAccessRoute from "@/components/PaidAccessRoute";
import AdminRoute from "@/components/AdminRoute";
import { useAuth } from "@/contexts/AuthContext";

// Simple loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Landing page components - import individually for better error handling
const Index = lazy(() => import("@/pages/Index"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Impressum = lazy(() => import("@/pages/Impressum"));
const EmployersLanding = lazy(() => import("@/pages/EmployersLanding"));
const Blog = lazy(() => import("@/pages/Blog"));
const VisaInfo = lazy(() => import("@/pages/VisaInfo"));

// Auth pages - import individually instead of bundling
const Signup = lazy(() => import("@/pages/Signup"));
const ProfessionalSignup = lazy(() => import("@/pages/ProfessionalSignup"));
const InstitutionSignup = lazy(() => import("@/pages/InstitutionSignup"));
const Login = lazy(() => import("@/pages/Login"));
const EmailConfirmationRequired = lazy(() => import("@/pages/EmailConfirmationRequired"));

// Dashboard pages
const ProfessionalDashboard = lazy(() => import("@/pages/ProfessionalDashboard"));
const InstitutionDashboard = lazy(() => import("@/pages/InstitutionDashboard"));


// Other pages - load individually as needed
const SolviaLearning = lazy(() => import("@/pages/SolviaLearning"));
const StarterKit = lazy(() => import("@/pages/StarterKit"));
const Professionals = lazy(() => import("@/pages/Professionals"));
const ProfessionalProfile = lazy(() => import("@/pages/ProfessionalProfile"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Vacancy related pages
const VacanciesConversion = lazy(() => import("@/pages/VacanciesConversion"));

// Messaging page
const Messages = lazy(() => import("@/pages/Messages"));

// Insights page
const Insights = lazy(() => import("@/pages/Insights"));

// Community pages
const Community = lazy(() => import("@/pages/Community"));
const CommunityPost = lazy(() => import("@/pages/CommunityPost"));

// Payment pages
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("@/pages/PaymentCancelled"));
const HomologationPayment = lazy(() => import("@/pages/HomologationPayment"));
const HomologationWizard = lazy(() => import("@/pages/HomologationWizard"));
const HomologationResult = lazy(() => import("@/pages/HomologationResult"));
const CountrySelection = lazy(() => import("@/pages/CountrySelection"));
const OnboardingWizard = lazy(() => import("@/pages/OnboardingWizard"));

// Document pages
const DocumentUpload = lazy(() => import("@/pages/DocumentUpload"));
const DocumentStatus = lazy(() => import("@/pages/DocumentStatus"));

// Admin pages
const AdminUserManagement = lazy(() => import("@/pages/admin/UserManagement"));
const AdminApplications = lazy(() => import("@/pages/admin/Applications"));

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
  const renderHomePage = () => {
    if (isLoggedIn) {
      if (userType === 'professional') {
        return <Navigate to="/dashboard/professional" replace />;
      } else if (userType === 'institution') {
        return <Navigate to="/dashboard/institution" replace />;
      }
    }
    // For non-logged-in users, show Index page as the main landing page
    return <Index />;
  };
  
  if (!isInitialized) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={renderHomePage()} />
        <Route path="/visa-info" element={<VisaInfo />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/employers" element={<EmployersLanding />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/:id" element={<CommunityPost />} />
        
        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/professional" element={<ProfessionalSignup />} />
        <Route path="/signup/institution" element={<InstitutionSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirm-email" element={<EmailConfirmationRequired />} />
        
        <Route path="/learning" element={<SolviaLearning />} />
        <Route path="/learning/starter-kit" element={<StarterKit />} />

        {/* Professionals routes */}
        <Route path="/professionals" element={<Professionals />} />
        <Route path="/professionals/:id" element={
          <ProtectedRoute userType="institution">
            <ProfessionalProfile />
          </ProtectedRoute>
        } />

        {/* Vacancy routes */}
        <Route path="/vacancies" element={<VacanciesConversion />} />

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
        
        {/* Payment routes */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        <Route path="/homologation-payment" element={<HomologationPayment />} />
        <Route path="/homologation-wizard" element={<HomologationWizard />} />
        <Route path="/homologation-result" element={<HomologationResult />} />
        <Route path="/homologation" element={<CountrySelection />} />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingWizard />
          </ProtectedRoute>
        } />
        <Route path="/documents-upload" element={
          <PaidAccessRoute>
            <DocumentUpload />
          </PaidAccessRoute>
        } />
        <Route path="/documents-status" element={
          <PaidAccessRoute>
            <DocumentStatus />
          </PaidAccessRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminUserManagement />
          </AdminRoute>
        } />
        <Route path="/admin/applications" element={
          <AdminRoute>
            <AdminApplications />
          </AdminRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
