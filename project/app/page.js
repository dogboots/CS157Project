"use client";

import React, { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";

export default function Home() {
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

  const slides = [
    {
      url: "https://cdnportal.mobalytics.gg/production/2023/07/TFT-Set-11-2-star-Highlight.png",
    },
    {
      url: "https://oyster.ignimgs.com/mediawiki/apis.ign.com/league-of-legends/f/f8/TFT_13.22_Patch_Header.jpg",
    },
    {
      url: "https://preview.redd.it/tft-cheat-sheet-set-11-v0-h8vaqnk34hnc1.png?width=1031&format=png&auto=webp&s=0d0dd25876661c914da7fc26fb92d005172e83e1",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      nextSlide();
    }, 7000); // Change slide every 3 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentIndex]);

  

  return (
    <div>

      <div className="flex">

        <div className="w-64 bg-gray-800 text-white h-screen p-5">
          <h3 className="text-xl font-semibold mb-5">Categories</h3>
          <ul className="space-y-4">
            <li>
              <a href="#" className="text-lg hover:text-gray-400">
                Electronics
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-400">
                Fashion
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-400">
                Home & Kitchen
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-400">
                Books
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-400">
                Toys
              </a>
            </li>
            <li>
              <a href="#" className="text-lg hover:text-gray-400">
                Sports
              </a>
            </li>
          </ul>
        </div>

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
