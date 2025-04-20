import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { 
  Building, 
  LogOut, 
  Mail, 
  Settings, 
  Languages, 
  LayoutDashboard, 
  BookOpen, 
  User,
  LineChart,
  Menu,
  X,
  Briefcase,
  GraduationCap,
  Newspaper,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { availableLanguages } from '@/data/languages';
import { cn } from '@/lib/utils';

const hasUnreadMessages = false; // This should be determined by your actual unread messages state

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, userType, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (userType === 'professional') {
      return '/dashboard/professional';
    } else if (userType === 'institution') {
      return '/dashboard/institution';
    }
    return '/';
  };

  const renderNavLinks = () => {
    if (!isLoggedIn) {
      return (
        <div className="flex justify-center space-x-8">
          <Link
            to="/professionals"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <User className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">For Talents</span>
          </Link>
          <Link
            to="/vacancies"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <Briefcase className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">Find Talents</span>
          </Link>
          <Link
            to="/learning"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <GraduationCap className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">Learning</span>
          </Link>
          <Link
            to="/insights"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <LineChart className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">Insights</span>
          </Link>
          <Link
            to="/blog"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <Newspaper className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">Blog</span>
          </Link>
          <Link
            to="/about"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <HelpCircle className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">About</span>
          </Link>
        </div>
      );
    }

    if (userType === 'professional') {
      return (
        <div className="flex justify-center space-x-8 flex-1">
          <Link
            to="/dashboard/professional"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <LayoutDashboard className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">Dashboard</span>
          </Link>
          <Link
            to="/learning"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <BookOpen className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">Solvia Learning</span>
          </Link>
        </div>
      );
    }

    if (userType === 'institution') {
      return (
        <div className="flex justify-center space-x-8 flex-1">
          <Link
            to="/dashboard/institution"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <LayoutDashboard className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">Dashboard</span>
          </Link>
          <Link
            to="/insights"
            className="flex flex-col items-center group"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <LineChart className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
            </div>
            <span className="text-sm text-gray-600 group-hover:text-gray-900">Solvia Insights</span>
          </Link>
        </div>
      );
    }
  };

  const renderUserDropdown = () => {
    if (!isLoggedIn) return null;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            {userType === 'professional' ? (
              <User className="h-4 w-4" />
            ) : (
              <Building className="h-4 w-4" />
            )}
            {hasUnreadMessages && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages className="h-4 w-4 mr-2" />
              <span>Language</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {availableLanguages.map((language) => (
                <DropdownMenuItem key={language}>
                  {language}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem asChild>
            <Link to="/messages">
              <Mail className="h-4 w-4 mr-2" />
              Messages
              {hasUnreadMessages && <Badge className="ml-2 bg-red-500 text-white">1</Badge>}
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link to="/settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
          
          <div className="hidden sm:flex sm:flex-1 justify-center items-end pb-4">
            {renderNavLinks()}
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            {isLoggedIn ? (
              renderUserDropdown()
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

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/professionals"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
                  onClick={toggleMobileMenu}
                >
                  <User className="h-5 w-5" />
                  <span>For Talents</span>
                </Link>
                <Link
                  to="/vacancies"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
                  onClick={toggleMobileMenu}
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Find Talents</span>
                </Link>
                <Link
                  to="/learning"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
                  onClick={toggleMobileMenu}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>Learning</span>
                </Link>
                <Link
                  to="/insights"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
                  onClick={toggleMobileMenu}
                >
                  <LineChart className="h-5 w-5" />
                  <span>Insights</span>
                </Link>
                <Link
                  to="/blog"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
                  onClick={toggleMobileMenu}
                >
                  <Newspaper className="h-5 w-5" />
                  <span>Blog</span>
                </Link>
                <Link
                  to="/about"
                  className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50"
                  onClick={toggleMobileMenu}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>About</span>
                </Link>
              </>
            ) : (
              userType === 'professional' ? (
                <>
                  <Link
                    to="/dashboard/professional"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/learning"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={toggleMobileMenu}
                  >
                    Solvia Learning
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard/institution"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={toggleMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/insights"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={toggleMobileMenu}
                  >
                    Solvia Insights
                  </Link>
                </>
              )
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {isLoggedIn ? (
              <div className="space-y-1">
                <Link
                  to={getDashboardLink()}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={toggleMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/messages"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 flex items-center"
                  onClick={toggleMobileMenu}
                >
                  Messages
                  {hasUnreadMessages && (
                    <Badge className="ml-2 bg-red-500 text-white">1</Badge>
                  )}
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleMobileMenu();
                  }}
                  className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-500 hover:bg-gray-50 hover:border-red-300"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={toggleMobileMenu}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                  onClick={toggleMobileMenu}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
