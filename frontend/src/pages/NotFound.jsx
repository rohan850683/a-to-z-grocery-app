import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-app py-24 text-center">
      <p className="text-7xl mb-4">🥕</p>
      <h1 className="font-display text-3xl font-bold text-ink">Page not found</h1>
      <p className="text-ink/50 mt-2">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary inline-block mt-6">Back to Home</Link>
    </div>
  );
}
