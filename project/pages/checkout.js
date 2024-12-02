"use client";

import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false); // To track if the order is being placed
  const [isClient, setIsClient] = useState(false); // State to track if we're on the client-side

  useEffect(() => {
    // Set isClient to true after the component mounts (only on client-side)
    setIsClient(true);

    const cart = sessionStorage.getItem('cart');
    if (cart) {
      setSelectedItems(JSON.parse(cart));
    }
  }, []);

  const calculateTotalPrice = () => {
    return selectedItems.reduce(
      (total, item) => total + item.ProductPrice * item.selectedQuantity,
      0
    ).toFixed(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true); // Start loading state when placing the order
    const totalAmount = calculateTotalPrice();
    
    // Get the logged-in user ID from sessionStorage
    const loggedInUserID = sessionStorage.getItem("buyerID");

    if (!loggedInUserID) {
      alert("You must be logged in to place an order.");
      setLoading(false); // Stop loading state if no user is logged in
      return;
    }

    const orderData = {
      buyerID: loggedInUserID, // Use the logged-in user's ID from sessionStorage
      totalAmount,
      items: selectedItems.map(item => ({
        ProductID: item.ProductID,
        Quantity: item.selectedQuantity,
        UnitPrice: item.ProductPrice // Ensure the price is passed as `UnitPrice`
      })),
    };

    try {
      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setOrderPlaced(true);
        sessionStorage.removeItem('cart'); // Clear the cart after placing the order
      } else {
        alert('Failed to place the order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error processing your order.');
    } finally {
      setLoading(false); // Stop loading state once the request is done
    }
};
  // Return a fallback message until the component mounts on the client-side
  if (!isClient) {
    return null; // Prevent rendering during SSR
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {selectedItems.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        selectedItems.map((item) => (
          <div key={item.ProductID} className="border p-4 mb-4 rounded shadow">
            {/* Adjust the image size here */}
            <img src={item.ProductImage} alt={item.ProductName} className="w-32 h-32 object-cover mb-4" />
            <p>{item.ProductName}</p>
            <p>Quantity: {item.selectedQuantity}</p>
            <p>Total Price: ${(item.ProductPrice * item.selectedQuantity).toFixed(2)}</p>
          </div>
        ))
      )}
      <div className="font-semibold text-lg">Total: ${calculateTotalPrice()}</div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>

      {orderPlaced && <p className="mt-4 text-green-500">Order placed successfully!</p>}
    </div>
  );
}
