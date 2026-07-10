import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-12 flex justify-center">
      <div className="w-full max-w-md card p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-forest-500 flex items-center justify-center font-display font-bold text-white text-xl rotate-3">
            AZ
          </div>
          <h1 className="font-display text-2xl font-bold mt-4 text-ink">Welcome back</h1>
          <p className="text-ink/50 text-sm mt-1">Log in to continue shopping fresh with A to Z</p>
        </div>

        {serverError && (
          <p className="bg-chili-500/10 text-chili-600 text-sm rounded-xl px-4 py-2.5 mb-4">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="text-sm font-semibold text-ink/70">Email</label>
            <div className="relative mt-1">
              <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-forest-100 bg-mint/50 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-chili-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-ink/70">Password</label>
            <div className="relative mt-1">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-forest-100 bg-mint/50 pl-11 pr-11 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-chili-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          New to A to Z?{' '}
          <Link to="/signup" className="text-forest-600 font-semibold hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
