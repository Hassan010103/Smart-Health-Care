
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { LogoIcon } from '../IconComponents';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white dark:bg-slate-900 shadow-sm z-10 flex-shrink-0">
          <div className="container mx-auto px-6 py-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <LogoIcon className="h-8 w-8 text-primary" />
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-slate-100">Admin Panel</h1>
                </div>
                 <Link to="/" className="text-sm font-medium text-primary dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300">
                    &larr; Back to Main Site
                </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-950">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;