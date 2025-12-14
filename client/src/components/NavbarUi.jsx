import { useState } from "react";
import { MapPin, Search, ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "@/context/SearchContext";
import { useAuth } from "@/context/AuthContext";
import HeaderLogo from '../assets/images/applogo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm, category, setCategory } = useSearch();
  const { logout } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <nav className="w-full text-white ">
      <div className="bg-[#131921] flex-col hidden md:flex">
        <div className="flex items-center justify-center xl:justify-around gap-1.5 px-2 py-2">
          <div className="mr-4">
            <Link to="/">
              <img
                src={HeaderLogo}
                alt="Logo"
                className="w-24 lg:w-26 object-contain"
              />
            </Link>
          </div>

          <div className="flex items-center mr-4 hover:underline cursor-pointer">
            <MapPin className="mr-0.5" />
            <div className="flex flex-col leading-tight">
              <span className="text-xs">Delivering to Calicut</span>
              <span className="text-xs font-semibold -mt-1">
                Update location
              </span>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex flex-1 sm:max-w-[300px] lg:max-w-[450px] text-sm mx-1.5 lg:mx-3 rounded-sm bg-gray-50 overflow-hidden"
          >
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-l-sm px-1 border-r text-black bg-[#C0CCCC] outline-none"
            >
              <option>All</option>
              <option>Electronics</option>
              <option>Mobiles</option>
              <option>Fashion</option>
              <option>Home</option>
            </select>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-2 py-2 text-black text-sm placeholder:text-gray-500 outline-none"
              placeholder="Search quickstore.in (Type and enter)"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 rounded-r p-2"
            >
              <Search className="text-black w-4 h-4" />
            </button>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col mx-2 cursor-pointer hover:underline">
                <span className="text-xs">Hello, sign in</span>
                <span className="font-bold -mt-1 text-sm">
                  Account &amp; Lists
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-100 text-black rounded shadow-lg p-2 z-50 min-w-[120px]">
              <DropdownMenuItem>
                <Link
                  to="/login"
                  className="w-full block text-xs hover:text-gray-700"
                >
                  Sign In
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to="/my-orders"
                  className="w-full block text-xs hover:text-gray-700"
                >
                  Your Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <button
                  onClick={logout}
                  className="w-full text-left block text-xs hover:text-gray-700"
                >
                  Sign Out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative flex items-center mx-2 cursor-pointer hover:underline">
            <Link to="/cart" className="flex items-center gap-1">
              <ShoppingCart className="w-6 h-6 lg:w-7 lg:h-7" />
              <span className="absolute top-0 left-5 bg-yellow-400 text-black text-xs px-1 rounded-full">
                0
              </span>
              <span className="ml-1 font-bold text-xs mt-1">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-[#131921] flex md:hidden items-center justify-between px-3 py-2">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link to="/">
          <img src={HeaderLogo} alt="Logo" className="w-24" />
        </Link>

        <Link to="/cart" className="relative">
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 left-4 bg-yellow-400 text-black text-xs px-1 rounded-full">
            0
          </span>
        </Link>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-[#232F3E] text-white p-3 flex flex-col space-y-4 animate-slideDown">
          <form
            onSubmit={handleSearch}
            className="flex text-sm rounded-sm bg-gray-50 overflow-hidden"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-2 py-2 text-black text-sm placeholder:text-gray-500 outline-none"
              placeholder="Search quickstore.in"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 rounded-r p-2"
            >
              <Search className="text-black w-4 h-4" />
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col space-y-2 text-sm">
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/my-orders" onClick={() => setMenuOpen(false)}>
              Your Orders
            </Link>
            <button
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="text-left"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

    </nav>
  );
}
