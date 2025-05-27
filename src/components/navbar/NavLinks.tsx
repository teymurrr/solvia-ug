
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface NavLinksProps {
  isLoggedIn: boolean;
  userType?: string;
}

const NavLinks: React.FC<NavLinksProps> = ({ isLoggedIn, userType }) => {
  const { t } = useLanguage();

  const navItems = [
    { name: t?.common?.vacancies || "Vacancies", href: "/vacancies" },
    { name: t?.common?.professionals || "Professionals", href: "/professionals" },
    { name: t?.common?.institutions || "Institutions", href: "/institutions" },
    { name: t?.common?.solviaLearning || "Solvia Learning", href: "/learning" },
    { name: t?.common?.wiki || "Wiki", href: "#", comingSoon: true },
    { name: t?.common?.about || "About", href: "/about" },
  ];

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      {navItems.map((item) => (
        <div key={item.name} className="relative">
          {item.comingSoon ? (
            <span className="text-gray-400 hover:text-gray-600 px-3 py-2 text-sm font-medium cursor-not-allowed">
              {item.name}
              <span className="absolute -top-1 -right-2 bg-purple-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {t?.common?.comingSoon || "Coming Soon"}
              </span>
            </span>
          ) : (
            <Link
              to={item.href}
              className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              {item.name}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavLinks;
