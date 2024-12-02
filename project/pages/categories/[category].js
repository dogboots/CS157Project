import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '../../app/components/NavBar';
import CategoryBar from '../../app/components/CategoryBar';

export default function CategoryPage() {
  const { category } = useRouter().query; // Get the category name (e.g., 'electronics')
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) return <p>Loading...</p>;
  if (!products.length) return <p>No products found for this category.</p>;

  return (
   
    <div className="min-h-screen flex flex-col">
    {/* Navbar at the top */}
    <NavBar />
  
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
          {products.length === 0 ? (
            <p className="text-center text-xl">No products found for this category.</p>
          ) : (
            products.map((product) => (
              <div key={product.ProductID} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={product.ProductImage} 
                  alt={product.ProductName} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-lg font-semibold text-gray-800">{product.ProductName}</p>
                  <p className="text-gray-600 text-sm">Product ID: {product.ProductID}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
  
    </div>
  </div>
  );
}