"use client";

import React, { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import CategoryBar from "./components/CategoryBar";

export default function HomePage() {
  const [products, setProducts] = useState([]);

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

      <div className="flex">

      <CategoryBar></CategoryBar>
        {/* Product grid section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 max-w-screen-xl mx-auto mt-12">
  {products.length === 0 ? (
    <p>No products available.</p>
  ) : (
    // Dynamically create a box for each group of 4 products
    Array.from({ length: Math.ceil(products.length / 4) }).map((_, index) => {
      // Get the next 4 products using slice
      const productSubset = products.slice(index * 4, index * 4 + 4);

      return (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 max-h-[400px] overflow-y-auto">
          <h3 className="font-bold text-lg mb-4">Continue shopping deals</h3>
          <div className="grid grid-cols-2 gap-4">
            {productSubset.map((product) => (
              <div key={product.ProductID} className="bg-gray-100 p-2 rounded">
                <img
                  src={product.ProductImage} // Dynamically set the image path
                  alt={product.ProductName} 
                  className="w-full h-auto rounded"
                />
                <p className="text-sm text-gray-500">{product.ProductName}</p> {/* Display product name */}
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
