
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import { Toaster } from './ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
  hideEditProfile?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideEditProfile }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <Toaster />
    </div>
  );
};

export default MainLayout;
