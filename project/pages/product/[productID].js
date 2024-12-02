"use-client";

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ProductReviews() {
  const router = useRouter();
  const { productID } = router.query;
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ stars: '', reviewContent: '' });
  const [loading, setLoading] = useState(true);
  const [buyerID, setBuyerID] = useState(null);

  useEffect(() => {
    if (!productID) return;

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${productID}`);
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productID]);

  useEffect(() => {
    const storedBuyerID = sessionStorage.getItem('buyerID');
    if (storedBuyerID) {
      setBuyerID(storedBuyerID);
    }

  
  }, []);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!buyerID) {
      alert('Please log in to submit a review.');
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${productID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: buyerID, ...newReview }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Review submitted successfully!');
        setNewReview({ stars: '', reviewContent: '' });
        await fetchReviews();
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  if (loading) {
    return <p>Loading reviews...</p>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Reviews for Product {productID}</h1>

      <div className="space-y-6">
        {reviews.length > 0 ? (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li key={review.ReviewID} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="space-y-2">
                  <p className="font-semibold text-yellow-500">Stars: {review.Stars}</p>
                  <p className="italic text-gray-700">{review.ReviewContent}</p>
                  <p className="text-sm text-gray-500">Published on: {review.PublishDate}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>

      {buyerID ? (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Submit a Review</h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="stars" className="font-medium">Stars:</label>
              <input
                type="number"
                id="stars"
                name="stars"
                value={newReview.stars}
                onChange={handleReviewChange}
                min="1"
                max="5"
                required
                className="mt-2 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="reviewContent" className="font-medium">Review Content:</label>
              <textarea
                id="reviewContent"
                name="reviewContent"
                value={newReview.reviewContent}
                onChange={handleReviewChange}
                required
                className="mt-2 p-2 border border-gray-300 rounded-md h-40"
              />
            </div>
            <button type="submit" className="mt-4 w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition">
              Submit Review
            </button>
          </form>
        </div>
      ) : (
        <p className="mt-6 text-center text-gray-500">Please log in to submit a review.</p>
      )}
    </div>
  );
}
