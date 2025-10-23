import React from "react";
import Navbar from "@/components/NavbarUi";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-4 text-center text-sm text-gray-500">
        © 2025 Quickstore — All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
