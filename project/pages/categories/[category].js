import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '../../app/components/NavBar';
import CategoryBar from '../../app/components/CategoryBar';
import Sidebar from '../../app/components/Sidebar';

export default function CategoryPage() {
  const { category } = useRouter().query; // Get the category name (e.g., 'electronics')
  const [products, setProducts] = useState([]); // Holds all products
  const [selectedItems, setSelectedItems] = useState([]); // Holds selected items and their quantities
  const [loading, setLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const [buyerID, setBuyerID] = useState(null); // Track buyer ID from sessionStorage

  const openSideBar = () => {
    setOpen(!isOpen);
  };

  const closeSideBar = () => {
    setOpen(false);
  };

  // Fetch buyerID from sessionStorage on mount
  useEffect(() => {
    const storedBuyerID = sessionStorage.getItem('buyerID');
    if (storedBuyerID) {
      setBuyerID(storedBuyerID); // Set buyerID from sessionStorage
    }

    if (category) {
      async function fetchCategoryData() {
        const res = await fetch(`/api/categories/${category}`);
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      }

      fetchCategoryData();
    }
  }, [category]);

  const handleIncrease = async (productId, stockQuantity) => {
    if (!buyerID) {
      alert("Please log in to add products to the cart.");
      return;
    }

    const productIndex = selectedItems.findIndex(item => item.ProductID === productId);

    if (productIndex !== -1) {
      const updatedItems = [...selectedItems];
      if (updatedItems[productIndex].selectedQuantity < stockQuantity) {
        updatedItems[productIndex].selectedQuantity += 1;
        setSelectedItems(updatedItems);

        // Update the cart in the backend
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: buyerID, // Pass buyerID from sessionStorage
            productId,
            quantity: updatedItems[productIndex].selectedQuantity,
          }),
        });
      }
    } else {
      const product = products.find(product => product.ProductID === productId);
      if (product) {
        setSelectedItems([...selectedItems, { ...product, selectedQuantity: 1 }]);

        // Add the product to cart in backend
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: buyerID, // Pass buyerID from sessionStorage
            productId,
            quantity: 1,
          }),
        });
      }
    }
  };

  const handleDecrease = async (productId) => {
    if (!buyerID) {
      alert("Please log in to update your cart.");
      return;
    }

    const productIndex = selectedItems.findIndex(item => item.ProductID === productId);

    if (productIndex !== -1) {
      const updatedItems = [...selectedItems];
      const currentQuantity = updatedItems[productIndex].selectedQuantity;

      if (currentQuantity > 1) {
        updatedItems[productIndex].selectedQuantity -= 1;
        setSelectedItems(updatedItems);

        // Update the cart in backend
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: buyerID, // Pass buyerID from sessionStorage
            productId,
            quantity: updatedItems[productIndex].selectedQuantity,
          }),
        });
      } else {
        // Remove the item from the cart if quantity is 0
        updatedItems.splice(productIndex, 1);
        setSelectedItems(updatedItems);

        // Delete the item from the cart in backend
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: buyerID, // Pass buyerID from sessionStorage
            productId,
            quantity: 0, // Quantity 0 triggers deletion
          }),
        });
      }
    }
  };

  const calculateTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + (item.ProductPrice * item.selectedQuantity), 0).toFixed(2);
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout!");
  };

  const handleReviewClick = (productId) => {
    router.push(`/product/${productId}`); // Navigate to the reviews page for the product
  };

  if (loading) return <p>Loading...</p>;
  if (!products.length) return <p>No products found for this category.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar at the top */}
      <NavBar openSideBar={openSideBar} isOpen={isOpen} closeSideBar={closeSideBar} />

      {/* Main content container */}
      <div className="flex flex-1">
        {/* Category Bar to the left */}
        <div className="w-1/4 bg-gray-200 p-4">
          <CategoryBar />
        </div>

        {/* Product grid in the center */}
        <div className="flex-1 p-4">
          <h1 className="text-center text-3xl font-bold mb-6">{category}</h1>

          {/* Product Grid Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden relative">
                <img
                  src={product.ProductImage}
                  alt={product.ProductName}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-lg font-semibold text-gray-800">{product.ProductName}</p>
                  <p className="text-gray-600 text-sm">Price: ${product.ProductPrice}</p>
                  <p className="text-gray-600 text-sm">Stock: {product.StockQuantity} available</p>

                  {/* Quantity controls */}
                  <div className="flex items-center mt-4">
                    <button
                      className="bg-gray-300 text-gray-700 rounded-full px-4 py-2"
                      onClick={() => handleDecrease(product.ProductID)}
                    >
                      -
                    </button>
                    <span className="mx-4 text-lg">
                      {selectedItems.find(item => item.ProductID === product.ProductID)?.selectedQuantity || 0}
                    </span>
                    <button
                      className="bg-gray-300 text-gray-700 rounded-full px-4 py-2"
                      onClick={() => handleIncrease(product.ProductID, product.StockQuantity)}
                      disabled={selectedItems.find(item => item.ProductID === product.ProductID)?.selectedQuantity >= product.StockQuantity}
                    >
                      +
                    </button>
                  </div>

                  {/* Review Button */}
                  <button
                    onClick={() => handleReviewClick(product.ProductID)}
                    className="absolute bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Write a Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={isOpen}
        closeSideBar={closeSideBar}
        selectedItems={selectedItems}
        calculateTotalPrice={calculateTotalPrice}
        handleCheckout={handleCheckout}
        router={router}
      />
    </div>
  );
}
