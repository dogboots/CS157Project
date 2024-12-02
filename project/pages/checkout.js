import { useEffect, useState } from 'react';

export default function CheckoutPage() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);  // To track if the order is being placed

  useEffect(() => {
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
    setLoading(true);  // Start loading state when placing the order
    const totalAmount = calculateTotalPrice();
    const orderData = {
      buyerID: 3, // Replace with actual logged-in user's ID
      totalAmount,
      items: selectedItems,
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
        sessionStorage.removeItem('cart');  // Clear the cart after placing the order
      } else {
        alert('Failed to place the order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('There was an error processing your order.');
    } finally {
      setLoading(false);  // Stop loading state once the request is done
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      {selectedItems.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        selectedItems.map((item) => (
          <div key={item.ProductID}>
            <img src={item.ProductImage} alt={item.ProductName} />
            <p>{item.ProductName}</p>
            <p>Quantity: {item.selectedQuantity}</p>
            <p>Total Price: ${(item.ProductPrice * item.selectedQuantity).toFixed(2)}</p>
          </div>
        ))
      )}
      <div>Total: ${calculateTotalPrice()}</div>

      <button onClick={handlePlaceOrder} disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>

      {orderPlaced && <p>Order placed successfully!</p>}
    </div>
  );
}
