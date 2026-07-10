import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteUser, getAllUsers, updateUserRole } from "../services/userService";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminUsers() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);
      alert("Users load nahi ho paaye");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((item) => {
      const keyword = search.toLowerCase();

      return (
        item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.role?.toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      alert("User role updated successfully");
      fetchUsers();
    } catch (error) {
      console.error("Update Role Error:", error);
      alert("Role update nahi ho paaya");
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    try {
      await deleteUser(userId);
      alert("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Delete User Error:", error);
      alert(error.response?.data?.message || "User delete nahi ho paaya");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="container-app py-24 text-center">
        <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
        <p className="mt-2">Only admin can open this page.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-green-700 text-white p-6">
        <h2 className="text-3xl font-bold mb-10">A to Z Admin</h2>

        <ul className="space-y-5 text-lg">
          <li>
            <Link
              to="/admin"
              className="block cursor-pointer hover:text-yellow-300"
            >
              📊 Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/admin/products"
              className="block cursor-pointer hover:text-yellow-300"
            >
              📦 Products
            </Link>
          </li>

          <li>
            <Link
              to="/admin/orders"
              className="block cursor-pointer hover:text-yellow-300"
            >
              📋 Orders
            </Link>
          </li>

          <li className="cursor-pointer text-yellow-300">👥 Users</li>
          <li className="cursor-pointer hover:text-yellow-300">📈 Analytics</li>
          <li className="cursor-pointer hover:text-yellow-300">💰 Revenue</li>
          <li className="cursor-pointer hover:text-yellow-300">📦 Stock</li>
          <li className="cursor-pointer hover:text-yellow-300">⚙ Settings</li>
        </ul>
      </div>

      <div className="flex-1 p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">👥 Users Management</h1>
            <p className="text-gray-500 mt-2">
              Manage all registered users and admin roles.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-green-700 font-bold text-xl">
              Loading users...
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Registered</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-semibold">
                        {item.name || "No Name"}
                      </td>

                      <td className="p-4 text-gray-600">{item.email}</td>

                      <td className="p-4">
                        <select
                          value={item.role || "user"}
                          onChange={(e) =>
                            handleRoleChange(item._id, e.target.value)
                          }
                          disabled={item._id === user?._id}
                          className="border rounded-lg px-3 py-2 outline-none"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      <td className="p-4 text-gray-600">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={item._id === user?._id}
                          className={`px-4 py-2 rounded-lg text-white ${
                            item._id === user?._id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-10 text-center text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}