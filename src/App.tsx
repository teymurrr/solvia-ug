
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

import Index from '@/pages/Index';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import InstitutionDashboard from '@/pages/InstitutionDashboard';
import InstitutionSignup from '@/pages/InstitutionSignup';
import ProfessionalDashboard from '@/pages/ProfessionalDashboard';
import ProfessionalSignup from '@/pages/ProfessionalSignup';
import Vacancies from '@/pages/Vacancies';
import VacancyDetail from '@/pages/VacancyDetail';
import VacancyApply from '@/pages/VacancyApply';
import { AuthProvider } from '@/contexts/AuthContext'; // Import from contexts not providers
import Professionals from '@/pages/Professionals';
import Institutions from '@/pages/Institutions';
import Login from '@/pages/Login';
import SolviaLearning from '@/pages/SolviaLearning';
import EmployersLanding from '@/pages/EmployersLanding';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Messages from '@/pages/Messages';
import AuthCallback from '@/pages/AuthCallback';
import EmailConfirmationRequired from '@/pages/EmailConfirmationRequired';
import Insights from '@/pages/Insights';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/employers" element={<EmployersLanding />} />
          
          {/* Auth routes */}
          <Route path="/signup" element={<ProfessionalSignup />} />
          <Route path="/signup/professional" element={<ProfessionalSignup />} />
          <Route path="/signup/institution" element={<InstitutionSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/confirm-email" element={<EmailConfirmationRequired />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/auth/*" element={<AuthCallback />} />
          
          {/* Main routes */}
          <Route path="/learning" element={<SolviaLearning />} />
          <Route path="/dashboard/institution" element={<InstitutionDashboard />} />
          <Route path="/institutions" element={<Institutions />} />
          <Route path="/dashboard/professional" element={<ProfessionalDashboard />} />
          <Route path="/professionals" element={<Professionals />} />
          
          {/* Vacancy routes */}
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
          <Route path="/vacancies/:id/apply" element={<VacancyApply />} />
          
          {/* Messages routes */}
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/new" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />
          
          {/* Insights route */}
          <Route path="/insights" element={<Insights />} />
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
