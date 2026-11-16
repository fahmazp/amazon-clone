import { useState } from "react";
import { MapPin, Search, ShoppingCart, Menu, X, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";
import HeaderLogo from "../assets/images/applogo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, category, setCategory } = useSearch();
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav className="w-full text-white">
      {/* Desktop Navigation */}
      <div className="bg-[#131921] flex-col hidden md:flex">
        <div className="flex items-center justify-between xl:justify-around gap-2 px-4 py-2">
          {/* Logo */}
          <div className="mr-3">
            <Link to="/">
              <img
                src={HeaderLogo}
                alt="QuickStore"
                className="w-24 lg:w-28 object-contain"
              />
            </Link>
          </div>

          {/* Delivery Location Mock */}
          <div className="flex items-center mr-2 hover:underline cursor-pointer">
            <MapPin className="mr-1 w-4 h-4 text-gray-300" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] text-gray-400">Delivering to</span>
              <span className="text-xs font-semibold -mt-0.5">Calicut,India</span>
            </div>
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 sm:max-w-[320px] lg:max-w-[520px] mx-2 rounded-md overflow-hidden bg-white shadow-sm border border-gray-300 focus-within:ring-2 focus-within:ring-yellow-400 transition"
          >
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-2 py-2 text-xs font-semibold text-gray-800 bg-zinc-200 border-r border-gray-300 shadow-inner outline-none cursor-pointer hover:bg-zinc-300 focus:bg-zinc-300 transition"
            >
              <option>All</option>
              <option>Mobiles</option>
              <option>Electronics</option>
              <option>Fashion</option>
              <option>Home</option>
              <option>Appliances</option>
              <option>Books</option>
              <option>Beauty</option>
            </select>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 text-xs text-black placeholder:text-gray-500 outline-none"
              placeholder="Search products..."
            />

            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 px-3 flex items-center justify-center transition"
            >
              <Search className="w-4 h-4 text-black" />
            </button>
          </form>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col mx-2 cursor-pointer hover:border hover:border-white p-1 rounded transition">
                <span className="text-xs text-gray-300">
                  Hello, {user ? <strong>{user.name?.split(" ")[0]}</strong> : "Sign In"}
                </span>
                <span className="font-bold -mt-1 text-sm flex items-center gap-1">
                  Account &amp; Lists
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-gray-800 rounded shadow-lg p-2 z-50 min-w-[150px] border border-gray-200">
              {user ? (
                <>
                  <div className="px-2 py-1.5 text-xs text-gray-500 border-b border-gray-100 mb-1">
                    Signed in as <span className="font-medium text-gray-800">{user.email}</span>
                  </div>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/products"
                        className="w-full flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 py-1"
                      >
                        <Shield size={14} /> Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/my-orders" className="w-full block text-xs hover:text-gray-900 py-1">
                      Your Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button
                      onClick={logout}
                      className="w-full text-left block text-xs text-red-600 hover:text-red-700 py-1"
                    >
                      Sign Out
                    </button>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/login"
                      className="w-full block text-center bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-xs py-1.5 rounded mb-1"
                    >
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <div className="text-[11px] text-center text-gray-500">
                    New customer?{" "}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                      Start here.
                    </Link>
                  </div>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart Icon & Counter */}
          <div className="relative flex items-center mx-2 cursor-pointer hover:border hover:border-white p-1 rounded transition">
            <Link to="/cart" className="flex items-center gap-1">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 lg:w-7 lg:h-7" />
                <span className="absolute -top-1.5 -right-2 bg-yellow-400 text-black text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow">
                  {cartCount}
                </span>
              </div>
              <span className="ml-1 font-bold text-xs mt-1">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="bg-[#131921] flex md:hidden items-center justify-between px-4 py-2.5">
        <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/">
          <img src={HeaderLogo} alt="Logo" className="w-24 object-contain" />
        </Link>

        <Link to="/cart" className="relative p-1">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded-full">
            {cartCount}
          </span>
        </Link>
      </div>

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#232F3E] text-white p-4 flex flex-col space-y-4 animate-slideDown border-t border-gray-700">
          <form
            onSubmit={handleSearch}
            className="flex text-sm rounded bg-white overflow-hidden shadow-sm"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 text-black text-xs outline-none"
              placeholder="Search products..."
            />
            <button type="submit" className="bg-yellow-400 hover:bg-yellow-500 p-2">
              <Search className="text-black w-4 h-4" />
            </button>
          </form>

          <div className="flex flex-col space-y-2.5 text-sm pt-2">
            {user ? (
              <>
                <div className="text-xs text-gray-300 pb-1 border-b border-gray-600">
                  Hello, <span className="font-semibold text-white">{user.name}</span>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin/products"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-1.5 text-amber-400 font-semibold"
                  >
                    <Shield size={16} /> Admin Dashboard
                  </Link>
                )}
                <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
                  Your Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-left text-red-400 hover:text-red-300"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-yellow-400 text-black font-semibold text-center py-2 rounded"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="text-center text-xs text-gray-300"
                >
                  Don't have an account? Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
