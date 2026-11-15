import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  uploadProductImage,
  getCategories,
} from "@/api/adminAPI";
import axiosInstance from "@/api/axiosInstance";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

const AdminProductEditPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    brand: "",
    category: "",
    countInStock: "",
    description: "",
  });

  // Load available categories and existing product details (if editing)
  useEffect(() => {
    const init = async () => {
      try {
        const catData = await getCategories();
        setCategories(catData || []);

        if (isEditMode) {
          const { data: prod } = await axiosInstance.get(`/products/${id}`);
          setFormData({
            name: prod.name || "",
            price: prod.price ?? "",
            image: prod.image || "",
            brand: prod.brand || "",
            category: prod.category || "",
            countInStock: prod.countInStock ?? "",
            description: prod.description || "",
          });
        }
      } catch (err) {
        toast.error("Failed to load initial data");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Direct Cloudinary upload handler
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    try {
      setUploadingImage(true);
      const res = await uploadProductImage(file);
      setFormData((prev) => ({ ...prev, image: res.imageUrl }));
      toast.success("Image uploaded to Cloudinary successfully!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.image.trim() || formData.price === "") {
      toast.error("Name, Price, and Image are required");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        price: Number(formData.price),
        countInStock: Number(formData.countInStock) || 0,
      };

      if (isEditMode) {
        await updateProduct(id, payload);
        toast.success("Product updated successfully");
      } else {
        await createProduct(payload);
        toast.success("Product created successfully");
      }

      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-12 text-center text-sm text-gray-500">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 mb-6 font-medium"
      >
        <ArrowLeft size={15} /> Back to Products
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {isEditMode ? "Edit Product" : "Create New Product"}
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          Fill in the details below to update your store catalog.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Title *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Noise-Cancelling Headphones"
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          {/* Price, Stock & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 1999"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Count In Stock *
              </label>
              <input
                type="number"
                name="countInStock"
                required
                min="0"
                value={formData.countInStock}
                onChange={handleChange}
                placeholder="e.g. 25"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Category
            </label>
            <div className="flex gap-2">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded px-3 py-2 text-xs bg-white focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
              <Link
                to="/admin/categories"
                className="px-3 py-2 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50 flex items-center"
              >
                + New
              </Link>
            </div>
          </div>

          {/* Cloudinary Image Upload & Preview */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Product Image *
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded border border-gray-300 transition">
                  <Upload size={14} />
                  {uploadingImage ? "Uploading to Cloudinary..." : "Upload from Computer"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-gray-400">or paste an image URL directly:</span>
              </div>

              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/... or image link"
                className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              />

              {/* Image Preview Box */}
              {formData.image && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-200">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-16 h-16 object-contain rounded border bg-white p-1"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="text-xs text-gray-600 truncate flex-1">
                    <p className="font-semibold text-gray-800">Image Preview</p>
                    <p className="text-[11px] text-gray-400 truncate">{formData.image}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Product overview, features, specifications..."
              className="w-full border border-gray-300 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-yellow-400 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Link
              to="/admin/products"
              className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving...
                </>
              ) : isEditMode ? (
                "Save Changes"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductEditPage;
