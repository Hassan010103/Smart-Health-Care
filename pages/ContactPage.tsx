
import React from 'react';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '../components/IconComponents';

const ContactPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Get in Touch
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400">
            We'd love to hear from you. Whether you have a question about our services, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-xl border border-slate-200 dark:border-slate-700">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                <input type="text" id="name" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input type="email" id="email" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                <textarea id="message" rows={4} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-cyan-600 transition-colors">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Contact Details */}
          <div className="space-y-8">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Contact Information</h2>
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/50 rounded-lg text-primary">
                    <MapPinIcon className="h-6 w-6"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Our Office</h3>
                    <p className="text-slate-600 dark:text-slate-400">123 Health St, Med-Tech Park, Bengaluru, KA 560001</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/50 rounded-lg text-primary">
                    <PhoneIcon className="h-6 w-6"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Phone</h3>
                    <p className="text-slate-600 dark:text-slate-400">(+91) 80-4000-5000</p>
                </div>
             </div>
             <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-cyan-100 dark:bg-cyan-900/50 rounded-lg text-primary">
                    <EnvelopeIcon className="h-6 w-6"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Email</h3>
                    <p className="text-slate-600 dark:text-slate-400">support@smarthealth.co.in</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
