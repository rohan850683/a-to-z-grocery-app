import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Orders", path: "/admin/orders", icon: "🛒" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Coupons", path: "/admin/coupons", icon: "🏷️" },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
    { name: "Revenue", path: "/admin/revenue", icon: "💰" },
    { name: "Stock", path: "/admin/stock", icon: "📦" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActiveRoute = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col bg-green-700 text-white md:flex">
        <div className="border-b border-green-600 p-6">
          <h1 className="text-2xl font-bold">A to Z</h1>
          <p className="text-sm text-green-100">Admin Panel</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActiveRoute(item.path)
                  ? "bg-white font-semibold text-green-700"
                  : "text-white hover:bg-green-600"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-green-600 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-green-600"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 md:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-4 py-4 shadow-sm md:px-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Admin Dashboard
            </h2>

            <p className="text-sm text-gray-500">
              Manage your grocery store
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Store Manager</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 font-bold text-white">
              A
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        <div className="overflow-x-auto border-b bg-white p-3 md:hidden">
          <div className="flex min-w-max gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActiveRoute(item.path)
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            ))}
          </div>
        </div>

        <section className="p-4 md:p-6">{children}</section>
      </main>
    </div>
  );
}