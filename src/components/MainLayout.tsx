
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from './ui/toaster';

interface MainLayoutProps {
  children: React.ReactNode;
  hideEditProfile?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideEditProfile }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default MainLayout;
