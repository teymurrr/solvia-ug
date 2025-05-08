
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

import Landing from '@/pages/Landing';
import About from '@/pages/About';
import Team from '@/pages/Team';
import Contact from '@/pages/Contact';
import InstitutionDashboard from '@/pages/InstitutionDashboard';
import InstitutionSignup from '@/pages/InstitutionSignup';
import InstitutionDirectory from '@/pages/InstitutionDirectory';
import ProfessionalDashboard from '@/pages/ProfessionalDashboard';
import ProfessionalSignup from '@/pages/ProfessionalSignup';
import ProfessionalDirectory from '@/pages/ProfessionalDirectory';
import ProfessionalProfile from '@/pages/ProfessionalProfile';
import Vacancies from '@/pages/Vacancies';
import VacancyDetail from '@/pages/VacancyDetail';
import VacancyApply from '@/pages/VacancyApply';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/providers/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/dashboard/institution" element={<InstitutionDashboard />} />
          <Route path="/signup/institution" element={<InstitutionSignup />} />
          <Route path="/institutions" element={<InstitutionDirectory />} />
          
          <Route path="/dashboard/professional" element={<ProfessionalDashboard />} />
          <Route path="/signup/professional" element={<ProfessionalSignup />} />
          <Route path="/professionals" element={<ProfessionalDirectory />} />
          <Route path="/professionals/:id" element={<ProfessionalProfile />} />
          
          <Route path="/vacancies" element={<Vacancies />} />
          <Route path="/vacancies/:id" element={<VacancyDetail />} />
          <Route path="/vacancies/:id/apply" element={<VacancyApply />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
