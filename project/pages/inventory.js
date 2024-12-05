"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../app/components/NavBar"; // assuming you're using Navbar on other pages as well

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStock, setNewStock] = useState(0);

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

  const handleStockChange = (productId) => {
    // Update stock in the products table
    fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQuantity: newStock }),
    })
      .then(() => {
        // Update stock in the inventory table
        fetch("/api/inventory", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ProductID: productId, newStock }),
        })
          .then((response) => response.json())
          .then(() => {
            setProducts((prev) =>
              prev.map((product) =>
                product.ProductID === productId
                  ? { ...product, StockQuantity: newStock }
                  : product
              )
            );
            setEditingProduct(null);
          })
          .catch((error) => console.error("Failed to update inventory:", error));
      })
      .catch((error) => console.error("Failed to update stock:", error));
  };  

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">Inventory Management</h1>
        <table className="min-w-full border table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Stock Quantity</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.ProductID}>
                <td className="border px-4 py-2">{product.ProductName}</td>
                <td className="border px-4 py-2">
                  {editingProduct === product.ProductID ? (
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    product.StockQuantity
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingProduct === product.ProductID ? (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded"
                      onClick={() => handleStockChange(product.ProductID)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setEditingProduct(product.ProductID);
                        setNewStock(product.StockQuantity); // Make sure to set initial value for newStock
                      }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
