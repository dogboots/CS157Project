"use client";

import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../globals.css";

function NavBar({ isOpen, closeSideBar, openSideBar }) {
  const [buyerID, setBuyerID] = useState(null);

  useEffect(() => {
    const storedBuyerID = sessionStorage.getItem("buyerID");
    console.log("Loaded buyerID from sessionStorage:", storedBuyerID); // Debugging line
    if (storedBuyerID) {
      setBuyerID(storedBuyerID);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("buyerID");
    setBuyerID(null);
    console.log(buyerID)
  };

  return (
    <div>
      <nav className="bg-green-500 p-1">
        <div className="flex justify-between items-center text-white text-2xl">
          <div className="flex items-center">
            <Link href="/">
              <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                <b>Ecommerce</b>
              </button>
            </Link>
            <div className="flex space-x-6 ml-6">
              {!buyerID ? (
                <Link href="/login">
                  <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                    Login
                  </button>
                </Link>
              ) : (
                <>
                  <span className="text-white">User ID: {buyerID}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
          <button>
            <FiMenu className="text-3xl mr-2 cursor-pointer" onClick={openSideBar} />
          </button>
        </div>
      </nav>
      <Sidebar isOpen={isOpen} closeSideBar={closeSideBar} />
    </div>
  );
}

export default NavBar;