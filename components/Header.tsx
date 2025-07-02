
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { LogoIcon, SunIcon, MoonIcon } from './IconComponents';
import { AuthModalType, Theme } from '../types';

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout: () => void;
  onOpenModal: (type: AuthModalType) => void;
  onAdminLogin: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userName, onLogout, onOpenModal, onAdminLogin, theme, onToggleTheme }) => {
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-cyan-100 dark:hover:bg-slate-800 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors";
  const activeLinkClasses = "bg-cyan-100 text-cyan-700 dark:bg-slate-800 dark:text-cyan-400";

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm dark:shadow-none sticky top-0 z-40 border-b border-transparent dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <LogoIcon className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-slate-800 dark:text-white">SmartHealth</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeLinkClasses}` : navLinkClasses}>Home</NavLink>
            <NavLink to="/find-doctor" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeLinkClasses}` : navLinkClasses}>Find a Doctor</NavLink>
            <NavLink to="/treatments" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeLinkClasses}` : navLinkClasses}>Treatments</NavLink>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? `${navLinkClasses} ${activeLinkClasses}` : navLinkClasses}>Dashboard</NavLink>
          </nav>
          <div className="flex items-center space-x-3">
             <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-900"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
            </button>
            {isLoggedIn ? (
              <>
                <span className="text-sm text-slate-600 dark:text-slate-400 hidden sm:block">Welcome, {userName}</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white dark:text-cyan-400 dark:border-cyan-400 dark:hover:bg-cyan-400 dark:hover:text-slate-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={onAdminLogin} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-md hover:bg-slate-100 hover:text-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-colors">
                  Admin Login
                </button>
                <button onClick={() => onOpenModal('login')} className="hidden sm:block px-4 py-2 text-sm font-medium text-primary hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">
                  Log In
                </button>
                <button
                  onClick={() => onOpenModal('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-cyan-600 dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-900 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;