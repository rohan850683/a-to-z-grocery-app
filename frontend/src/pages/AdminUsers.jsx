import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Users,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  deleteUser,
  getAllUsers,
  updateUserRole,
} from "../services/userService";

import { useAuth } from "../context/AuthContext.jsx";

export default function AdminUsers() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState("");
  const [deletingUserId, setDeletingUserId] = useState("");
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);

      setError(
        error.response?.data?.message ||
          "Users load nahi ho paaye."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((item) => {
      return (
        item.name?.toLowerCase().includes(keyword) ||
        item.email?.toLowerCase().includes(keyword) ||
        item.phone?.toLowerCase().includes(keyword) ||
        item.mobile?.toLowerCase().includes(keyword) ||
        item.role?.toLowerCase().includes(keyword)
      );
    });
  }, [users, search]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingUserId(userId);

      await updateUserRole(userId, newRole);

      setUsers((currentUsers) =>
        currentUsers.map((item) =>
          item._id === userId
            ? { ...item, role: newRole }
            : item
        )
      );

      alert("User role updated successfully");
    } catch (error) {
      console.error("Update Role Error:", error);

      alert(
        error.response?.data?.message ||
          "Role update nahi ho paaya"
      );

      fetchUsers();
    } finally {
      setUpdatingUserId("");
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingUserId(userId);

      await deleteUser(userId);

      setUsers((currentUsers) =>
        currentUsers.filter((item) => item._id !== userId)
      );

      alert("User deleted successfully");
    } catch (error) {
      console.error("Delete User Error:", error);

      alert(
        error.response?.data?.message ||
          "User delete nahi ho paaya"
      );
    } finally {
      setDeletingUserId("");
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-12 text-center">
        <ShieldCheck
          size={48}
          className="mx-auto text-red-500"
        />

        <h1 className="mt-4 text-2xl font-bold text-red-600 md:text-3xl">
          Access Denied
        </h1>

        <p className="mt-2 text-sm text-red-500">
          Only an admin can open this page.
        </p>
      </div>
    );
  }

  return (
    <div className="min-w-0">
      {/* Page Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-900 md:text-3xl">
            <Users className="text-green-600" />
            Users Management
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage registered users and admin roles.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-600 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* Search and Count */}
      <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <p className="whitespace-nowrap text-sm font-semibold text-gray-500">
          {filteredUsers.length} user
          {filteredUsers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="p-10 text-center">
            <RefreshCw
              size={32}
              className="mx-auto animate-spin text-green-600"
            />

            <p className="mt-3 font-semibold text-green-700">
              Loading users...
            </p>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full text-left">
              <thead className="bg-green-700 text-white">
                <tr>
                  <th className="whitespace-nowrap p-4">
                    Name
                  </th>

                  <th className="whitespace-nowrap p-4">
                    Email
                  </th>

                  <th className="whitespace-nowrap p-4">
                    Phone
                  </th>

                  <th className="whitespace-nowrap p-4">
                    Role
                  </th>

                  <th className="whitespace-nowrap p-4">
                    Registered
                  </th>

                  <th className="whitespace-nowrap p-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((item) => {
                  const isCurrentUser =
                    item._id === user?._id;

                  const isUpdating =
                    updatingUserId === item._id;

                  const isDeleting =
                    deletingUserId === item._id;

                  return (
                    <tr
                      key={item._id}
                      className="border-b border-gray-100 transition last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 font-bold text-green-700">
                            {item.name?.[0]?.toUpperCase() ||
                              "U"}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              {item.name || "No Name"}
                            </p>

                            {isCurrentUser && (
                              <p className="text-xs font-semibold text-green-600">
                                Current account
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-sm text-gray-600">
                        <span className="break-all">
                          {item.email || "N/A"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap p-4 text-sm text-gray-600">
                        {item.phone ||
                          item.mobile ||
                          "N/A"}
                      </td>

                      <td className="p-4">
                        <select
                          value={item.role || "user"}
                          onChange={(event) =>
                            handleRoleChange(
                              item._id,
                              event.target.value
                            )
                          }
                          disabled={
                            isCurrentUser || isUpdating
                          }
                          className="w-full min-w-28 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold capitalize outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                        >
                          <option value="user">
                            User
                          </option>

                          <option value="admin">
                            Admin
                          </option>
                        </select>

                        {isUpdating && (
                          <p className="mt-1 text-xs text-gray-500">
                            Updating...
                          </p>
                        )}
                      </td>

                      <td className="whitespace-nowrap p-4 text-sm text-gray-600">
                        {item.createdAt
                          ? new Date(
                              item.createdAt
                            ).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : "N/A"}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(item._id)
                          }
                          disabled={
                            isCurrentUser || isDeleting
                          }
                          className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
                            isCurrentUser ||
                            isDeleting
                              ? "cursor-not-allowed bg-gray-400"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          <Trash2 size={16} />

                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <Users
              size={42}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-3 text-lg font-bold text-gray-700">
              No users found
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}