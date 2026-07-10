import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "📊",
      path: "/admin",
    },
    {
      name: "Products",
      icon: "📦",
      path: "/admin/products",
    },
    {
      name: "Orders",
      icon: "📋",
      path: "/admin/orders",
    },
    {
      name: "Users",
      icon: "👥",
      path: "/admin/users",
    },
    {
      name: "Analytics",
      icon: "📈",
      path: "/admin/analytics",
    },
    {
      name: "Revenue",
      icon: "💰",
      path: "/admin/revenue",
    },
    {
      name: "Stock",
      icon: "📦",
      path: "/admin/stock",
    },
    {
      name: "Settings",
      icon: "⚙",
      path: "/admin/settings",
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-green-700 text-white p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-10">A to Z Admin</h2>

      <ul className="space-y-3 text-lg">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`block px-4 py-3 rounded-xl transition ${
                isActive(item.path)
                  ? "bg-yellow-300 text-green-900 font-bold"
                  : "hover:bg-green-800 hover:text-yellow-300"
              }`}
            >
              {item.icon} {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}