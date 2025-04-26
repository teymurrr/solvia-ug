
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import NavLinks from './navbar/NavLinks';
import UserDropdown from './navbar/UserDropdown';
import MobileMenu from './navbar/MobileMenu';
import { useToast } from '@/hooks/use-toast';

const hasUnreadMessages = false;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, userType, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during sign out:', error);
      // Show error toast to user
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const getDashboardLink = () => {
    if (userType === 'professional') {
      return '/dashboard/professional';
    } else if (userType === 'institution') {
      return '/dashboard/institution';
    }
    return '/';
  };

  return (
    <nav className={cn(
      "fixed w-full top-0 z-50 transition-all duration-300",
      scrolled ? "bg-white/80 backdrop-blur-sm shadow-sm" : "bg-white"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden sm:flex sm:items-end pb-4">
            <NavLinks isLoggedIn={isLoggedIn} userType={userType} />
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            {isLoggedIn ? (
              <UserDropdown 
                userType={userType} 
                hasUnreadMessages={hasUnreadMessages}
                onSignOut={handleSignOut}
              />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        isLoggedIn={isLoggedIn}
        userType={userType}
        hasUnreadMessages={hasUnreadMessages}
        getDashboardLink={getDashboardLink}
        onSignOut={handleSignOut}
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
