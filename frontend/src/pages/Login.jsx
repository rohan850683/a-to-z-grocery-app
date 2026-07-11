import { useState } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = "Enter a valid email address";
    }

    if (form.password.length < 6) {
      errs.password =
        "Password must be at least 6 characters";
    }

    setErrors(errs);

    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");

    if (!validate()) return;

    setLoading(true);

    try {
      await login(
        form.email.trim().toLowerCase(),
        form.password
      );

      navigate(
        location.state?.from?.pathname || "/"
      );
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app flex justify-center py-12">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-14 w-14 rotate-3 items-center justify-center rounded-2xl bg-forest-500 font-display text-xl font-bold text-white">
            AZ
          </div>

          <h1 className="mt-4 font-display text-2xl font-bold text-ink">
            Welcome back
          </h1>

          <p className="mt-1 text-sm text-ink/50">
            Log in to continue shopping fresh with
            A to Z
          </p>
        </div>

        {location.state?.message && (
          <p className="mb-4 rounded-xl bg-forest-500/10 px-4 py-2.5 text-sm text-forest-700">
            {location.state.message}
          </p>
        )}

        {serverError && (
          <p className="mb-4 rounded-xl bg-chili-500/10 px-4 py-2.5 text-sm text-chili-600">
            {serverError}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-ink/70"
            >
              Email
            </label>

            <div className="relative mt-1">
              <Mail
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30"
              />

              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => {
                  setForm({
                    ...form,
                    email: e.target.value,
                  });

                  setErrors((previous) => ({
                    ...previous,
                    email: "",
                  }));

                  setServerError("");
                }}
                className="w-full rounded-xl border border-forest-100 bg-mint/50 py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {errors.email && (
              <p className="mt-1 text-xs text-chili-500">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-ink/70"
            >
              Password
            </label>

            <div className="relative mt-1">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/30"
              />

              <input
                id="password"
                type={
                  showPass ? "text" : "password"
                }
                value={form.password}
                onChange={(e) => {
                  setForm({
                    ...form,
                    password: e.target.value,
                  });

                  setErrors((previous) => ({
                    ...previous,
                    password: "",
                  }));

                  setServerError("");
                }}
                className="w-full rounded-xl border border-forest-100 bg-mint/50 py-2.5 pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-forest-300"
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPass(
                    (previous) => !previous
                  )
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/30 transition hover:text-forest-600"
                aria-label={
                  showPass
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPass ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-1 text-xs text-chili-500">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-forest-600 transition hover:text-forest-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Logging in..."
              : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          New to A to Z?{" "}
          <Link
            to="/signup"
            className="font-semibold text-forest-600 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
