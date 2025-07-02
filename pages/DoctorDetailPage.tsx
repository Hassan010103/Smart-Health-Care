import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Doctor } from '../types';
import DoctorAvailability from '../components/DoctorAvailability';
import PatientReview from '../components/PatientReview';
import { AcademicCapIcon } from '../components/IconComponents';
import BookingConfirmationModal from '../components/BookingConfirmationModal';

interface DoctorDetailPageProps {
  doctors: Doctor[];
  isLoggedIn: boolean;
  onBookAppointment: (doctor: Doctor, slot: {day: string, time: string}) => void;
}

const DoctorDetailPage: React.FC<DoctorDetailPageProps> = ({ doctors, isLoggedIn, onBookAppointment }) => {
  const { id } = useParams<{ id: string }>();
  const doctor = doctors.find(d => String(d.id) === String(id));

  // Defensive: fallback values for all fields
  const imageUrl = doctor?.imageUrl || '/default.png';
  const name = doctor?.name || 'Doctor';
  const specialty = doctor?.specialty || 'Specialist';
  const location = doctor?.location || 'Unknown location';
  const rating = typeof doctor?.rating === 'number' ? doctor.rating : 0;
  let reviewsCount = 0;
  if (Array.isArray(doctor?.reviews)) {
    reviewsCount = doctor.reviews.length;
  } else if (typeof doctor?.reviews === 'number') {
    reviewsCount = doctor.reviews;
  }
  const bio = doctor?.bio || '';
  const qualifications = Array.isArray(doctor?.qualifications) ? doctor.qualifications : [];
  const availability = Array.isArray(doctor?.availability) ? doctor.availability : [];

  const [selectedSlot, setSelectedSlot] = useState<{ day: string, time: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (!doctor) return;
    fetch(`http://localhost:5000/api/doctors/${doctor.id}/reviews`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setReviews(data));
  }, [doctor]);

  if (!doctor) {
    // If doctor not found, redirect to the main search page
    return <Navigate to="/find-doctor" replace />;
  }

  const handleBookingRequest = () => {
      if (selectedSlot) {
        if(isLoggedIn) {
            setIsModalOpen(true);
        } else {
            // Forward to App.tsx to handle opening the login modal
            onBookAppointment(doctor, selectedSlot);
        }
      }
  };

  const handleConfirmBooking = () => {
    if(doctor && selectedSlot) {
        onBookAppointment(doctor, selectedSlot);
        setIsModalOpen(false);
        setSelectedSlot(null);
    }
  }

  return (
    <>
    <div className="bg-slate-50 dark:bg-slate-900 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left Column: Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 sticky top-24 border border-slate-200 dark:border-slate-700">
                <img className="h-32 w-32 rounded-full mx-auto object-cover shadow-md border-4 border-white dark:border-slate-800 -mt-16" src={imageUrl} alt={name} />
                <div className="text-center mt-4">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h1>
                    <p className="text-primary dark:text-cyan-400 font-semibold mt-1">{specialty}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{location}</p>
                </div>
                <div className="flex items-center justify-center mt-4">
                    <div className="flex items-center text-yellow-500">
                        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
                    </div>
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">{rating ? rating.toFixed(1) : 'N/A'} ({reviewsCount} reviews)</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-6 text-center">{bio}</p>
                <button 
                    onClick={handleBookingRequest}
                    disabled={!selectedSlot}
                    className="mt-6 w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-cyan-600 transition-all transform hover:scale-105 disabled:bg-slate-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none"
                >
                    Book an Appointment
                </button>
            </div>
          </div>
          
          {/* Right Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <AcademicCapIcon className="w-6 h-6 text-primary" />
                    Qualifications
                </h3>
                <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
                  {qualifications.length > 0
                    ? qualifications.map(q => <li key={q}>{q}</li>)
                    : <li>No qualifications listed.</li>
                  }
                </ul>
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <DoctorAvailability 
                    availability={availability} 
                    selectedSlot={selectedSlot}
                    onSelectSlot={setSelectedSlot}
                />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Patient Reviews</h3>
                <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review, index) => (
                        <PatientReview key={index} name={review.patient?.name || 'Anonymous'} rating={review.rating} comment={review.comment} />
                      ))
                    ) : (
                      <p className="text-slate-500 dark:text-slate-400">No reviews yet.</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {isModalOpen && doctor && selectedSlot && (
        <BookingConfirmationModal
            doctor={doctor}
            slot={selectedSlot}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmBooking}
        />
    )}
    </>
  );
};

export default DoctorDetailPage;
