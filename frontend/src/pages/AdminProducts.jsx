import { useEffect, useState } from "react";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";

const BASE_URL = "http://localhost:5000";

const categories = [
  { value: "fruits", label: "🍎 Fruits" },
  { value: "vegetables", label: "🥦 Vegetables" },
  { value: "dairy", label: "🥛 Dairy" },
  { value: "bakery", label: "📦 Bakery" },
  { value: "beverages", label: "🥤 Beverages" },
  { value: "snacks", label: "🍫 Snacks" },
  { value: "grocery", label: "🛒 Grocery" },
  { value: "meat-fish", label: "🍗 Meat & Fish" },
  { value: "frozen-food", label: "🍦 Frozen Food" },
  { value: "toys", label: "🧸 Toys" },
  { value: "pet-care", label: "🐶 Pet Care" },
  { value: "personal-care", label: "💄 Personal Care" },
  { value: "home-care", label: "🧹 Home Care" },
  { value: "health", label: "💊 Health" },
  { value: "flowers", label: "🌸 Flowers" },
  { value: "electronics", label: "⚡ Electronics" },
  { value: "mobile-accessories", label: "📱 Mobile Accessories" },
];

const units = ["kg", "g", "L", "ml", "pcs", "pack"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    quantity: "1",
    unit: "pcs",
    deliveryTime: "10 min",
    category: "",
    stock: "",
    description: "",
  });

  const getImageUrl = (image) => {
    if (!image) return "https://via.placeholder.com/300x200?text=No+Image";
    if (image.startsWith("http")) return image;
    return `${BASE_URL}${image}`;
  };

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.error(error);
      alert("Products load nahi ho paaye");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      discountPrice: "",
      quantity: "1",
      unit: "pcs",
      deliveryTime: "10 min",
      category: "",
      stock: "",
      description: "",
    });
    setImageFile(null);
    setEditingProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("discountPrice", formData.discountPrice);
    data.append("quantity", formData.quantity);
    data.append("unit", formData.unit);
    data.append("deliveryTime", formData.deliveryTime);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    data.append("description", formData.description);

    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      if (editingProductId) {
        await updateProduct(editingProductId, data);
        alert("Product Updated Successfully");
      } else {
        if (!imageFile) {
          alert("Please select product image");
          return;
        }

        await createProduct(data);
        alert("Product Added Successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Product save nahi ho paaya");
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);

    setFormData({
      name: product.name || "",
      price: product.price || "",
      discountPrice: product.discountPrice || "",
      quantity: product.quantity || "1",
      unit: product.unit || "pcs",
      deliveryTime: product.deliveryTime || "10 min",
      category: product.category || "",
      stock: product.stock || "",
      description: product.description || "",
    });

    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      alert("Product Deleted Successfully");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Product delete nahi ho paaya");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📦 Product Management</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="border p-3 rounded-lg"
          required
        />

        <input
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Original Price"
          type="number"
          className="border p-3 rounded-lg"
          required
        />

        <input
          name="discountPrice"
          value={formData.discountPrice}
          onChange={handleChange}
          placeholder="Discount Price"
          type="number"
          className="border p-3 rounded-lg"
        />

        <input
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity e.g. 1, 500, 6"
          type="text"
          className="border p-3 rounded-lg"
          required
        />

        <select
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          required
        >
          <option value="">Select Unit</option>
          {units.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>

        <input
          name="deliveryTime"
          value={formData.deliveryTime}
          onChange={handleChange}
          placeholder="Delivery Time e.g. 8 min"
          className="border p-3 rounded-lg"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 rounded-lg"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        <input
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          type="number"
          className="border p-3 rounded-lg"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border p-3 rounded-lg"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-3 rounded-lg md:col-span-2"
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
        >
          {editingProductId ? "Update Product" : "Add Product"}
        </button>

        {editingProductId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
          >
            Cancel Edit
          </button>
        )}
      </form>

      <h2 className="text-2xl font-bold mb-4">Product List</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow p-4 border hover:shadow-lg"
          >
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="h-40 w-full object-cover rounded-lg mb-4 bg-gray-100"
              onError={(e) => {
                e.currentTarget.src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />

            <h3 className="text-xl font-bold">{product.name}</h3>

            <p className="text-gray-600">Category: {product.category}</p>

            <p className="text-sm text-gray-500">
              Quantity: {product.quantity || "1"} {product.unit || "pcs"}
            </p>

            <div className="flex items-center gap-2">
              {product.discountPrice ? (
                <>
                  <p className="text-green-700 font-bold">
                    ₹{product.discountPrice}
                  </p>
                  <p className="text-gray-400 line-through text-sm">
                    ₹{product.price}
                  </p>
                </>
              ) : (
                <p className="text-green-700 font-bold">₹{product.price}</p>
              )}
            </div>

            <p className="text-sm text-gray-500">
              Delivery: {product.deliveryTime || "10 min"}
            </p>

            <p className="text-sm text-gray-500">Stock: {product.stock}</p>

            <p className="text-sm mt-2">{product.description}</p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(product)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}