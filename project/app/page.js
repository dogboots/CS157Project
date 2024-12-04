"use client";

import React, { useState, useEffect } from "react";
import CategoryBar from "./components/CategoryBar";
import NavBar from "./components/NavBar";
import Sidebar from "./components/Sidebar";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSideBar = () => setIsSidebarOpen(true);
  const closeSideBar = () => setIsSidebarOpen(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <NavBar 
        isOpen={isSidebarOpen} 
        closeSideBar={closeSideBar} 
        openSideBar={openSideBar} 
      />
      <Sidebar isOpen={isSidebarOpen} closeSideBar={closeSideBar} />
      <div className="flex">
        <CategoryBar />
        {/* Product grid section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 max-w-screen-xl mx-auto mt-12">
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            // Dynamically create up to 6 boxes, each with 4 products
            Array.from({ length: Math.min(8, Math.ceil(products.length / 4)) }).map((_, index) => {
              const productSubset = products.slice(index * 4, index * 4 + 4);
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 max-h-[400px] overflow-y-auto"
                >
                  <h3 className="font-bold text-lg mb-4">Continue shopping deals</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {productSubset.map((product) => (
                      <div
                        key={product.ProductID}
                        className="bg-gray-100 p-2 rounded"
                      >
                        <img
                          src={product.ProductImage}
                          alt={product.ProductName}
                          className="w-full h-auto rounded"
                        />
                        <p className="text-sm text-gray-500">{product.ProductName}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}