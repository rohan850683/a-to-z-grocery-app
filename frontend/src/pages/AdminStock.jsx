import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { getAllProducts } from "../services/productService";

export default function AdminStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Stock Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalProducts = products.length;
  const inStock = products.filter((p) => Number(p.stock) > 5).length;
  const lowStock = products.filter(
    (p) => Number(p.stock) > 0 && Number(p.stock) <= 5
  ).length;
  const outOfStock = products.filter((p) => Number(p.stock) <= 0).length;

  const getStockBadge = (stock) => {
    const value = Number(stock);

    if (value <= 0) {
      return (
        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
          Out of Stock
        </span>
      );
    }

    if (value <= 5) {
      return (
        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
          Low Stock
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
        In Stock
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <h1 className="text-2xl font-bold text-green-700">
            Loading Stock...
          </h1>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-2 md:p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">📦 Stock Management</h1>
          <p className="text-gray-500 mt-2">
            Track product stock and inventory alerts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Total Products</p>
            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalProducts}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">In Stock</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {inStock}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Low Stock</p>
            <h2 className="text-3xl font-bold text-yellow-600 mt-2">
              {lowStock}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Out of Stock</p>
            <h2 className="text-3xl font-bold text-red-600 mt-2">
              {outOfStock}
            </h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Inventory List</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Unit</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="border-t hover:bg-gray-50">
                      <td className="p-4 font-semibold">{product.name}</td>
                      <td className="p-4 capitalize">{product.category}</td>
                      <td className="p-4">{product.unit || "pcs"}</td>
                      <td className="p-4 font-bold">{product.stock || 0}</td>
                      <td className="p-4">{getStockBadge(product.stock)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-6 text-center text-gray-500" colSpan="5">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}