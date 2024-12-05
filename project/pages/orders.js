"use client";

import Navbar from "../app/components/NavBar";
import { useEffect, useState } from "react";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const buyerID = sessionStorage.getItem("buyerID");
      if (!buyerID) {
        setError("Buyer ID is missing. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders?buyerID=${buyerID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError(err.message || "An unknown error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="text-center text-xl">Loading...</div>;
  if (error) return <div className="text-center text-xl text-red-500">Error: {error}</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-6">Your Orders</h1>
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.OrderID} className="border-b border-gray-300 py-4">
              <p><strong>Order ID:</strong> {order.OrderID}</p>
              <p><strong>Total Price:</strong> ${parseFloat(order.TotalPrice).toFixed(2)}</p>
              <p><strong>Purchase Date:</strong> {new Date(order.PurchaseDate).toLocaleDateString()}</p>
              <ul className="list-disc ml-6">
                {Array.isArray(order.items) && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <li key={item.OrderItemID}>
                      {item.ProductName} - {item.Quantity} x ${parseFloat(item.UnitPrice).toFixed(2)}
                    </li>
                  ))
                ) : (
                  <p>No items found for this order.</p>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
