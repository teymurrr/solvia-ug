
import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import OwnerRoute from "@/components/OwnerRoute";
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
const EmployersLanding = lazy(() => import("@/pages/EmployersLanding"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogDetail = lazy(() => import("@/pages/BlogDetail"));
const ForDoctors = lazy(() => import("@/pages/ForDoctors"));

// Auth pages - import individually instead of bundling
const Signup = lazy(() => import("@/pages/Signup"));
const ProfessionalSignup = lazy(() => import("@/pages/ProfessionalSignup"));
const InstitutionSignup = lazy(() => import("@/pages/InstitutionSignup"));
const Login = lazy(() => import("@/pages/Login"));
const EmailConfirmationRequired = lazy(() => import("@/pages/EmailConfirmationRequired"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));

// Dashboard pages
const ProfessionalDashboard = lazy(() => import("@/pages/ProfessionalDashboard"));
const InstitutionDashboard = lazy(() => import("@/pages/InstitutionDashboard"));

// Admin pages - blog management
const AdminBlogList = lazy(() => import("@/pages/admin/BlogList"));
const BlogEditor = lazy(() => import("@/pages/admin/BlogEditor"));
const AdminManagement = lazy(() => import("@/pages/admin/AdminManagement"));

// Other pages - load individually as needed
const SolviaLearning = lazy(() => import("@/pages/SolviaLearning"));
const Professionals = lazy(() => import("@/pages/Professionals"));
const Institutions = lazy(() => import("@/pages/Institutions"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Vacancy related pages
const Vacancies = lazy(() => import("@/pages/Vacancies"));
const VacancyDetail = lazy(() => import("@/pages/VacancyDetail"));
const VacancyApply = lazy(() => import("@/pages/VacancyApply"));

// Messaging page
const Messages = lazy(() => import("@/pages/Messages"));

// Insights page
const Insights = lazy(() => import("@/pages/Insights"));

// Payment pages
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentCancelled = lazy(() => import("@/pages/PaymentCancelled"));
const HomologationPayment = lazy(() => import("@/pages/HomologationPayment"));

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
        <Route path="/home" element={<Index />} />
        <Route path="/for-doctors" element={<ForDoctors />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/employers" element={<EmployersLanding />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        
        {/* Admin blog management routes */}
        <Route
          path="/admin/blog"
          element={
            <AdminRoute>
              <AdminBlogList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blog/new"
          element={
            <AdminRoute>
              <BlogEditor />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blog/edit/:id"
          element={
            <AdminRoute>
              <BlogEditor />
            </AdminRoute>
          }
        />
        
        {/* Owner-only admin management route */}
        <Route
          path="/admin/manage-admins"
          element={
            <OwnerRoute>
              <AdminManagement />
            </OwnerRoute>
          }
        />
        
        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/professional" element={<ProfessionalSignup />} />
        <Route path="/signup/institution" element={<InstitutionSignup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/confirm-email" element={<EmailConfirmationRequired />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Make sure we have a wildcard handler for the auth paths */}
        <Route path="/auth/*" element={<AuthCallback />} />
        
        <Route path="/learning" element={<SolviaLearning />} />

        {/* Vacancy routes */}
        <Route path="/vacancies" element={<Vacancies />} />
        <Route path="/vacancies/:id" element={<VacancyDetail />} />
        <Route
          path="/vacancies/:id/apply"
          element={
            <ProtectedRoute userType="professional">
              <VacancyApply />
            </ProtectedRoute>
          }
        />

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
        
        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
