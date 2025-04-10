
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfessionalSignup from "./pages/ProfessionalSignup";
import InstitutionSignup from "./pages/InstitutionSignup";
import Professionals from "./pages/Professionals";
import Institutions from "./pages/Institutions";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import InstitutionDashboard from "./pages/InstitutionDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/professional" element={<ProfessionalSignup />} />
            <Route path="/signup/institution" element={<InstitutionSignup />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/institutions" element={<Institutions />} />
            <Route path="/about" element={<About />} />
            
            {/* Protected routes */}
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
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
