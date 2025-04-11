
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Settings, BookOpen, LayoutDashboard } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout, userType } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Navbar auth state:", { isLoggedIn, userType });
  }, [isLoggedIn, userType]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/');
  };

  const navigateToDashboard = () => {
    if (userType === 'professional') {
      navigate('/dashboard/professional');
    } else if (userType === 'institution') {
      navigate('/dashboard/institution');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="flex justify-between items-center">
          <Logo />
          
          <nav className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium hover:text-medical-600 transition-colors flex items-center gap-1"
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link 
                  to="/learning" 
                  className="text-sm font-medium hover:text-medical-600 transition-colors flex items-center gap-1"
                >
                  <BookOpen size={16} />
                  Solvia Learning
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-medium hover:text-medical-600 transition-colors">
                  Home
                </Link>
                <Link to="/professionals" className="text-sm font-medium hover:text-medical-600 transition-colors">
                  Professionals
                </Link>
                <Link to="/institutions" className="text-sm font-medium hover:text-medical-600 transition-colors">
                  Institutions
                </Link>
                <Link to="/about" className="text-sm font-medium hover:text-medical-600 transition-colors">
                  About Us
                </Link>
              </>
            )}
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex gap-2 items-center">
                    <User size={16} />
                    My Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={navigateToDashboard} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
          
          <button 
            className="md:hidden flex items-center"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="px-4 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <Link 
                  to="/learning" 
                  className="px-4 py-2 text-sm hover:bg-muted rounded-md flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <BookOpen size={16} />
                  Solvia Learning
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="px-4 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/professionals" 
                  className="px-4 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Professionals
                </Link>
                <Link 
                  to="/institutions" 
                  className="px-4 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Institutions
                </Link>
                <Link 
                  to="/about" 
                  className="px-4 py-2 text-sm hover:bg-muted rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
              </>
            )}
            <div className="flex flex-col gap-2 mt-2">
              {isLoggedIn ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigateToDashboard();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Settings size={16} />
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
