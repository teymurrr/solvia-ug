
import React, { useState } from 'react';
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
} from '@/components/ui/dropdown-menu';
import { Menu, X, User, Building, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app, this would come from your database
const hasUnreadMessages = true; // This would be dynamically determined

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, userType, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (userType === 'professional') return '/dashboard/professional';
    if (userType === 'institution') return '/dashboard/institution';
    return '/dashboard';
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <Logo />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/professionals"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Professionals
              </Link>
              <Link
                to="/institutions"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Institutions
              </Link>
              <Link
                to="/vacancies"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Vacancies
              </Link>
              <Link
                to="/learning"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Learning
              </Link>
              <Link
                to="/about"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-2">
            {isLoggedIn ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/messages" className="relative">
                    <Mail className="h-4 w-4 mr-2" />
                    Messages
                    {hasUnreadMessages && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                        1
                      </Badge>
                    )}
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      {userType === 'professional' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Building className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/messages">
                        Messages {hasUnreadMessages && <Badge className="ml-2 bg-red-500 text-white">1</Badge>}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
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

      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/professionals"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={toggleMobileMenu}
            >
              Professionals
            </Link>
            <Link
              to="/institutions"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={toggleMobileMenu}
            >
              Institutions
            </Link>
            <Link
              to="/vacancies"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={toggleMobileMenu}
            >
              Vacancies
            </Link>
            <Link
              to="/learning"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={toggleMobileMenu}
            >
              Learning
            </Link>
            <Link
              to="/about"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
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
