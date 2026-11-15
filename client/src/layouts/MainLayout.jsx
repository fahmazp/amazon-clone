import React from "react";
import Navbar from "@/components/NavbarUi";
import { Outlet } from "react-router-dom";
import FooterUi from "@/components/FooterUi";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="grow">
        <Outlet />
      </main>
      <FooterUi />
    </div>
  );
};

export default MainLayout;
