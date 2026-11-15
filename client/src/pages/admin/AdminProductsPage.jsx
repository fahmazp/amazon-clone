import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAdminProducts,
  deleteProduct,
} from "@/api/adminAPI";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FolderTree,
  AlertCircle,
  Package,
} from "lucide-react";
import { toast } from "sonner";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async (search = "") => {
    try {
      setLoading(true);
      const data = await getAdminProducts(search, 1, 100);
      setProducts(data.products || (Array.isArray(data) ? data : []));
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts(searchTerm);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="text-yellow-500" /> Product Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Create, view, update, and remove products from your catalog.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/categories"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition shadow-sm"
          >
            <FolderTree size={15} /> Categories
          </Link>
          <Link
            to="/admin/product/new"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded transition shadow-sm"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-gray-200 mb-6 shadow-sm flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative flex items-center">
          <input
            type="text"
            placeholder="Search products by title or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-yellow-400 focus:outline-none"
          />
          <Search size={15} className="absolute left-2.5 text-gray-400" />
          <button
            type="submit"
            className="ml-2 px-3 py-1.5 bg-gray-900 text-white rounded text-xs font-medium hover:bg-gray-800"
          >
            Filter
          </button>
        </form>

        <span className="text-xs text-gray-500 font-medium hidden sm:inline">
          {products.length} Products listed
        </span>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-sm text-gray-500">
          Loading products...
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <AlertCircle size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm font-semibold text-gray-800">No products found</p>
          <p className="text-xs text-gray-500 mt-1 mb-4">
            Try adjusting your search or add your first product.
          </p>
          <Link
            to="/admin/product/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded"
          >
            <Plus size={15} /> Add Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/80 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        className="w-10 h-10 object-contain rounded border bg-gray-50 p-0.5"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate max-w-xs" title={product.name}>
                          {product.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Brand: {product.brand || "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium">
                      {product.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-900">
                    ₹{product.price}
                  </td>
                  <td className="py-3 px-4">
                    {product.countInStock > 0 ? (
                      <span className="text-green-700 font-medium">
                        {product.countInStock} in stock
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition"
                        title="Edit product"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id, product.name)}
                        disabled={deletingId === product._id}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition disabled:opacity-50"
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
