import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const query = `
        SELECT 
          InventoryID, 
          SellerID, 
          ProductID, 
          Quantity
        FROM 
          Inventory;
      `;
      db.query(query, (err, results) => {
        if (err) {
          console.error('Database query error', err);
          return res.status(500).json({ error: 'Failed to fetch inventory' });
        }
        res.status(200).json(results); 
      });
    } catch (error) {
      console.error('Unexpected error', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  } else if (req.method === 'PUT') {
    const { ProductID, newStock } = req.body;

    try {
      const updateQuery = `
        UPDATE Inventory
        SET Quantity = ?
        WHERE ProductID = ?;
      `;
      db.query(updateQuery, [newStock, ProductID], (err, result) => {
        if (err) {
          console.error('Database query error', err);
          return res.status(500).json({ error: 'Failed to update inventory' });
        }
        res.status(200).json({ message: 'Inventory updated successfully' });
      });
    } catch (error) {
      console.error('Unexpected error', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}
