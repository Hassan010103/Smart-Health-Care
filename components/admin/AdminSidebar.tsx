
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ChartPieIcon, StethoscopeIcon, LeafIcon, CurrencyRupeeIcon, ArrowUturnLeftIcon } from '../IconComponents';

const AdminSidebar: React.FC = () => {
    const baseLinkClasses = "flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200";
    const inactiveLinkClasses = "text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-800 hover:text-white dark:hover:text-white";
    const activeLinkClasses = "bg-primary text-white dark:bg-cyan-500 dark:text-slate-900 font-semibold";

    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => 
        `${baseLinkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`;

  return (
    <div className="w-64 bg-slate-800 dark:bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col">
      <div className="px-4 h-16 flex items-center border-b border-slate-700 dark:border-slate-800">
        <Link to="/admin" className="text-white text-xl font-bold">
          SmartHealth <span className="text-xs text-primary font-normal align-top">Admin</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-2">
        <NavLink to="/admin" end className={getNavLinkClass}>
            <ChartPieIcon className="h-5 w-5 mr-3" />
            Dashboard
        </NavLink>
        <NavLink to="/admin/doctors" className={getNavLinkClass}>
            <StethoscopeIcon className="h-5 w-5 mr-3" />
            Manage Doctors
        </NavLink>
        <NavLink to="/admin/treatments" className={getNavLinkClass}>
            <LeafIcon className="h-5 w-5 mr-3" />
            Manage Treatments
        </NavLink>
        <NavLink to="/admin/payments" className={getNavLinkClass}>
            <CurrencyRupeeIcon className="h-5 w-5 mr-3" />
            View Payments
        </NavLink>
      </nav>
      <div className="px-3 py-4 border-t border-slate-700 dark:border-slate-800">
         <Link to="/" className={`${baseLinkClasses} ${inactiveLinkClasses}`}>
            <ArrowUturnLeftIcon className="h-5 w-5 mr-3" />
            Exit to Site
         </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;