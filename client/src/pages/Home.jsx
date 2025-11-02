import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { searchTerm, category } = useSearch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/products/getProducts");
        setProducts(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false)
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let updated = [...products];

    if (category !== "All") {
      updated = updated.filter(
        (p) =>
          p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(updated);
  }, [searchTerm, category, products]);

  return (
    <>
      <HomeBannerCarousel />

      <div className="max-w-7xl mx-auto px-6 py-6">

       {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="w-full h-56 bg-gray-200 mb-3 rounded"></div>
              <div className="h-4 bg-gray-200 mb-2 rounded"></div>
              <div className="h-3 bg-gray-200 mb-2 rounded w-2/3"></div>
              <div className="h-6 bg-gray-300 rounded mt-3"></div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
          <p className="text-gray-500">No products found</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
