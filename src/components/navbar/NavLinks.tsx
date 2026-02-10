
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, LayoutDashboard, Briefcase, Users, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface NavLinksProps {
  isLoggedIn: boolean;
  userType: string | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ isLoggedIn, userType }) => {
  const { t } = useLanguage();

  // Public navigation for non-logged-in visitors
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center space-x-8 flex-1">
        <Link
          to="/vacancies"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <Briefcase className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground">{t?.common?.vacancies || "Vacancies"}</span>
        </Link>
        <Link
          to="/community"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground">{(t as any)?.community?.title || "Community"}</span>
        </Link>
        <Link
          to="/employers"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <Users className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground">{t?.common?.forEmployers || "For Employers"}</span>
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
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <LayoutDashboard className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground">{t?.common?.dashboard || "Dashboard"}</span>
        </Link>
        <Link
          to="/community"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <MessageSquare className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground">{(t as any)?.community?.title || "Community"}</span>
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
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <LayoutDashboard className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground">{t?.common?.dashboard || "Dashboard"}</span>
        </Link>

        <Link
          to="/insights"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-muted transition-colors">
            <BarChart className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground">{t?.insights?.title || "Solvia Insights"}</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default NavLinks;
