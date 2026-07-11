import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Password reset link is invalid.");
      return;
    }

    if (!formData.password || !formData.confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        `/auth/reset-password/${token}`,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );

      setMessage(
        response.data.message ||
          "Password reset successfully."
      );

      setFormData({
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Password reset successfully. Login with your new password.",
          },
        });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed. The link may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
            🔑
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Create New Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Enter a new secure password for your A to Z Grocery account.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-green-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                autoComplete="new-password"
                disabled={loading}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword((previous) => !previous)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-green-600"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600">
            Password must contain at least 6 characters.
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(message)}
            className="w-full rounded-xl bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
          >
            {loading ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-semibold text-green-600 hover:text-green-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}
