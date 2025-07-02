
import React from 'react';
import { Link } from 'react-router-dom';
import SymptomChecker from '../components/SymptomChecker';
import { StethoscopeIcon, LeafIcon, CalendarIcon } from '../components/IconComponents';

const FeatureCard = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm">{children}</p>
    </div>
);

const HomePage: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-slate-900 pt-20 pb-24 sm:pt-28 sm:pb-32 lg:pt-32 lg:pb-40">
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-cyan-100/30 to-white dark:from-cyan-900/20 dark:to-slate-900"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="max-w-3xl mx-auto text-center">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      Your Health, <span className="text-primary">On Your Time.</span>
                  </h1>
                  <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                      Access certified doctors from top hospitals, get e-prescriptions, and explore traditional Indian wellness practices from the comfort of your home.
                  </p>
                  <div className="mt-8 flex justify-center gap-4">
                      <Link to="/find-doctor" className="inline-block bg-primary text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-cyan-600 transition-colors transform hover:scale-105">
                          Find a Doctor Now
                      </Link>
                      <Link to="/treatments" className="inline-block bg-white text-slate-700 font-semibold px-6 py-3 rounded-lg border border-slate-300 hover:border-slate-400 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:border-slate-700 dark:hover:border-slate-600 transition-colors">
                          Explore Wellness
                      </Link>
                  </div>
              </div>
          </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">A New Way to Care</h2>
                <p className="mt-4 text-md text-slate-600 dark:text-slate-400">Everything you need for your health, all in one place.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon={<StethoscopeIcon className="h-6 w-6" />} title="Online Consultations">
                  Connect with experienced doctors via secure video or chat. Get professional advice without leaving your home.
              </FeatureCard>
              <FeatureCard icon={<LeafIcon className="h-6 w-6" />} title="Holistic Wellness">
                  Explore our encyclopedia of Ayurvedic and natural remedies for a wide range of common ailments.
              </FeatureCard>
              <FeatureCard icon={<CalendarIcon className="h-6 w-6" />} title="Easy Appointments">
                  Search for specialists, view their availability, and book appointments that fit your schedule in minutes.
              </FeatureCard>
            </div>
        </div>
      </section>

      {/* Symptom Checker Section */}
      <section className="py-16 sm:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <SymptomChecker />
          </div>
        </div>
      </section>

       {/* Testimonial Section */}
      <section className="py-16 sm:py-24 bg-slate-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Trusted by Patients</h2>
                  <p className="mt-4 text-md text-slate-600 dark:text-slate-400">See what others are saying about our service.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 p-6 rounded-lg shadow dark:shadow-none">
                      <p className="text-slate-600 dark:text-slate-300 italic">"Booking a late-night consultation for my child was seamless. The doctor was very patient and understanding. A true lifesaver for parents!"</p>
                      <p className="mt-4 font-semibold text-slate-800 dark:text-slate-100">- Priya S.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 p-6 rounded-lg shadow dark:shadow-none">
                      <p className="text-slate-600 dark:text-slate-300 italic">"The AI checker helped me understand my symptoms better before my doctor's call. Very useful feature!"</p>
                      <p className="mt-4 font-semibold text-slate-800 dark:text-slate-100">- Amit K.</p>
                  </div>
                   <div className="bg-white dark:bg-slate-800 dark:border dark:border-slate-700 p-6 rounded-lg shadow dark:shadow-none">
                      <p className="text-slate-600 dark:text-slate-300 italic">"Finding a specialist took just a few minutes, and the wellness section has great info on Ayurvedic remedies."</p>
                      <p className="mt-4 font-semibold text-slate-800 dark:text-slate-100">- Sunita M.</p>
                  </div>
              </div>
          </div>
      </section>

    </div>
  );
};

export default HomePage;