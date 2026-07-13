import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import AdminLayout from "../components/AdminLayout";

const initialForm = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: "",
  minimumOrderAmount: "",
  maximumDiscountAmount: "",
  usageLimit: "",
  perUserLimit: "1",
  startDate: "",
  expiryDate: "",
  isActive: true,
};

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split("T")[0];
  };

  const formatDisplayDate = (dateValue) => {
    if (!dateValue) return "Not set";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getCoupons = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/coupons");

      setCoupons(response.data.coupons || []);
    } catch (err) {
      console.error("Fetch coupons error:", err);

      setError(
        err.response?.data?.message ||
          "Coupons load nahi ho paaye. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  useEffect(() => {
    if (!message && !error) return;

    const timer = setTimeout(() => {
      setMessage("");
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [message, error]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingCouponId(null);
  };

  const validateForm = () => {
    if (!formData.code.trim()) {
      return "Coupon code enter karo.";
    }

    if (!formData.discountValue) {
      return "Discount value enter karo.";
    }

    if (Number(formData.discountValue) <= 0) {
      return "Discount value 0 se greater honi chahiye.";
    }

    if (
      formData.discountType === "percentage" &&
      Number(formData.discountValue) > 100
    ) {
      return "Percentage discount 100% se zyada nahi ho sakta.";
    }

    if (!formData.expiryDate) {
      return "Expiry date select karo.";
    }

    if (
      formData.startDate &&
      new Date(formData.expiryDate) < new Date(formData.startDate)
    ) {
      return "Expiry date, start date se pehle nahi ho sakti.";
    }

    if (
      formData.minimumOrderAmount &&
      Number(formData.minimumOrderAmount) < 0
    ) {
      return "Minimum order amount negative nahi ho sakta.";
    }

    if (
      formData.maximumDiscountAmount &&
      Number(formData.maximumDiscountAmount) < 0
    ) {
      return "Maximum discount negative nahi ho sakta.";
    }

    if (formData.usageLimit && Number(formData.usageLimit) < 1) {
      return "Usage limit kam se kam 1 honi chahiye.";
    }

    if (Number(formData.perUserLimit) < 1) {
      return "Per-user limit kam se kam 1 honi chahiye.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    const payload = {
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      minimumOrderAmount:
        formData.minimumOrderAmount === ""
          ? 0
          : Number(formData.minimumOrderAmount),
      maximumDiscountAmount:
        formData.maximumDiscountAmount === ""
          ? null
          : Number(formData.maximumDiscountAmount),
      usageLimit:
        formData.usageLimit === ""
          ? null
          : Number(formData.usageLimit),
      perUserLimit: Number(formData.perUserLimit) || 1,
      startDate: formData.startDate || undefined,
      expiryDate: formData.expiryDate,
      isActive: formData.isActive,
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingCouponId) {
        await api.put(`/coupons/${editingCouponId}`, payload);

        setMessage("Coupon successfully update ho gaya.");
      } else {
        await api.post("/coupons", payload);

        setMessage("Coupon successfully create ho gaya.");
      }

      resetForm();
      await getCoupons();
    } catch (err) {
      console.error("Save coupon error:", err);

      setError(
        err.response?.data?.message ||
          "Coupon save nahi ho paaya. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCouponId(coupon._id);

    setFormData({
      code: coupon.code || "",
      description: coupon.description || "",
      discountType: coupon.discountType || "percentage",
      discountValue:
        coupon.discountValue !== undefined
          ? String(coupon.discountValue)
          : "",
      minimumOrderAmount:
        coupon.minimumOrderAmount !== undefined
          ? String(coupon.minimumOrderAmount)
          : "",
      maximumDiscountAmount:
        coupon.maximumDiscountAmount !== null &&
        coupon.maximumDiscountAmount !== undefined
          ? String(coupon.maximumDiscountAmount)
          : "",
      usageLimit:
        coupon.usageLimit !== null && coupon.usageLimit !== undefined
          ? String(coupon.usageLimit)
          : "",
      perUserLimit:
        coupon.perUserLimit !== undefined
          ? String(coupon.perUserLimit)
          : "1",
      startDate: formatDateForInput(coupon.startDate),
      expiryDate: formatDateForInput(coupon.expiryDate),
      isActive: coupon.isActive !== false,
    });

    setError("");
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (couponId, couponCode) => {
    const confirmDelete = window.confirm(
      `Kya aap "${couponCode}" coupon delete karna chahte hain?`
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(couponId);
      setError("");
      setMessage("");

      await api.delete(`/coupons/${couponId}`);

      setCoupons((previousCoupons) =>
        previousCoupons.filter((coupon) => coupon._id !== couponId)
      );

      if (editingCouponId === couponId) {
        resetForm();
      }

      setMessage("Coupon successfully delete ho gaya.");
    } catch (err) {
      console.error("Delete coupon error:", err);

      setError(
        err.response?.data?.message ||
          "Coupon delete nahi ho paaya. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const toggleCouponStatus = async (coupon) => {
    try {
      setError("");
      setMessage("");

      const response = await api.put(`/coupons/${coupon._id}`, {
        isActive: !coupon.isActive,
      });

      const updatedCoupon = response.data.coupon;

      setCoupons((previousCoupons) =>
        previousCoupons.map((item) =>
          item._id === coupon._id ? updatedCoupon : item
        )
      );

      setMessage(
        `Coupon ${updatedCoupon.isActive ? "activate" : "deactivate"} ho gaya.`
      );
    } catch (err) {
      console.error("Toggle coupon error:", err);

      setError(
        err.response?.data?.message ||
          "Coupon status update nahi ho paaya."
      );
    }
  };

  const filteredCoupons = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return coupons;

    return coupons.filter((coupon) => {
      const code = coupon.code?.toLowerCase() || "";
      const description = coupon.description?.toLowerCase() || "";

      return code.includes(search) || description.includes(search);
    });
  }, [coupons, searchTerm]);


  const getCouponStatus = (coupon) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = coupon.startDate
    ? new Date(coupon.startDate)
    : null;

  const expiryDate = coupon.expiryDate
    ? new Date(coupon.expiryDate)
    : null;

  if (startDate) {
    startDate.setHours(0, 0, 0, 0);
  }

  if (expiryDate) {
    expiryDate.setHours(23, 59, 59, 999);
  }

  if (!coupon.isActive) {
    return {
      label: "Inactive",
      classes: "bg-gray-100 text-gray-700",
    };
  }

  if (startDate && today < startDate) {
    return {
      label: "Upcoming",
      classes: "bg-blue-100 text-blue-700",
    };
  }

  if (expiryDate && today > expiryDate) {
    return {
      label: "Expired",
      classes: "bg-red-100 text-red-700",
    };
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    Number(coupon.usedCount || 0) >= Number(coupon.usageLimit)
  ) {
    return {
      label: "Limit Reached",
      classes: "bg-orange-100 text-orange-700",
    };
  }

  return {
    label: "Active",
    classes: "bg-green-100 text-green-700",
  };
};

  const activeCouponsCount = coupons.filter(
    (coupon) => getCouponStatus(coupon).label === "Active"
  ).length;

  const expiredCouponsCount = coupons.filter(
    (coupon) => getCouponStatus(coupon).label === "Expired"
  ).length;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Coupon Management
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Create, update, activate and delete discount coupons.
            </p>
          </div>

          {message && (
            <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              ✅ {message}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              ❌ {error}
            </div>
          )}

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Coupons</p>

              <p className="mt-2 text-3xl font-bold text-gray-900">
                {coupons.length}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Active Coupons</p>

              <p className="mt-2 text-3xl font-bold text-green-600">
                {activeCouponsCount}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Expired Coupons</p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {expiredCouponsCount}
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">Total Uses</p>

              <p className="mt-2 text-3xl font-bold text-purple-600">
                {coupons.reduce(
                  (total, coupon) => total + (coupon.usedCount || 0),
                  0
                )}
              </p>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
            <div className="h-fit rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingCouponId ? "Edit Coupon" : "Create Coupon"}
                </h2>

                {editingCouponId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="code"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Coupon Code *
                  </label>

                  <input
                    id="code"
                    name="code"
                    type="text"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Example: SAVE20"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 uppercase outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Coupon description"
                    rows="3"
                    className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="discountType"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Discount Type *
                  </label>

                  <select
                    id="discountType"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="discountValue"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Discount Value *
                  </label>

                  <input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    min="1"
                    max={
                      formData.discountType === "percentage"
                        ? "100"
                        : undefined
                    }
                    value={formData.discountValue}
                    onChange={handleChange}
                    placeholder={
                      formData.discountType === "percentage"
                        ? "Example: 20"
                        : "Example: 100"
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="minimumOrderAmount"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Minimum Order Amount
                  </label>

                  <input
                    id="minimumOrderAmount"
                    name="minimumOrderAmount"
                    type="number"
                    min="0"
                    value={formData.minimumOrderAmount}
                    onChange={handleChange}
                    placeholder="Example: 500"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {formData.discountType === "percentage" && (
                  <div>
                    <label
                      htmlFor="maximumDiscountAmount"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Maximum Discount Amount
                    </label>

                    <input
                      id="maximumDiscountAmount"
                      name="maximumDiscountAmount"
                      type="number"
                      min="0"
                      value={formData.maximumDiscountAmount}
                      onChange={handleChange}
                      placeholder="Example: 200"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="usageLimit"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Total Usage Limit
                    </label>

                    <input
                      id="usageLimit"
                      name="usageLimit"
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={handleChange}
                      placeholder="Unlimited"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="perUserLimit"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Per User Limit
                    </label>

                    <input
                      id="perUserLimit"
                      name="perUserLimit"
                      type="number"
                      min="1"
                      value={formData.perUserLimit}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>

                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="expiryDate"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Expiry Date *
                    </label>

                    <input
                      id="expiryDate"
                      name="expiryDate"
                      type="date"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                </div>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-50 p-3">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-green-600"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Coupon active rakho
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-green-600 px-4 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                >
                  {saving
                    ? "Saving..."
                    : editingCouponId
                    ? "Update Coupon"
                    : "Create Coupon"}
                </button>
              </form>
            </div>

            <div className="overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    All Coupons
                  </h2>

                  <p className="text-sm text-gray-500">
                    {filteredCoupons.length} coupon found
                  </p>
                </div>

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search coupon..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-64"
                />
              </div>

              {loading ? (
                <div className="p-10 text-center text-gray-500">
                  Coupons loading...
                </div>
              ) : filteredCoupons.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mb-2 text-4xl">🏷️</div>

                  <p className="font-medium text-gray-700">
                    Koi coupon nahi mila
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Left form se apna pehla coupon create karo.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <th className="px-5 py-3">Coupon</th>
                        <th className="px-5 py-3">Discount</th>
                        <th className="px-5 py-3">Minimum Order</th>
                        <th className="px-5 py-3">Usage</th>
                        <th className="px-5 py-3">Expiry</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {filteredCoupons.map((coupon) => {
                        const status = getCouponStatus(coupon);

                        return (
                          <tr
                            key={coupon._id}
                            className="transition hover:bg-gray-50"
                          >
                            <td className="px-5 py-4">
                              <p className="font-bold text-gray-900">
                                {coupon.code}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-xs text-gray-500">
                                {coupon.description || "No description"}
                              </p>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              <p className="font-semibold text-green-600">
                                {coupon.discountType === "percentage"
                                  ? `${coupon.discountValue}% OFF`
                                  : `₹${coupon.discountValue} OFF`}
                              </p>

                              {coupon.maximumDiscountAmount !== null &&
                                coupon.maximumDiscountAmount !== undefined && (
                                  <p className="mt-1 text-xs text-gray-500">
                                    Max ₹{coupon.maximumDiscountAmount}
                                  </p>
                                )}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                              ₹{coupon.minimumOrderAmount || 0}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                              {coupon.usedCount || 0}
                              {" / "}
                              {coupon.usageLimit ?? "∞"}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                              {formatDisplayDate(coupon.expiryDate)}
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              <button
                                type="button"
                                onClick={() => toggleCouponStatus(coupon)}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${status.classes}`}
                              >
                                {status.label}
                              </button>
                            </td>

                            <td className="whitespace-nowrap px-5 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleEdit(coupon)}
                                  className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  disabled={deletingId === coupon._id}
                                  onClick={() =>
                                    handleDelete(coupon._id, coupon.code)
                                  }
                                  className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {deletingId === coupon._id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCoupons;