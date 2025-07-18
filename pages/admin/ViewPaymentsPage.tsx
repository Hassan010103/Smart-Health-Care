import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getStatusChip = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
        case 'failed':
            return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        default:
            return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
    }
}

const ViewPaymentsPage: React.FC = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (!token) {
      setError('No token provided. Please log in as admin.');
      setLoading(false);
      return;
    }
    fetch(`${API_BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => {
        setPayments(data.map((p: any) => ({ ...p, id: p._id || p.id })));
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load payments. The backend may be waking up. Please wait and refresh.');
        setLoading(false);
      });
  }, [token]);

  const handleUpdatePaymentStatus = async (id: string, status: string) => {
    if (!token) {
      setError('No token provided. Please log in as admin.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update payment status');
      }
      // Refresh payments
      const paymentsRes = await fetch(`${API_BASE_URL}/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const paymentsData = await paymentsRes.json();
      setPayments(paymentsData.map((p: any) => ({ ...p, id: p._id || p.id })));
      alert('Payment status updated!');
    } catch (err: any) {
      setError(err.message || 'Failed to update payment status');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Payment Details</h1>
      {loading && <div className="text-center py-8">Loading...</div>}
      {error && <div className="text-center text-red-500 py-2">{error}</div>}
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              <th className="px-5 py-3">Payment ID</th>
              <th className="px-5 py-3">Patient</th>
              <th className="px-5 py-3">Doctor</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id || payment.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-5 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">PAY-{(payment._id || payment.id).toString().slice(-6).toUpperCase()}</td>
                <td className="px-5 py-4 text-sm text-slate-800 dark:text-slate-200 font-medium">{payment.patient?.name || 'N/A'}</td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{payment.doctor?.name || 'N/A'}</td>
                <td className="px-5 py-4 text-sm text-slate-800 dark:text-slate-200 font-medium"> ₹{payment.amount?.toFixed(2) || '0.00'}</td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${getStatusChip(payment.status)}`}>
                    <span className="relative">{payment.status}</span>
                  </span>
                </td>
                <td className="px-5 py-4 text-sm">
                  <select
                    value={payment.status}
                    onChange={e => handleUpdatePaymentStatus(payment._id || payment.id, e.target.value)}
                    className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPaymentsPage;