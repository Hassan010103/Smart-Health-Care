import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Treatment } from '../types';
import { CheckBadgeIcon, BookOpenIcon, ExclamationTriangleIcon } from '../components/IconComponents';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TreatmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/treatments/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Treatment not found');
        return res.json();
      })
      .then(data => {
        setTreatment({ ...data, id: data._id || data.id });
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load treatment');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex justify-center items-center min-h-[40vh] text-lg">Loading treatment details...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[40vh] text-red-500">{error}</div>;
  if (!treatment) {
    return <Navigate to="/treatments" replace />;
  }

  const bannerImageUrl = `https://placehold.co/1200x400/0e7490/white?text=${encodeURIComponent(treatment.name)}`;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-full">
        {/* Banner Image */}
        <div className="h-64 md:h-80 w-full overflow-hidden relative">
            <img src={bannerImageUrl} alt={treatment.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
                <span className="text-sm font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-900/50 px-3 py-1 rounded-full">{treatment.category}</span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 shadow-text">{treatment.name}</h1>
            </div>
        </div>
      
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">{treatment.description}</p>

                    <div className="space-y-8">
                        {/* Key Benefits */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <CheckBadgeIcon className="w-6 h-6 text-green-500" />
                                Key Benefits
                            </h3>
                            <ul className="space-y-2 text-slate-600 dark:text-slate-300 pl-4">
                                {treatment.benefits && treatment.benefits.length > 0 ? treatment.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-green-500 mr-2 mt-1">&#10003;</span>
                                        <span>{benefit}</span>
                                    </li>
                                )) : <li>No benefits listed.</li>}
                            </ul>
                        </div>

                        {/* How to Use */}
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                             <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                                <BookOpenIcon className="w-6 h-6 text-blue-500" />
                                How to Use
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300">{treatment.howToUse || 'No usage instructions provided.'}</p>
                        </div>
                    </div>
                </div>

                {/* Disclaimer & Related */}
                <div className="md:col-span-1 space-y-8">
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5" />
                            Disclaimer
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">{treatment.disclaimer || 'No disclaimer provided.'}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                         <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                            Find a Specialist
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Consult a doctor to discuss if this treatment is right for you.</p>
                        <Link to="/find-doctor" className="w-full text-center block bg-primary text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-cyan-600 transition-colors">
                            Find a Doctor
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default TreatmentDetailPage;
