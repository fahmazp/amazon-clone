import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { searchTerm, category } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/products/getProducts");
        setProducts(data);
        setFiltered(data);
      } catch (error) {
        console.error("Error fetching products:", error);
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
        {/* <h2 className="text-xl font-bold mb-2">Products</h2> */}
        {filtered.length === 0 ? (
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
