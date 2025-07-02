import React, { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Appointment } from '../types';
import { DocumentTextIcon, PillIcon } from '../components/IconComponents';
import { useAuth } from '../components/AuthContext';
import ChatBox from '../components/ChatBox';

interface ConsultationDetailPageProps {
  appointments: Appointment[];
}

const ConsultationDetailPage: React.FC<ConsultationDetailPageProps> = ({ appointments }) => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (!id || !token) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/appointments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setAppointment({
          id: data._id || data.id,
          doctorName: data.doctor?.name || '',
          specialty: data.doctor?.specialty || '',
          date: new Date(data.slot).toLocaleDateString(),
          time: new Date(data.slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: data.status,
          notes: data.notes,
          prescription: data.prescription || [],
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!appointment) return <Navigate to="/dashboard" replace />;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/dashboard" className="text-primary dark:text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-300 font-medium">&larr; Back to Dashboard</Link>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">Consultation Details</h1>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-slate-600 dark:text-slate-400 border-t border-b border-slate-200 dark:border-slate-700 py-3">
                <p><span className="font-semibold text-slate-700 dark:text-slate-300">Doctor:</span> {appointment.doctorName} ({appointment.specialty})</p>
                <p><span className="font-semibold text-slate-700 dark:text-slate-300">Date:</span> {appointment.date} at {appointment.time}</p>
            </div>
          </div>
          
          <div className="space-y-8">
            {/* Doctor's Notes */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-3">
                    <DocumentTextIcon className="w-7 h-7 text-primary"/>
                    Doctor's Notes
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {appointment.notes || "No notes were provided for this consultation."}
                </p>
            </div>
            
            {/* E-Prescription */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-3">
                    <PillIcon className="w-7 h-7 text-primary"/>
                    E-Prescription
                </h3>
                {appointment.prescription && appointment.prescription.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b-2 border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="py-2 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Medicine</th>
                                    <th className="py-2 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Dosage</th>
                                    <th className="py-2 px-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointment.prescription.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50">
                                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">{item.name}</td>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.dosage}</td>
                                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{item.duration}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-slate-600 dark:text-slate-300">No prescription was issued for this consultation.</p>
                )}
            </div>

            {/* Chat History */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-3">
                    Chat History
                </h3>
                <ChatBox appointmentId={String(id)} token={token!} />
            </div>

            {/* After appointment details, add Leave a Review button if eligible */}
            {appointment.status === 'completed' && (
              <div className="mt-8 text-center">
                <button onClick={() => setShowReviewModal(true)} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition-colors">Leave a Review</button>
              </div>
            )}

            {showReviewModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 p-8 animate-fade-in-up">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Leave a Review</h2>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setReviewSubmitting(true);
                    setReviewSuccess(false);
                    try {
                      const res = await fetch(`http://localhost:5000/api/doctors/${appointment.doctorId || appointment.doctorName}/reviews`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ rating: reviewRating, comment: reviewComment }),
                      });
                      if (!res.ok) throw new Error('Failed to submit review');
                      setReviewSuccess(true);
                      setShowReviewModal(false);
                    } catch {
                      alert('Failed to submit review.');
                    } finally {
                      setReviewSubmitting(false);
                    }
                  }}>
                    <label className="block mb-2 font-medium">Rating:</label>
                    <div className="flex gap-1 mb-4">
                      {[1,2,3,4,5].map(star => (
                        <button type="button" key={star} onClick={() => setReviewRating(star)} className={star <= reviewRating ? 'text-yellow-500' : 'text-slate-300'}>
                          ★
                        </button>
                      ))}
                    </div>
                    <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Write your feedback..." className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg mb-4 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" rows={4} required />
                    <div className="flex justify-end gap-3">
                      <button type="button" onClick={() => setShowReviewModal(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 transition-colors">Cancel</button>
                      <button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-md hover:bg-cyan-600 transition-colors" disabled={reviewSubmitting}>{reviewSubmitting ? 'Submitting...' : 'Submit Review'}</button>
                    </div>
                    {reviewSuccess && <p className="mt-4 text-green-600">Review submitted!</p>}
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailPage;
