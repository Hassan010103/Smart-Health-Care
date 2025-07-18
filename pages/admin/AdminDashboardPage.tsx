
import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import { StethoscopeIcon, LeafIcon, UserGroupIcon, CurrencyRupeeIcon } from '../../components/IconComponents';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboardPage: React.FC = () => {
    const [doctorsCount, setDoctorsCount] = useState<number | null>(null);
    const [treatmentsCount, setTreatmentsCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        Promise.all([
            fetch(`${API_BASE_URL}/doctors`).then(res => res.ok ? res.json() : Promise.reject(res)),
            fetch(`${API_BASE_URL}/treatments`).then(res => res.ok ? res.json() : Promise.reject(res)),
        ])
        .then(([doctors, treatments]) => {
            setDoctorsCount(doctors.length);
            setTreatmentsCount(treatments.length);
            setLoading(false);
        })
        .catch(() => {
            setError('Unable to load dashboard stats. The backend may be waking up. Please wait and refresh.');
            setLoading(false);
        });
    }, []);

    // Mock data for demo purposes
    const totalPatients = "1,284";
    const totalRevenue = "\u20b948,50,000";

    if (loading) return <div className="text-center py-20">Loading dashboard stats...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Doctors" 
            value={doctorsCount ?? '-'} 
            icon={<StethoscopeIcon className="h-6 w-6 text-cyan-700 dark:text-cyan-400" />}
            colorClasses="bg-cyan-100 dark:bg-cyan-900/50"
        />
         <StatCard 
            title="Total Treatments" 
            value={treatmentsCount ?? '-'} 
            icon={<LeafIcon className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />}
            colorClasses="bg-emerald-100 dark:bg-emerald-900/50"
        />
         <StatCard 
            title="Total Patients" 
            value={totalPatients} 
            icon={<UserGroupIcon className="h-6 w-6 text-amber-700 dark:text-amber-400" />}
            colorClasses="bg-amber-100 dark:bg-amber-900/50"
        />
         <StatCard 
            title="Total Revenue" 
            value={totalRevenue} 
            icon={<CurrencyRupeeIcon className="h-6 w-6 text-rose-700 dark:text-rose-400" />}
            colorClasses="bg-rose-100 dark:bg-rose-900/50"
        />
      </div>
      
       <div className="mt-12 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Welcome, Admin!</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">From this panel, you can manage the core components of the SmartHealth platform. Use the sidebar to navigate between managing doctors, treatments, and viewing financial data. Any additions you make here will be reflected on the main site immediately.</p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;