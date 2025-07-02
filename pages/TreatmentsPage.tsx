
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Treatment, TreatmentCategory } from '../types';
import TreatmentCard from '../components/TreatmentCard';

const categories: TreatmentCategory[] = ['Ayurveda', 'Herbal', 'Homeopathy', 'Lifestyle', 'Nutrition'];

interface TreatmentsPageProps {
  treatments: Treatment[];
}

const TreatmentsPage: React.FC<TreatmentsPageProps> = ({ treatments }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const filteredTreatments = treatments.filter(treatment => 
    activeCategory === 'All' ? true : treatment.category === activeCategory
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Wellness &amp; Treatments</h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Explore traditional Indian and holistic approaches to wellness.</p>
        </div>
        
        {/* Category Filters */}
        <div className="flex justify-center flex-wrap gap-2 mb-12">
            <button 
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === 'All' ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
            >
                All
            </button>
            {categories.map(category => (
                <button 
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === category ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}`}
                >
                    {category}
                </button>
            ))}
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTreatments.map(treatment => (
            <Link key={treatment.id} to={`/treatment/${treatment.id}`} className="block">
                <TreatmentCard treatment={treatment} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreatmentsPage;
