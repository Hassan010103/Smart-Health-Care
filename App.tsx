import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import FindDoctorPage from './pages/FindDoctorPage';
import TreatmentsPage from './pages/TreatmentsPage';
import DashboardPage from './pages/DashboardPage';
import AuthModal from './components/AuthModal';
import { AuthModalType, Doctor, Treatment, Theme, Appointment } from './types';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageDoctorsPage from './pages/admin/ManageDoctorsPage';
import ManageTreatmentsPage from './pages/admin/ManageTreatmentsPage';
import ViewPaymentsPage from './pages/admin/ViewPaymentsPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import DoctorDetailPage from './pages/DoctorDetailPage';
import PricingPage from './pages/PricingPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import TreatmentDetailPage from './pages/TreatmentDetailPage';
import VideoCallPage from './pages/VideoCallPage';
import ConsultationDetailPage from './pages/ConsultationDetailPage';
import { AuthProvider, useAuth } from './components/AuthContext';
import { fetchWithRetry } from './services/fetchWithRetry';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  // Remove local isLoggedIn and currentUser state. Use AuthContext instead.
  const [authModal, setAuthModal] = useState<AuthModalType | null>(null);
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Backend data state
  // Remove all global data fetching and loading state
  // Remove doctors, treatments, appointments, payments, loadingData, fetchError, showWakeupMessage, and related useEffects
  // Only keep authentication, navigation, and admin state
  const navigate = useNavigate();
  const { token, user, login, logout } = useAuth();
  const isLoggedIn = !!token && !!user;

  // New admin login state
  const [adminAuthModal, setAdminAuthModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);

  // Remove all global data fetching and loading state
  // Remove doctors, treatments, appointments, payments, loadingData, fetchError, showWakeupMessage, and related useEffects
  // Only keep authentication, navigation, and admin state
  const handleLogin = (name: string) => {
    setAuthModal(null);
  };

  const handleAdminLogin = () => {
    setAdminAuthModal(true);
  };

  const handleAdminAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    setAdminLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      if (data.user.role !== 'admin') throw new Error('Not an admin account');
      login(data.token, data.user); // Save token and user in AuthContext/localStorage
      setAdminAuthModal(false);
      setAdminEmail('');
      setAdminPassword('');
      setAdminLoginError(null);
      // Optionally store admin token in localStorage if you want to persist
      // localStorage.setItem('adminToken', data.token);
      navigate('/admin');
    } catch (err: any) {
      setAdminLoginError(err.message);
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenModal = (type: AuthModalType) => {
    setAuthModal(type);
  };

  const handleCloseModal = () => {
    setAuthModal(null);
  };

  // Placeholder: update these to use backend API for CRUD in next steps
  const addDoctor = async (doctor: Omit<Doctor, 'id' | 'rating' | 'reviews' | 'bio' | 'qualifications' | 'availability'>) => {
    if (!token) return alert('You must be logged in as admin.');
    try {
      const res = await fetch(`${API_BASE_URL}/doctors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...doctor,
          password: 'password123', // Default password for demo
          qualifications: [],
          bio: '',
          availability: [],
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add doctor');
      }
      // await fetchDoctors(); // Removed
      alert('Doctor added!');
    } catch (err: any) {
      alert(err.message);
    }
  };
  const addTreatment = async (treatment: Omit<Treatment, 'id'>) => {
    if (!token) return alert('You must be logged in as admin.');
    try {
      const res = await fetch(`${API_BASE_URL}/treatments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(treatment),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add treatment');
      }
      // await fetchTreatments(); // Removed
      alert('Treatment added!');
    } catch (err: any) {
      alert(err.message);
    }
  };
  const handleBookAppointment = async (doctor: Doctor, slot: { day: string, time: string }) => {
    if (!isLoggedIn) {
      handleOpenModal('login');
      return;
    }
    try {
      // Compose slot as ISO date (for demo, use next occurrence of day/time)
      const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const today = new Date();
      let targetDay = daysOfWeek.indexOf(slot.day);
      let daysToAdd = (targetDay - today.getDay() + 7) % 7;
      let [hour, minute, ampm] = slot.time.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
      let date = new Date(today);
      date.setDate(today.getDate() + daysToAdd);
      date.setHours(ampm.toUpperCase() === 'PM' ? (parseInt(hour) % 12) + 12 : parseInt(hour) % 12);
      date.setMinutes(parseInt(minute));
      date.setSeconds(0);
      date.setMilliseconds(0);
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          slot: date.toISOString(),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to book appointment');
      }
      // await fetchAppointments(); // Removed
      alert('Appointment booked!');
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    if (!token) return alert('You must be logged in.');
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to cancel appointment');
      }
      // await fetchAppointments(); // Removed
      alert('Appointment cancelled!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const editDoctor = async (id: string, updates: Partial<Doctor>) => {
    if (!token) return alert('You must be logged in as admin.');
    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update doctor');
      }
      // await fetchDoctors(); // Removed
      alert('Doctor updated!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteDoctor = async (id: string) => {
    if (!token) return alert('You must be logged in as admin.');
    try {
      const res = await fetch(`${API_BASE_URL}/doctors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete doctor');
      }
      // await fetchDoctors(); // Removed
      alert('Doctor deleted!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const editTreatment = async (id: string, updates: Partial<Treatment>) => {
    if (!token) return alert('You must be logged in as admin.');
    try {
      const res = await fetch(`${API_BASE_URL}/treatments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update treatment');
      }
      // await fetchTreatments(); // Removed
      alert('Treatment updated!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteTreatment = async (id: string) => {
    if (!token) return alert('You must be logged in as admin.');
    try {
      const res = await fetch(`${API_BASE_URL}/treatments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete treatment');
      }
      // await fetchTreatments(); // Removed
      alert('Treatment deleted!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Razorpay payment integration
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById('razorpay-script')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => reject('Failed to load Razorpay script');
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPay = async (appointment: Appointment, amount: number) => {
    if (!token) return alert('You must be logged in.');
    await loadRazorpayScript();
    try {
      // 1. Create Razorpay order from backend
      const res = await fetch(`${API_BASE_URL}/payments/razorpay/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create Razorpay order');
      }
      const order = await res.json();
      // 2. Open Razorpay modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_7zdhWRnILEoG1D',
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'Smart Health Care',
        description: 'Consultation Payment',
        handler: async function (response: any) {
          // 3. On success, mark payment as completed in backend (mock for now)
          alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
          // await fetchPayments(); // Removed
        },
        prefill: {
          name: user?.name || '',
          email: '',
        },
        theme: { color: '#06b6d4' },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const createPayment = async (appointmentId: string, amount: number) => {
    if (!token) return alert('You must be logged in.');
    try {
      const res = await fetch(`${API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ appointmentId, amount }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create payment');
      }
      alert('Payment created!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    if (!token) return alert('You must be logged in as admin.');
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
      alert('Payment status updated!');
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Remove all global data fetching and loading state
  // Remove doctors, treatments, appointments, payments, loadingData, fetchError, showWakeupMessage, and related useEffects
  // Only keep authentication, navigation, and admin state
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 dark:text-slate-200">
      {!isAdminRoute && (
        <Header 
          isLoggedIn={isLoggedIn}
          userName={user?.name}
          onLogout={handleLogout}
          onOpenModal={handleOpenModal}
          onAdminLogin={handleAdminLogin}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/find-doctor" element={<FindDoctorPage />} />
          <Route path="/doctor/:id" element={<DoctorDetailPage onBookAppointment={handleBookAppointment} isLoggedIn={isLoggedIn} />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/treatment/:id" element={<TreatmentDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage isLoggedIn={isLoggedIn} onOpenLogin={() => handleOpenModal('login')} onCancelAppointment={cancelAppointment} onRazorpayPay={handleRazorpayPay} />} />
          <Route path="/call/:id" element={<VideoCallPage token={token} />} />
          <Route path="/consultation/:id" element={<ConsultationDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route element={<ProtectedRoute isAllowed={user?.role === 'admin'} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="doctors" element={<ManageDoctorsPage onAddDoctor={addDoctor} onEditDoctor={editDoctor} onDeleteDoctor={deleteDoctor} />} />
              <Route path="treatments" element={<ManageTreatmentsPage onAddTreatment={addTreatment} onEditTreatment={editTreatment} onDeleteTreatment={deleteTreatment} />} />
              <Route path="payments" element={<ViewPaymentsPage onCreatePayment={createPayment} onUpdatePaymentStatus={updatePaymentStatus} />} />
            </Route>
          </Route>
        </Routes>
      </main>
      {authModal && (
        <AuthModal 
          type={authModal} 
          onClose={handleCloseModal} 
          onLogin={handleLogin}
          onSwitch={() => handleOpenModal(authModal === 'login' ? 'register' : 'login')}
        />
      )}
      {adminAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" onClick={() => setAdminAuthModal(false)}>
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 p-8 animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Login</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Sign in as admin to access the admin panel</p>
            </div>
            <form onSubmit={handleAdminAuthSubmit} className="space-y-6">
              <div>
                <label htmlFor="admin-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <input
                  id="admin-email"
                  name="admin-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  placeholder="admin@demo.com"
                  disabled={adminLoginLoading}
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <input
                  id="admin-password"
                  name="admin-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                  placeholder="••••••••"
                  disabled={adminLoginLoading}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
                  disabled={adminLoginLoading}
                >
                  {adminLoginLoading ? 'Logging in...' : 'Log In as Admin'}
                </button>
              </div>
            </form>
            {adminLoginError && <p className="mt-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{adminLoginError}</p>}
          </div>
        </div>
      )}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

const AppWithAuth = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWithAuth;
