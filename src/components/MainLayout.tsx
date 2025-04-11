
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
  hideEditProfile?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideEditProfile = false }) => {
  // The hideEditProfile prop will be passed to the dashboard components 
  // to control whether the Edit Profile button is displayed
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
