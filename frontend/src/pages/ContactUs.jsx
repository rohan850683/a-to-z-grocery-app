import { useState } from 'react';
import api from '../services/api';
import { Mail, Phone, MapPin, User, MessageSquare, CheckCircle2 } from 'lucide-react';

const initial = { name: '', email: '', phone: '', address: '', message: '' };

export default function ContactUs() {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = 'Enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!/^[0-9]{10}$/.test(form.phone)) errs.phone = 'Enter a valid 10-digit phone number';
    if (form.address.trim().length < 5) errs.address = 'Enter your address';
    if (form.message.trim().length < 10) errs.message = 'Message should be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', text: '' });
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('/contact', form);
      setStatus({ type: 'success', text: res.data.message || 'Message sent successfully!' });
      setForm(initial);
    } catch (err) {
      setStatus({ type: 'error', text: err.response?.data?.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: User, placeholder: 'Jane Doe', type: 'text' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'you@example.com', type: 'email' },
    { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '9876543210', type: 'tel' },
    { key: 'address', label: 'Address', icon: MapPin, placeholder: 'Your address', type: 'text' },
  ];

  return (
    <div className="container-app py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">Contact Us</h1>
          <p className="text-ink/60 mt-3 max-w-md">
            Have a question about an order, a product, or a partnership? Drop us a message and
            our team will get back to you within 24 hours.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-600">
                <Phone size={18} />
              </span>
              <p className="text-sm font-semibold text-ink/70">+91 98765 43210</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-600">
                <Mail size={18} />
              </span>
              <p className="text-sm font-semibold text-ink/70">support@atozgrocery.com</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-forest-50 flex items-center justify-center text-forest-600">
                <MapPin size={18} />
              </span>
              <p className="text-sm font-semibold text-ink/70">A to Z HQ, Faridabad, Haryana, India</p>
            </div>
          </div>
        </div>

        <div className="card p-8">
          {status.type === 'success' ? (
            <div className="text-center py-10">
              <CheckCircle2 className="mx-auto text-forest-500 mb-3" size={48} />
              <p className="font-display text-xl font-bold text-ink">Thank you!</p>
              <p className="text-ink/60 text-sm mt-1">{status.text}</p>
              <button onClick={() => setStatus({ type: '', text: '' })} className="btn-outline mt-6">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {status.type === 'error' && (
                <p className="bg-chili-500/10 text-chili-600 text-sm rounded-xl px-4 py-2.5">
                  {status.text}
                </p>
              )}
              {fields.map(({ key, label, icon: Icon, placeholder, type }) => (
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
                <label className="text-sm font-semibold text-ink/70">Message</label>
                <div className="relative mt-1">
                  <MessageSquare size={18} className="absolute left-3.5 top-3 text-ink/30" />
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={handleChange('message')}
                    className="w-full rounded-xl border border-forest-100 bg-mint/50 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>
                {errors.message && <p className="text-chili-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
