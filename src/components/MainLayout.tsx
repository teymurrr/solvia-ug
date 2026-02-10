
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import SupportChat from './SupportChat';
import WhatsAppButton from './WhatsAppButton';
import { Toaster } from './ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
  hideEditProfile?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideEditProfile }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden max-w-full">
      <Navbar />
      <main className="flex-grow pt-16 overflow-x-hidden max-w-full">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <SupportChat />
      <WhatsAppButton />
      <Toaster />
    </div>
  );
};

export default MainLayout;
