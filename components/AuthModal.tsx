import React, { useState } from 'react';
import { AuthModalType } from '../types';
import { LogoIcon } from './IconComponents';
import { useAuth } from './AuthContext';

interface AuthModalProps {
  type: AuthModalType;
  onClose: () => void;
  onLogin: (name: string) => void;
  onSwitch: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ type, onClose, onLogin, onSwitch }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const isLogin = type === 'login';

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let res, data;
      if (isLogin) {
        res = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } else {
        res = await fetch(`${API_BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
      }
      data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      login(data.token, data.user); // Save token and user in AuthContext/localStorage
      onLogin(data.user.name); // Pass user name up to App
      setName(''); setEmail(''); setPassword('');
      setError(null);
      // Force reload to ensure token is used everywhere
      window.location.reload();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md m-4 p-8 animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center">
            <LogoIcon className="h-12 w-12 text-primary mb-2" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{isLogin ? 'Sign in to continue' : 'Get started with your free account'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                placeholder="Ravi Kumar"
                disabled={loading}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password"className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (isLogin ? 'Logging in...' : 'Creating...') : (isLogin ? 'Log In' : 'Create Account')}
            </button>
          </div>
        </form>
        
        {error && <p className="mt-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">{error}</p>}
        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={onSwitch} className="font-medium text-primary hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;