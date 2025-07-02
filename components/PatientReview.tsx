import React from 'react';

interface PatientReviewProps {
  name: string;
  rating: number;
  comment: string;
  onLeaveReview?: () => void;
}

const PatientReview: React.FC<PatientReviewProps> = ({ name, rating, comment, onLeaveReview }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-2">
      <p className="font-semibold text-slate-800 dark:text-slate-200">{name}</p>
      <div className="flex items-center text-yellow-500">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </div>
    </div>
    <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{comment}"</p>
    {onLeaveReview && (
      <button onClick={onLeaveReview} className="mt-3 bg-primary text-white px-4 py-2 rounded-md font-semibold hover:bg-cyan-600 transition-colors">
        Leave a Review
      </button>
    )}
  </div>
);

export default PatientReview;