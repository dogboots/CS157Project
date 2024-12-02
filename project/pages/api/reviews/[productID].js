import db from '../../../lib/db';  

export default async function handler(req, res) {
  const { productID } = req.query;

  if (!productID) {
    return res.status(400).json({ error: 'ProductID is required' });
  }

  if (req.method === 'POST') {
    const { userID, stars, reviewContent } = req.body;

    // Validate required fields
    if (!userID || !stars || !reviewContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Insert the review into the Review table
      const query = `
        INSERT INTO Review (ProductID, UserID, Stars, ReviewContent, PublishDate)
        VALUES (?, ?, ?, ?, NOW())
      `;
      const result = await db.promise().query(query, [productID, userID, stars, reviewContent]);

      if (result[0].affectedRows === 0) {
        return res.status(500).json({ error: 'Failed to submit review' });
      }

      res.status(200).json({ message: 'Review submitted successfully' });
    } catch (error) {
      console.error('Error inserting review:', error.message || error);
      res.status(500).json({ error: 'Failed to submit review' });
    }
  } else if (req.method === 'GET') {
    try {
      // Fetch reviews for the product
      console.log('Fetching reviews...');
      const query = 'SELECT * FROM Review WHERE ProductID = ?';
      const [reviews] = await db.promise().query(query, [productID]);

      if (reviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this product' });
      }

      res.status(200).json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error.message || error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  } else {
    // If the request method is not GET or POST
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
