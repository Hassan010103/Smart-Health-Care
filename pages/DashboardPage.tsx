import React from 'react';
import { Appointment } from '../types';
import AppointmentCard from '../components/AppointmentCard';
import { Link } from 'react-router-dom';

interface DashboardPageProps {
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  appointments: Appointment[];
  onCancelAppointment?: (id: string) => void;
  payments?: any[];
  onRazorpayPay?: (appointment: Appointment, amount: number) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ isLoggedIn, onOpenLogin, appointments, onCancelAppointment, payments = [], onRazorpayPay }) => {

  if (!isLoggedIn) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Please Log In</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">You need to be logged in to view your dashboard and appointments.</p>
        <button 
          onClick={onOpenLogin} 
          className="mt-6 bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-600 transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  const upcomingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed');
  const pastAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">My Dashboard</h1>
        
        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b-2 border-primary dark:border-cyan-400">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {upcomingAppointments.map(app => {
                const payment = payments.find(p => String(p.appointment?._id || p.appointment?.id) === String(app.id));
                return (
                  <div key={app.id} className="relative">
                    <AppointmentCard 
                      appointment={app} 
                      paymentStatus={payment?.status}
                      onRazorpayPay={onRazorpayPay ? (appointment, amount) => onRazorpayPay(appointment, amount) : undefined}
                    />
                    {onCancelAppointment && (
                      <button
                        onClick={() => onCancelAppointment(String(app.id))}
                        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-semibold shadow"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <p className="text-slate-500 dark:text-slate-400">You have no upcoming appointments.</p>
                <Link to="/find-doctor" className="mt-4 inline-block text-primary dark:text-cyan-400 font-semibold hover:text-cyan-700">Book an appointment &rarr;</Link>
            </div>
          )}
        </div>
        
        {/* Past Appointments */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-4 pb-2 border-b-2 border-slate-300 dark:border-slate-700">Past Consultations</h2>
          {pastAppointments.length > 0 ? (
            <div className="space-y-4">
              {pastAppointments.map(app => <AppointmentCard key={app.id} appointment={app} />)}
            </div>
          ) : (
             <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                <p className="text-slate-500 dark:text-slate-400">You have no past consultations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
