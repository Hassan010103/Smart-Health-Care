
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Doctor } from '../types';
import DoctorCard from '../components/DoctorCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SkeletonDoctorCard = () => (
  <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg h-80 w-full" />
);

const FindDoctorPage: React.FC = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specialty, setSpecialty] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${API_BASE_URL}/doctors`)
            .then(res => res.ok ? res.json() : Promise.reject(res))
            .then(data => {
                setDoctors(data.map((doc: any) => ({ ...doc, id: doc._id || doc.id })));
                setLoading(false);
            })
            .catch(() => {
                setError('Unable to load doctors. The backend may be waking up. Please wait a few seconds and refresh.');
                setLoading(false);
            });
    }, []);

    const filteredDoctors = doctors.filter(doctor => 
        (specialty ? doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) : true) &&
        (location ? doctor.location.toLowerCase().includes(location.toLowerCase()) : true)
    );

    return (
        <div className="bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Find Your Doctor</h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Search for trusted specialists and book your appointment.</p>
                </div>
                {/* Filter Bar */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-12 sticky top-20 z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input 
                            type="text" 
                            placeholder="Specialty (e.g., Cardiology)"
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        />
                         <input 
                            type="text" 
                            placeholder="Location (e.g., Mumbai)"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-primary focus:border-primary bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                        />
                        <button className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-cyan-600 transition-colors">
                            Search
                        </button>
                    </div>
                </div>
                {/* Doctors Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <SkeletonDoctorCard key={i} />)
                    ) : error ? (
                        <p className="col-span-full text-center text-red-500 dark:text-red-400">{error}</p>
                    ) : filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => 
                            <Link key={doctor.id} to={`/doctor/${doctor.id}`} className="block">
                                <DoctorCard doctor={doctor} />
                            </Link>
                        )
                    ) : (
                        <p className="col-span-full text-center text-slate-500 dark:text-slate-400">No doctors found matching your criteria.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FindDoctorPage;