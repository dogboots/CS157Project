import db from '../../../lib/db';  // Import the connection pool

export default async function handler(req, res) {
  const { category } = req.query;
  console.log('Requested category:', category);

  try {
    // Query to fetch the CategoryID based on the category name
    const categoryQuery = `
      SELECT CategoryID
      FROM Category
      WHERE CategoryName = ?
    `;
    
    db.query(categoryQuery, [category], (err, categoryResult) => {
      if (err) {
        console.error('Database query error', err);
        return res.status(500).json({ error: 'Failed to fetch category' });
      }

      if (categoryResult.length === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const categoryId = categoryResult[0].CategoryID;

      // Query to fetch products in the selected category
      const productQuery = `
        SELECT ProductID, ProductName, ProductImage
        FROM Product
        WHERE CategoryID = ?
      `;

      db.query(productQuery, [categoryId], (err, productResults) => {
        if (err) {
          console.error('Database query error', err);
          return res.status(500).json({ error: 'Failed to fetch products' });
        }

        // Return the products for the category
        res.status(200).json(productResults);
      });
    });

  } catch (error) {
    console.error('Unexpected error', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
