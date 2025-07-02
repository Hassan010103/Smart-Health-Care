import React from 'react';

interface ViewPaymentsPageProps {
  payments: any[];
  onUpdatePaymentStatus?: (id: string, status: string) => void;
}

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

const ViewPaymentsPage: React.FC<ViewPaymentsPageProps> = ({ payments, onUpdatePaymentStatus }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">Payment Details</h1>
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
              {onUpdatePaymentStatus && <th className="px-5 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id || payment.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <td className="px-5 py-4 text-sm font-mono text-slate-500 dark:text-slate-400">PAY-{(payment._id || payment.id).toString().slice(-6).toUpperCase()}</td>
                <td className="px-5 py-4 text-sm text-slate-800 dark:text-slate-200 font-medium">{payment.patient?.name || 'N/A'}</td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{payment.doctor?.name || 'N/A'}</td>
                <td className="px-5 py-4 text-sm text-slate-800 dark:text-slate-200 font-medium">₹{payment.amount?.toFixed(2) || '0.00'}</td>
                <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4 text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${getStatusChip(payment.status)}`}>
                    <span className="relative">{payment.status}</span>
                  </span>
                </td>
                {onUpdatePaymentStatus && (
                  <td className="px-5 py-4 text-sm">
                    <select
                      value={payment.status}
                      onChange={e => onUpdatePaymentStatus(payment._id || payment.id, e.target.value)}
                      className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPaymentsPage;