import { useEffect, useRef, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import ProductCard from "@/components/ProductCard";
import { useSearch } from "@/context/SearchContext";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

const CATEGORIES = [
  "All",
  "Mobiles",
  "Electronics",
  "Fashion",
  "Home",
  "Appliances",
  "Books",
  "Beauty",
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sort, setSort] = useState("newest");

  const { searchTerm, setSearchTerm, category, setCategory } = useSearch();
  const productsRef = useRef(null);

  // Fetch paginated & filtered products from API
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (searchTerm.trim()) params.append("keyword", searchTerm.trim());
        if (category && category !== "All") params.append("category", category);
        if (sort) params.append("sort", sort);
        params.append("page", page.toString());
        params.append("limit", "10");

        const { data } = await axiosInstance.get(`/products/getProducts?${params.toString()}`);
        if (!isMounted) return;

        if (Array.isArray(data)) {
          setProducts(data);
          setPages(1);
          setTotalProducts(data.length);
        } else {
          setProducts(data.products || []);
          setPages(data.pages || 1);
          setTotalProducts(data.totalProducts || 0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [searchTerm, category, sort, page]);

  // Reset to page 1 whenever search, category, or sort changes
  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const scrollToProducts = () => {
    setTimeout(() => {
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <HomeBannerCarousel onShopNow={scrollToProducts} />

      <div ref={productsRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter & Sort Bar */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider flex items-center gap-1">
                <SlidersHorizontal size={14} /> Category:
              </span>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                    category.toLowerCase() === cat.toLowerCase()
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort & Results Count */}
            <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
              <span className="text-xs text-gray-500 font-medium">
                {totalProducts} {totalProducts === 1 ? "Product" : "Products"} found
              </span>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-xs font-medium text-gray-600">
                  Sort:
                </label>
                <select
                  id="sort-select"
                  value={sort}
                  onChange={handleSortChange}
                  className="text-xs border border-gray-300 rounded-md py-1.5 px-2 bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse">
                <div className="w-full h-48 bg-gray-200 mb-3 rounded"></div>
                <div className="h-4 bg-gray-200 mb-2 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 mb-2 rounded w-1/2"></div>
                <div className="h-8 bg-gray-300 rounded mt-4"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200 p-8">
            <p className="text-lg font-medium text-gray-700 mb-2">No products match your criteria</p>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your search terms or selecting a different category.
            </p>
            <button
              onClick={() => {
                setCategory("All");
                setSearchTerm("");
                setSort("newest");
                setPage(1);
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded text-sm font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => {
                    setPage((p) => Math.max(1, p - 1));
                    scrollToProducts();
                  }}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: pages }).map((_, i) => {
                    const pNum = i + 1;
                    return (
                      <button
                        key={pNum}
                        onClick={() => {
                          setPage(pNum);
                          scrollToProducts();
                        }}
                        className={`w-8 h-8 text-xs font-semibold rounded-md transition-colors ${
                          page === pNum
                            ? "bg-yellow-400 text-gray-900 border border-yellow-500"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => {
                    setPage((p) => Math.min(pages, p + 1));
                    scrollToProducts();
                  }}
                  disabled={page === pages}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
