import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "A to Z Grocery",
    storeEmail: "support@atoz.com",
    storePhone: "+91 98765 43210",
    storeAddress: "Faridabad, Haryana",
    deliveryCharge: 30,
    freeDeliveryAbove: 499,
    minimumOrderAmount: 99,
    deliveryTime: "10-20 minutes",
    codEnabled: true,
    onlinePaymentEnabled: false,
    maintenanceMode: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();

    localStorage.setItem("adminStoreSettings", JSON.stringify(settings));

    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    const defaultSettings = {
      storeName: "A to Z Grocery",
      storeEmail: "support@atoz.com",
      storePhone: "+91 98765 43210",
      storeAddress: "Faridabad, Haryana",
      deliveryCharge: 30,
      freeDeliveryAbove: 499,
      minimumOrderAmount: 99,
      deliveryTime: "10-20 minutes",
      codEnabled: true,
      onlinePaymentEnabled: false,
      maintenanceMode: false,
    };

    setSettings(defaultSettings);
    localStorage.setItem("adminStoreSettings", JSON.stringify(defaultSettings));
    alert("Settings reset successfully!");
  };

  return (
    <AdminLayout>
      <div className="p-2 md:p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">⚙️ Settings</h1>
          <p className="text-gray-500 mt-2">
            Manage store information, delivery rules and payment options.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">🏪 Store Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Store Name
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Store Email
                </label>
                <input
                  type="email"
                  name="storeEmail"
                  value={settings.storeEmail}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Store Phone
                </label>
                <input
                  type="text"
                  name="storePhone"
                  value={settings.storePhone}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Store Address
                </label>
                <input
                  type="text"
                  name="storeAddress"
                  value={settings.storeAddress}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">🚚 Delivery Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Delivery Charge ₹
                </label>
                <input
                  type="number"
                  name="deliveryCharge"
                  value={settings.deliveryCharge}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Free Delivery Above ₹
                </label>
                <input
                  type="number"
                  name="freeDeliveryAbove"
                  value={settings.freeDeliveryAbove}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Minimum Order Amount ₹
                </label>
                <input
                  type="number"
                  name="minimumOrderAmount"
                  value={settings.minimumOrderAmount}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Delivery Time
                </label>
                <input
                  type="text"
                  name="deliveryTime"
                  value={settings.deliveryTime}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-5">💳 Payment & App Options</h2>

            <div className="space-y-4">
              <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
                <div>
                  <p className="font-semibold">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">
                    Allow customers to place COD orders.
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="codEnabled"
                  checked={settings.codEnabled}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
                <div>
                  <p className="font-semibold">Online Payment</p>
                  <p className="text-sm text-gray-500">
                    Enable Razorpay/Stripe payment option later.
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="onlinePaymentEnabled"
                  checked={settings.onlinePaymentEnabled}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
              </label>

              <label className="flex items-center justify-between border rounded-xl p-4 cursor-pointer">
                <div>
                  <p className="font-semibold">Maintenance Mode</p>
                  <p className="text-sm text-gray-500">
                    Temporarily show app under maintenance.
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border font-semibold hover:bg-gray-100"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}