
import React from 'react';
import { Link } from 'react-router-dom';
import { LogoIcon } from './IconComponents';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 dark:bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <LogoIcon className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-white">SmartHealth</span>
            </Link>
            <p className="text-sm text-slate-400 dark:text-slate-500">Your health, on your time. Quality care, just a click away.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 dark:text-slate-300 tracking-wider uppercase">Solutions</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/find-doctor" className="text-base text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">Find a Doctor</Link></li>
              <li><Link to="/treatments" className="text-base text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">Treatments</Link></li>
              <li><Link to="/dashboard" className="text-base text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">Appointments</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 dark:text-slate-300 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/pricing" className="text-base text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">Pricing</Link></li>
              <li><Link to="/faq" className="text-base text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">FAQ</Link></li>
              <li><Link to="/contact" className="text-base text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100 dark:text-slate-300 tracking-wider uppercase">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/privacy-policy" className="text-base text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-base text-slate-300 hover:text-white dark:text-slate-400 dark:hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center text-sm text-slate-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} Smart Health Care. All rights reserved.</p>
          <Link to="/admin" className="mt-4 sm:mt-0 text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-white transition-colors">Admin Panel</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
