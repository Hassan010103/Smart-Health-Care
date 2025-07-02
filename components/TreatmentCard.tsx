
import React from 'react';
import { Treatment } from '../types';

interface TreatmentCardProps {
  treatment: Treatment;
}

const TreatmentCard: React.FC<TreatmentCardProps> = ({ treatment }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden group h-full flex flex-col">
      <div className="overflow-hidden">
        <img className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300" src={treatment.imageUrl} alt={treatment.name} />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <span className="text-xs font-semibold uppercase tracking-wider text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-900/50 px-2 py-1 rounded-full">{treatment.category}</span>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-3">{treatment.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex-grow">{treatment.description}</p>
        <div className="mt-4 text-primary dark:text-cyan-400 font-semibold group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">
          Learn More &rarr;
        </div>
      </div>
    </div>
  );
};

export default TreatmentCard;
