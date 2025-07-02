import React from 'react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  // Defensive: fallback values for all fields
  const name = doctor?.name || 'Doctor';
  const specialty = doctor?.specialty || 'Specialist';
  const location = doctor?.location || 'Unknown location';
  const imageUrl = doctor?.imageUrl || '/default.png';
  const rating = typeof doctor?.rating === 'number' ? doctor.rating : undefined;
  // reviews can be a number or an array (backend/frontend mismatch), handle both
  let reviewsCount = 0;
  if (Array.isArray(doctor?.reviews)) {
    reviewsCount = doctor.reviews.length;
  } else if (typeof doctor?.reviews === 'number') {
    reviewsCount = doctor.reviews;
  }
  // Defensive: avoid .repeat on undefined
  const stars = rating ? '★'.repeat(Math.round(rating)) : '☆☆☆☆☆';
  const emptyStars = rating ? '☆'.repeat(5 - Math.round(rating)) : '';
  const ratingDisplay = rating !== undefined ? rating.toFixed(1) : 'N/A';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
      <img className="h-48 w-full object-cover" src={imageUrl} alt={`Dr. ${name}`} />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{name}</h3>
        <p className="text-primary dark:text-cyan-400 font-semibold mt-1">{specialty}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{location}</p>
        <div className="flex items-center mt-4">
          <div className="flex items-center text-yellow-500">
            {stars}{emptyStars}
          </div>
          <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">{ratingDisplay} ({reviewsCount} reviews)</span>
        </div>
        <div className="mt-auto pt-6">
          <div
            className="w-full block bg-cyan-100 text-primary dark:bg-slate-700 dark:text-cyan-400 font-semibold py-2 px-4 rounded-md hover:bg-cyan-200 dark:hover:bg-slate-600 transition-colors text-center cursor-pointer"
          >
            View Profile
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;