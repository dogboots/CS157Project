import db from '../../lib/db';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, productId, quantity } = req.body;

    // Ensure userId and quantity are provided
    if (!userId || quantity === undefined) {
      return res.status(400).json({ error: 'User ID and quantity are required' });
    }

    if (quantity === 0) {
      // Delete the item from the cart if quantity is 0
      db.query(
        `DELETE FROM ShoppingCart WHERE UserID = ? AND ProductID = ?`,
        [userId, productId],
        (err, results) => {
          if (err) {
            console.error('Error deleting item from cart:', err);
            return res.status(500).json({ error: 'Failed to delete item from cart' });
          }

          res.status(200).json({ message: 'Item removed from cart' });
        }
      );
    } else {
      // Insert or update the cart item if quantity is greater than 0
      db.query(
        `INSERT INTO ShoppingCart (UserID, ProductID, Quantity) 
         VALUES (?, ?, ?) 
         ON DUPLICATE KEY UPDATE Quantity = ?`,
        [userId, productId, quantity, quantity],
        (err, results) => {
          if (err) {
            console.error('Error updating cart:', err);
            return res.status(500).json({ error: 'Failed to update cart' });
          }

          res.status(200).json({ message: 'Cart updated successfully' });
        }
      );
    }
  } else if (req.method === 'DELETE') {
    const { userId } = req.body;

    // Ensure userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Delete all items from the user's cart
    db.query(
      `DELETE FROM ShoppingCart WHERE UserID = ?`,
      [userId],
      (err, results) => {
        if (err) {
          console.error('Error clearing cart:', err);
          return res.status(500).json({ error: 'Failed to clear cart' });
        }

        res.status(200).json({ message: 'Cart cleared successfully' });
      }
    );
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
