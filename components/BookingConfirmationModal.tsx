
import React from 'react';
import { Doctor } from '../types';
import { LogoIcon, XMarkIcon } from './IconComponents';

interface BookingConfirmationModalProps {
  doctor: Doctor;
  slot: { day: string; time: string };
  onClose: () => void;
  onConfirm: () => void;
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ doctor, slot, onClose, onConfirm }) => {
  // A simple way to get a more descriptive date for the demo
  const getFullDate = (day: string) => {
    const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(day);
    const today = new Date();
    const resultDate = new Date();
    resultDate.setDate(today.getDate() + (dayIndex + 7 - today.getDay()) % 7);
    return resultDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 p-6 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start">
            <div className="flex flex-col items-start">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Confirm Booking</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Please review your appointment details.</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
              <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="mt-6 border-t border-b border-slate-200 dark:border-slate-700 py-4 space-y-3">
            <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500 dark:text-slate-400">Doctor:</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{doctor.name}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500 dark:text-slate-400">Specialty:</span>
                <span className="text-slate-700 dark:text-slate-300">{doctor.specialty}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500 dark:text-slate-400">Date:</span>
                <span className="text-slate-700 dark:text-slate-300">{getFullDate(slot.day)}</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="font-medium text-slate-500 dark:text-slate-400">Time:</span>
                <span className="text-slate-700 dark:text-slate-300">{slot.time}</span>
            </div>
        </div>
          
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;
