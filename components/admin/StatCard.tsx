
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClasses: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClasses }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${colorClasses}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;