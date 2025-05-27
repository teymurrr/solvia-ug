
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, MessageSquare, User, LogOut, Settings } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  userType?: string;
  hasUnreadMessages: boolean;
  getDashboardLink: () => string;
  onSignOut: () => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  userType,
  hasUnreadMessages,
  getDashboardLink,
  onSignOut,
  onClose,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const navItems = [
    { name: t?.common?.vacancies || "Vacancies", href: "/vacancies" },
    { name: t?.common?.professionals || "Professionals", href: "/professionals" },
    { name: t?.common?.institutions || "Institutions", href: "/institutions" },
    { name: t?.common?.solviaLearning || "Solvia Learning", href: "/learning" },
    { name: t?.common?.wiki || "Wiki", href: "#", comingSoon: true },
    { name: t?.common?.about || "About", href: "/about" },
  ];

  return (
    <div className="sm:hidden">
      <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
        {navItems.map((item) => (
          <div key={item.name}>
            {item.comingSoon ? (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-gray-400 text-base font-medium cursor-not-allowed">
                  {item.name}
                </span>
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {t?.common?.comingSoon || "Coming Soon"}
                </span>
              </div>
            ) : (
              <Link
                to={item.href}
                className="text-gray-900 hover:text-blue-600 block px-3 py-2 text-base font-medium"
                onClick={onClose}
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          {isLoggedIn ? (
            <div className="space-y-1">
              <Link
                to={getDashboardLink()}
                className="flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
                onClick={onClose}
              >
                <User className="h-5 w-5 mr-3" />
                {t?.common?.dashboard || "Dashboard"}
              </Link>
              <Link
                to="/messages"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
                onClick={onClose}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                {t?.common?.messages || "Messages"}
                {hasUnreadMessages && (
                  <span className="ml-2 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
                onClick={onClose}
              >
                <Settings className="h-5 w-5 mr-3" />
                {t?.common?.settings || "Settings"}
              </Link>
              <button
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="flex items-center w-full text-left px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
              >
                <LogOut className="h-5 w-5 mr-3" />
                {t?.common?.logout || "Sign out"}
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
                onClick={onClose}
              >
                {t?.common?.login || "Log in"}
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800"
                onClick={onClose}
              >
                {t?.common?.freeSignup || "Free Sign Up"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
