
import React from 'react';

const CheckCircleIcon = ({className} : {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
    </svg>
);


const PricingPage: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Flexible Plans for Your Health
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            Choose a plan that fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Plan 1: Pay-per-Consult */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 flex flex-col">
            <h3 className="text-lg font-semibold text-primary dark:text-cyan-400">Pay-per-Consult</h3>
            <p className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">₹800</p>
            <p className="text-slate-500 dark:text-slate-400">per consultation</p>
            <p className="mt-6 text-slate-600 dark:text-slate-300">Perfect for occasional medical needs and single consultations.</p>
            <ul className="mt-8 space-y-4 text-slate-600 dark:text-slate-300 flex-grow">
              <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> One video consultation</li>
              <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> 7-day chat follow-up</li>
              <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> Digital prescription</li>
            </ul>
            <button className="mt-8 w-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Choose Plan</button>
          </div>

          {/* Plan 2: Monthly Saver (Most Popular) */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-primary p-8 flex flex-col relative">
             <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full">Most Popular</div>
            <h3 className="text-lg font-semibold text-primary dark:text-cyan-400">Monthly Saver</h3>
            <p className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">₹2,500</p>
            <p className="text-slate-500 dark:text-slate-400">per month</p>
            <p className="mt-6 text-slate-600 dark:text-slate-300">Ideal for families and individuals with ongoing health concerns.</p>
            <ul className="mt-8 space-y-4 text-slate-600 dark:text-slate-300 flex-grow">
              <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> Unlimited consultations for 1 person</li>
              <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> 24/7 chat support</li>
              <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> Access to all specialists</li>
              <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> 10% off on lab tests</li>
            </ul>
            <button className="mt-8 w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-cyan-600 transition-colors">Choose Plan</button>
          </div>

          {/* Plan 3: Annual Care */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 flex flex-col">
            <h3 className="text-lg font-semibold text-primary dark:text-cyan-400">Annual Care</h3>
            <p className="mt-4 text-4xl font-bold text-slate-900 dark:text-white">₹20,000</p>
            <p className="text-slate-500 dark:text-slate-400">per year</p>
            <p className="mt-6 text-slate-600 dark:text-slate-300">The best value for complete peace of mind for your entire family.</p>
            <ul className="mt-8 space-y-4 text-slate-600 dark:text-slate-300 flex-grow">
                <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> Unlimited consultations for family (up to 4)</li>
                <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> All Monthly Saver benefits</li>
                <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> One free annual health check-up</li>
                <li className="flex items-start"><CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" /> Priority support</li>
            </ul>
            <button className="mt-8 w-full bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 font-semibold py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Choose Plan</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;