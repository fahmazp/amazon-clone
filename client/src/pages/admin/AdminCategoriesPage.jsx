import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/adminAPI";
import {
  FolderTree,
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [creating, setCreating] = useState(false);

  // Inline editing state
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDesc, setEditingDesc] = useState("");

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data || []);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setCreating(true);
      const created = await createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDesc.trim(),
      });
      setCategories((prev) => [...prev, created]);
      setNewCategoryName("");
      setNewCategoryDesc("");
      toast.success("Category created successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create category");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditingName(cat.name);
    setEditingDesc(cat.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingDesc("");
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      const updated = await updateCategory(id, {
        name: editingName.trim(),
        description: editingDesc.trim(),
      });
      setCategories((prev) =>
        prev.map((c) => (c._id === id ? updated : c))
      );
      cancelEdit();
      toast.success("Category updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft size={15} /> Back to Products
      </Link>

      <div className="border-b pb-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderTree className="text-yellow-500" /> Category Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize products by creating and managing catalog categories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* New Category Form */}
        <div className="md:col-span-1">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm sticky top-6">
            <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
              <Plus size={16} /> Add New Category
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Footwear"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional brief description"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded text-xs font-semibold transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : "Save Category"}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Categories Table */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="bg-white p-8 rounded-lg border text-center text-xs text-gray-500">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border text-center text-xs text-gray-500">
              No custom categories created yet. Use the form to add one.
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => {
                    const isEditing = editingId === cat._id;

                    return (
                      <tr key={cat._id} className="hover:bg-gray-50/80 transition">
                        <td className="py-3 px-4 font-semibold text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                            />
                          ) : (
                            cat.name
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-500">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editingDesc}
                              onChange={(e) => setEditingDesc(e.target.value)}
                              className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                            />
                          ) : (
                            cat.description || "—"
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEdit(cat._id)}
                                  className="p-1 text-green-600 hover:text-green-800"
                                  title="Save"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                  title="Cancel"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(cat)}
                                  className="p-1 text-blue-600 hover:text-blue-800"
                                  title="Edit"
                                >
                                  <Edit3 size={15} />
                                </button>
                                <button
                                  onClick={() => handleDelete(cat._id, cat.name)}
                                  className="p-1 text-red-500 hover:text-red-700"
                                  title="Delete"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </>
                            )}
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
  );
};

export default AdminCategoriesPage;
