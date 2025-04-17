
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatPopup from './ChatPopup';
import { useAuth } from '@/contexts/AuthContext';

interface MainLayoutProps {
  children: React.ReactNode;
  hideEditProfile?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, hideEditProfile = false }) => {
  const { isLoggedIn } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      {isLoggedIn && <ChatPopup />}
    </div>
  );
};

export default MainLayout;
