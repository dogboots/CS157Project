"use client";

import NavBar from '@/app/components/NavBar';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  useEffect(() => {
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
    if (!paymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    setLoading(true);
    const totalAmount = calculateTotalPrice();

    const loggedInUserID = sessionStorage.getItem("buyerID");

    if (!loggedInUserID) {
      alert("You must be logged in to place an order.");
      setLoading(false);
      return;
    }

    const orderData = {
      buyerID: loggedInUserID,
      totalAmount,
      items: selectedItems.map(item => ({
        ProductID: item.ProductID,
        Quantity: item.selectedQuantity,
        UnitPrice: item.ProductPrice
      })),
      paymentMethod: paymentMethod
    };

    try {
      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const clearCartResponse = await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: loggedInUserID }),
        });

        if (!clearCartResponse.ok) {
          alert('Failed to clear cart. Please try again.');
          setLoading(false);
          return;
        }

        const stockUpdateResponse = await fetch('/api/update-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: orderData.items }),
        });

        const inventoryUpdateResponse = await fetch('/api/update-inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: orderData.items }),
        });

        console.log('Stock update response:', stockUpdateResponse);
        console.log('Inventory update response:', inventoryUpdateResponse);

        if (!stockUpdateResponse.ok || !inventoryUpdateResponse.ok) {
          alert('Failed to update stock and inventory. Please try again.');
          setLoading(false);
          return;
        }

        setOrderPlaced(true);
        sessionStorage.removeItem('cart');
      } else {
        alert('Failed to place the order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error processing your order.');
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
    <NavBar/>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      {selectedItems.length === 0 ? (
        <p>No items in your cart</p>
      ) : (
        selectedItems.map((item) => (
          <div key={item.ProductID} className="border p-4 mb-4 rounded shadow">
            <img src={item.ProductImage} alt={item.ProductName} className="w-32 h-32 object-cover mb-4" />
            <p>{item.ProductName}</p>
            <p>Quantity: {item.selectedQuantity}</p>
            <p>Total Price: ${(item.ProductPrice * item.selectedQuantity).toFixed(2)}</p>
          </div>
        ))
      )}
      <div className="font-semibold text-lg">Total: ${calculateTotalPrice()}</div>

      <div className="mt-4">
        <label className="block text-lg font-medium">Payment Method</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="mt-2 p-2 border rounded w-full"
        >
          <option value="">Select Payment Method</option>
          <option value="CreditCard">Credit Card</option>
          <option value="PayPal">PayPal</option>
        </select>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-green-400 text-white rounded hover:bg-green-500"
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>

      {orderPlaced && <p className="mt-4 text-green-600">Order placed successfully!</p>}
    </div>
    </>
  );
}
