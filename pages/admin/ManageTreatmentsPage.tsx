import React, { useState, useEffect } from 'react';
import { Treatment, TreatmentCategory } from '../../types';
import { XMarkIcon, PencilIcon, TrashIcon } from '../../components/IconComponents';
import { useAuth } from '../../components/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ManageTreatmentsPage: React.FC = () => {
  const { token } = useAuth();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTreatment, setNewTreatment] = useState<Omit<Treatment, 'id'>>({
    name: '',
    category: 'Ayurveda',
    description: '',
    imageUrl: '',
    benefits: [],
    howToUse: '',
    disclaimer: '',
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTreatmentId, setEditTreatmentId] = useState<string | null>(null);
  const [editTreatment, setEditTreatment] = useState<Omit<Treatment, 'id'>>({
    name: '',
    category: 'Ayurveda',
    description: '',
    imageUrl: '',
    benefits: [],
    howToUse: '',
    disclaimer: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch treatments from backend
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/treatments`)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setTreatments(data.map((t: any) => ({ ...t, id: t._id || t.id })));
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load treatments. The backend may be waking up. Please wait and refresh.');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTreatment(prev => ({ ...prev, [name]: value as any }));
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditTreatment(prev => ({ ...prev, [name]: value as any }));
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
      const res = await fetch(`${API_BASE_URL}/treatments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTreatment),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add treatment');
      }
      setIsModalOpen(false);
      setNewTreatment({
        name: '',
        category: 'Ayurveda',
        description: '',
        imageUrl: '',
        benefits: [],
        howToUse: '',
        disclaimer: '',
      });
      // Refresh treatments
      const treatmentsRes = await fetch(`${API_BASE_URL}/treatments`);
      const treatmentsData = await treatmentsRes.json();
      setTreatments(treatmentsData.map((t: any) => ({ ...t, id: t._id || t.id })));
      alert('Treatment added!');
    } catch (err: any) {
      setError(err.message || 'Failed to add treatment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (treatment: Treatment) => {
    setEditTreatmentId(treatment.id as any);
    setEditTreatment({
      name: treatment.name,
      category: treatment.category,
      description: treatment.description,
      imageUrl: treatment.imageUrl,
      benefits: treatment.benefits,
      howToUse: treatment.howToUse,
      disclaimer: treatment.disclaimer,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('No token provided. Please log in as admin.');
      setLoading(false);
      return;
    }
    if (editTreatmentId) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/treatments/${editTreatmentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editTreatment),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to update treatment');
        }
        setIsEditModalOpen(false);
        setEditTreatmentId(null);
        setEditTreatment({
          name: '',
          category: 'Ayurveda',
          description: '',
          imageUrl: '',
          benefits: [],
          howToUse: '',
          disclaimer: '',
        });
        // Refresh treatments
        const treatmentsRes = await fetch(`${API_BASE_URL}/treatments`);
        const treatmentsData = await treatmentsRes.json();
        setTreatments(treatmentsData.map((t: any) => ({ ...t, id: t._id || t.id })));
        alert('Treatment updated!');
      } catch (err: any) {
        setError(err.message || 'Failed to update treatment');
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
    if (window.confirm('Are you sure you want to delete this treatment?')) {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/treatments/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to delete treatment');
        }
        // Refresh treatments
        const treatmentsRes = await fetch(`${API_BASE_URL}/treatments`);
        const treatmentsData = await treatmentsRes.json();
        setTreatments(treatmentsData.map((t: any) => ({ ...t, id: t._id || t.id })));
        alert('Treatment deleted!');
      } catch (err: any) {
        setError(err.message || 'Failed to delete treatment');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Manage Treatments</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-cyan-600 transition-colors"
        >
          + Add Treatment
        </button>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-2">{error}</div>}

      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Description</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {treatments.map(treatment => (
              <tr key={treatment.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-5 py-4 text-sm font-medium text-slate-900 dark:text-slate-200">{treatment.name}</td>
                <td className="px-5 py-4 text-sm">
                    <span className={`text-xs font-semibold uppercase tracking-wider text-cyan-700 bg-cyan-100 dark:text-cyan-300 dark:bg-cyan-900/50 px-2 py-1 rounded-full`}>{treatment.category}</span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{treatment.description}</td>
                <td className="px-5 py-4 text-sm">
                  <div className="flex items-center gap-4">
                     <button onClick={() => handleEdit(treatment)} className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"><PencilIcon className="w-5 h-5"/></button>
                     <button onClick={() => handleDelete(String(treatment.id))} className="text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"><TrashIcon className="w-5 h-5"/></button>
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
              <h3 className="text-xl font-semibold dark:text-slate-100">Add New Treatment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <input type="text" name="name" value={newTreatment.name} onChange={handleInputChange} placeholder="Treatment Name" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <select name="category" value={newTreatment.category} onChange={handleInputChange} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  <option>Ayurveda</option>
                  <option>Herbal</option>
                  <option>Homeopathy</option>
                  <option>Lifestyle</option>
                  <option>Nutrition</option>
              </select>
              <textarea name="description" value={newTreatment.description} onChange={handleInputChange} placeholder="Description" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md h-24 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"></textarea>
              <input type="text" name="imageUrl" value={newTreatment.imageUrl} onChange={handleInputChange} placeholder="Image URL" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600" disabled={loading}>Cancel</button>
                <button type="submit" className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600" disabled={loading}>Add Treatment</button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg m-4">
            <div className="flex justify-between items-center p-5 border-b dark:border-slate-700">
              <h3 className="text-xl font-semibold dark:text-slate-100">Edit Treatment</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-200">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
              <input type="text" name="name" value={editTreatment.name} onChange={handleEditInputChange} placeholder="Treatment Name" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <select name="category" value={editTreatment.category} onChange={handleEditInputChange} required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                  <option>Ayurveda</option>
                  <option>Herbal</option>
                  <option>Homeopathy</option>
                  <option>Lifestyle</option>
                  <option>Nutrition</option>
              </select>
              <textarea name="description" value={editTreatment.description} onChange={handleEditInputChange} placeholder="Description" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md h-24 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"></textarea>
              <input type="text" name="imageUrl" value={editTreatment.imageUrl} onChange={handleEditInputChange} placeholder="Image URL" required className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600" disabled={loading}>Cancel</button>
                <button type="submit" className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-cyan-600" disabled={loading}>Update Treatment</button>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTreatmentsPage;