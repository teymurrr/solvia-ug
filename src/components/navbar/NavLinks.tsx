
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Briefcase, HelpCircle, LayoutDashboard, BookOpen, BarChart } from 'lucide-react';

interface NavLinksProps {
  isLoggedIn: boolean;
  userType: string | null;
}

const NavLinks: React.FC<NavLinksProps> = ({ isLoggedIn, userType }) => {
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center space-x-8 flex-1">
        <Link
          to="/"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <User className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">For Talents</span>
        </Link>
        
        <Link
          to="/employers"
          className="flex flex-col items-center group"
        >
          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
            <Briefcase className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">For Employers</span>
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
            <BarChart className="h-5 w-5 text-gray-600 group-hover:text-gray-900" />
          </div>
          <span className="text-sm text-gray-600 group-hover:text-gray-900">Solvia Insights</span>
        </Link>
      </div>
    );
  }

  return null;
};

export default NavLinks;
