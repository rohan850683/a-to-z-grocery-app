import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Lock, Phone, MapPin, Cake, Eye, EyeOff } from 'lucide-react';

const initial = { name: '', email: '', password: '', phone: '', address: '', age: '' };

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Enter your full name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!/^[0-9]{10}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit phone number';
    if (form.address.trim().length < 5) errs.address = 'Enter your full delivery address';
    if (!form.age || form.age < 13 || form.age > 100) errs.age = 'Enter a valid age (13-100)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signup({ ...form, age: Number(form.age) });
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Jane Doe' },
    { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
    { key: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '9876543210' },
    { key: 'address', label: 'Delivery Address', type: 'text', icon: MapPin, placeholder: 'House no, street, city' },
    { key: 'age', label: 'Age', type: 'number', icon: Cake, placeholder: '25' },
  ];

  return (
    <div className="container-app py-12 flex justify-center">
      <div className="w-full max-w-md card p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-forest-500 flex items-center justify-center font-display font-bold text-white text-xl rotate-3">
            AZ
          </div>
          <h1 className="font-display text-2xl font-bold mt-4 text-ink">Create your account</h1>
          <p className="text-ink/50 text-sm mt-1">Join A to Z for fast, fresh delivery every day</p>
        </div>

        {serverError && (
          <p className="bg-chili-500/10 text-chili-600 text-sm rounded-xl px-4 py-2.5 mb-4">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {fields.map(({ key, label, type, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className="text-sm font-semibold text-ink/70">{label}</label>
              <div className="relative mt-1">
                <Icon size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
                <input
                  type={type}
                  value={form[key]}
                  onChange={handleChange(key)}
                  className="w-full rounded-xl border border-forest-100 bg-mint/50 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                  placeholder={placeholder}
                />
              </div>
              {errors[key] && <p className="text-chili-500 text-xs mt-1">{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="text-sm font-semibold text-ink/70">Password</label>
            <div className="relative mt-1">
              <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30" />
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange('password')}
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-forest-600 font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
