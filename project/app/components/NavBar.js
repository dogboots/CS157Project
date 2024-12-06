"use client";

import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { FiShoppingCart } from "react-icons/fi";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../globals.css";

function NavBar({ isOpen, closeSideBar, openSideBar }) {
  const [buyerID, setBuyerID] = useState(null);
  const [userRole, setUserRole] = useState(null); // Track user role
  useEffect(() => {
    const storedBuyerID = sessionStorage.getItem("buyerID");
    const storedRole = sessionStorage.getItem("userRole"); // Fetch user role

    if (storedBuyerID) {
      setBuyerID(storedBuyerID);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []);

  const handleLogout = async () => {
    const userId = sessionStorage.getItem("buyerID");

    if (userId) {
      // Call the backend to delete all items from the user's cart
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        console.log("Cart cleared successfully.");
      } else {
        console.error("Failed to clear the cart.");
      }
    }

    // Remove sessionStorage items
    sessionStorage.removeItem("buyerID");
    sessionStorage.removeItem("userRole");

    // Clear state variables
    setBuyerID(null);
    setUserRole(null);

    // Refresh the page
    window.location.reload();
  };

  return (
    <div className="sticky top-0">
      <nav className="bg-[#E63946] p-1">
        <div className="flex justify-between items-center text-white text-2xl">
          <div className="flex items-center">
            <Link href="/">
              <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                <i className="font-serif font-bold">Ecommerce</i>
              </button>
            </Link>
            <div className="flex space-x-6 ml-6">
              {userRole === "admin" ? (
                <Link href="/inventory">
                  <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                    Inventory
                  </button>
                </Link>
              ) : null}
              {!buyerID ? (
                <>
                  <Link href="/login">
                    <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                      Sign Up
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/user">
                    <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                      User
                    </button>
                  </Link>
                  <Link href="/orders">
                    <button className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition">
                      Orders
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-transparent text-white px-4 py-2 hover:text-gray-500 transition"
                  >
                    Logout
                  </button>
                  <button className="cursor-auto">
                    User ID: {buyerID}
                  </button>
                </>
              )}
            </div>
          </div>
          <button>
            <FiShoppingCart className="text-3xl mr-2 cursor-pointer hover:fill-rose-400" onClick={openSideBar} />
          </button>
        </div>
      </nav>
      <Sidebar isOpen={isOpen} closeSideBar={closeSideBar} />
    </div>
  );
}

export default NavBar;