import React from 'react';
import { Link } from 'react-router-dom';
import { Appointment } from '../types';

interface AppointmentCardProps {
  appointment: Appointment;
  paymentStatus?: string;
  onRazorpayPay?: (appointment: Appointment, amount: number) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300',
  confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300',
};

const paymentColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-300',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/60 dark:text-red-300',
};

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, paymentStatus, onRazorpayPay }) => {
  const isUpcoming = appointment.status === 'pending' || appointment.status === 'confirmed';

  return (
    <div className="group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 flex items-center px-4 py-3 gap-4 md:gap-6 min-h-[72px] relative">
      {/* Main Info: Doctor, Specialty, Date, Time */}
      <div className="flex flex-col sm:flex-row sm:items-center flex-1 gap-1 sm:gap-4 min-w-0">
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-base text-slate-800 dark:text-slate-100 truncate">{appointment.doctorName}</span>
          <span className="text-xs text-primary dark:text-cyan-400 font-medium truncate">{appointment.specialty}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2 min-w-0">
          <span className="text-sm text-slate-700 dark:text-slate-200 font-medium truncate">{appointment.date}</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{appointment.time}</span>
        </div>
      </div>
      {/* Status & Payment Chips */}
      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
        <span className={`px-2 py-0.5 text-xs font-semibold uppercase rounded-full tracking-wide ${statusColors[appointment.status] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{appointment.status}</span>
        {paymentStatus && (
          <span className={`px-2 py-0.5 text-xs font-semibold uppercase rounded-full tracking-wide ${paymentColors[paymentStatus] || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200'}`}>{paymentStatus}</span>
        )}
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2 ml-2">
        {isUpcoming ? (
          <>
            <Link to={`/call/${appointment.id}`} className="bg-primary/90 hover:bg-primary text-white font-semibold py-1.5 px-4 rounded-md shadow transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-primary/40">
              Join Call
            </Link>
            {(!paymentStatus || paymentStatus === 'pending') && onRazorpayPay && (
              <button onClick={() => onRazorpayPay(appointment, appointment.amount || 1000)} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold py-1.5 px-4 rounded-md shadow transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-yellow-300/40">
                Pay Now
              </button>
            )}
          </>
        ) : (
          <Link to={`/consultation/${appointment.id}`} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-1.5 px-4 rounded-md shadow hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-slate-400/40">
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;