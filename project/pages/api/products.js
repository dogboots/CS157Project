import db from '../../lib/db';

export default async function handler(req, res) {
  try {

    const query = `
      SELECT 
        ProductID, 
        ProductName, 
        ProductImage
      FROM 
        Product;
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Database query error', err);
        return res.status(500).json({ error: 'Failed to fetch products' });
      }
      res.status(200).json(results); 
    });
  } catch (error) {
    console.error('Unexpected error', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}