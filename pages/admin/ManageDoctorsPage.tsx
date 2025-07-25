import React, { useState, useEffect } from 'react';
import { Doctor } from '../../types';
import { XMarkIcon, PencilIcon, TrashIcon } from '../../components/IconComponents';
import { useAuth } from '../../components/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageDoctorsPage: React.FC = () => {
  const { token } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    specialty: '',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDoctorId, setEditDoctorId] = useState<string | null>(null);
  const [editDoctor, setEditDoctor] = useState({
    name: '',
    email: '',
    specialty: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch doctors from backend
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
        setError('Unable to load doctors. The backend may be waking up. Please wait and refresh.');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!token) {
      setError('No token provided. Please log in as admin.');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newDoctor,
          password: 'password123',
          qualifications: [],
          bio: '',
          availability: [],
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add doctor');
      }
      setIsModalOpen(false);
      setNewDoctor({ name: '', email: '', specialty: '' });
      // Refresh doctors
      const doctorsRes = await fetch(`${API_BASE_URL}/doctors`);
      const doctorsData = await doctorsRes.json();
      setDoctors(doctorsData.map((doc: any) => ({ ...doc, id: doc._id || doc.id })));
      alert('Doctor added!');
    } catch (err: any) {
      setError(err.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditDoctorId(doctor.id as any);
    setEditDoctor({ name: doctor.name, email: doctor.email, specialty: doctor.specialty });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('No token provided. Please log in as admin.');
      setLoading(false);
      return;
    }
    if (editDoctorId) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/doctors/${editDoctorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editDoctor),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update doctor');
        }
        setIsEditModalOpen(false);
        setEditDoctorId(null);
        setEditDoctor({ name: '', email: '', specialty: '' });
        // Refresh doctors
        const doctorsRes = await fetch(`${API_BASE_URL}/doctors`);
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData.map((doc: any) => ({ ...doc, id: doc._id || doc.id })));
        alert('Doctor updated!');
      } catch (err: any) {
        setError(err.message || 'Failed to update doctor');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) {
      setError('No token provided. Please log in as admin.');
      setLoading(false);
      return;
    }
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/doctors/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to delete doctor');
        }
        // Refresh doctors
        const doctorsRes = await fetch(`${API_BASE_URL}/doctors`);
        const doctorsData = await doctorsRes.json();
        setDoctors(doctorsData.map((doc: any) => ({ ...doc, id: doc._id || doc.id })));
        alert('Doctor deleted!');
      } catch (err: any) {
        setError(err.message || 'Failed to delete doctor');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Manage Doctors</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors"
        >
          + Add Doctor
        </button>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-2">{error}</div>}

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Specialty</th>
              <th className="px-5 py-3">Location</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(doctor => (
              <tr key={doctor.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-5 py-4 text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img className="w-full h-full rounded-full object-cover" src={doctor.imageUrl} alt={doctor.name} />
                    </div>
                    <div className="ml-3">
                      <p className="text-slate-900 dark:text-slate-200 whitespace-no-wrap font-medium">{doctor.name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm">
                  <p className="text-slate-900 dark:text-slate-200 whitespace-no-wrap">{doctor.specialty}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                  <p className="text-slate-600 dark:text-slate-400 whitespace-no-wrap">{doctor.location}</p>
                </td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex items-center gap-4">
                    <button onClick={() => handleEdit(doctor)} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDelete(String(doctor.id))} className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg m-4">
            <div className="flex justify-between items-center p-5 border-b dark:border-slate-700">
              <h3 className="text-xl font-semibold dark:text-slate-100">Add New Doctor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <input type="text" name="name" value={newDoctor.name} onChange={handleInputChange} placeholder="Doctor's Name" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <input type="email" name="email" value={newDoctor.email} onChange={handleInputChange} placeholder="Email" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <input type="text" name="specialty" value={newDoctor.specialty} onChange={handleInputChange} placeholder="Specialty" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                <button type="submit" className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600" disabled={loading}>Add Doctor</button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg m-4">
            <div className="flex justify-between items-center p-5 border-b dark:border-slate-700">
              <h3 className="text-xl font-semibold dark:text-slate-100">Edit Doctor</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <input type="text" name="name" value={editDoctor.name} onChange={handleEditInputChange} placeholder="Doctor's Name" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <input type="email" name="email" value={editDoctor.email} onChange={handleEditInputChange} placeholder="Email" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <input type="text" name="specialty" value={editDoctor.specialty} onChange={handleEditInputChange} placeholder="Specialty" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600">Cancel</button>
                <button type="submit" className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600" disabled={loading}>Save Changes</button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctorsPage;