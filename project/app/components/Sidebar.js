import { IoExitOutline } from "react-icons/io5"; 
import Link from 'next/link';

export default function Sidebar({ isOpen, closeSideBar, selectedItems = [], calculateTotalPrice, router }) {
 // Initialize router

  // Handle checkout function
  const handleCheckout = () => {
    // Save selectedItems to sessionStorage
    sessionStorage.setItem("cart", JSON.stringify(selectedItems));
    // Redirect to checkout page
    router.push('/checkout');
  };

  return (
    <aside className={`h-screen w-64 fixed top-0 right-0 transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <nav className="bg-indigo-500 h-full flex flex-col border-l shadow-sm">
        {/* Close Button */}
        <div className="p-1 flex justify-end">
          <button onClick={closeSideBar} className="text-white">
            <IoExitOutline size={24} />
          </button>
        </div>

        {/* Shopping Cart Title */}
        <div className="px-4 py-2">
          <h2 className="text-white text-2xl font-bold">Shopping Cart</h2>
        </div>

        {/* Cart Items */}
        <div className="flex flex-col p-4 flex-1">
          {selectedItems.length === 0 ? (
            <p className="text-white">No items selected.</p>
          ) : (
            selectedItems.map((item) => (
              <div key={item.ProductID} className="flex items-center mb-4">
                <img src={item.ProductImage} alt={item.ProductName} className="w-16 h-16 object-cover rounded-md mr-4" />
                <div>
                  <p className="text-white font-semibold">{item.ProductName}</p>
                  <p className="text-white">Quantity: {item.selectedQuantity || 0}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Section */}
        {selectedItems.length > 0 && (
          <div className="p-4">
            <div className="text-white font-semibold mb-2">Total: ${calculateTotalPrice()}</div>

            
            <button
              onClick={handleCheckout}  // Call handleCheckout on click
              className="w-full bg-yellow-500 text-gray-800 py-2 rounded-lg hover:bg-yellow-400 focus:outline-none"
            >
              Checkout
            </button>
          </div>
        )}
      </nav>
    </aside>
  );
}
