import db from '../../lib/db';  // Import your db connection

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { items } = req.body;

    try {
      // Get a connection from the pool
      const connection = await db.promise().getConnection();
      await connection.beginTransaction();

      let errors = 0;

      // Loop through each item to update its stock quantity
      for (const item of items) {
        const [product] = await connection.query(
          'SELECT StockQuantity FROM Product WHERE ProductID = ?',
          [item.ProductID]
        );

        if (product.length === 0) {
          errors++;
          console.error(`Product with ID ${item.ProductID} not found.`);
          continue;
        }

        const currentStock = product[0].StockQuantity;

        if (currentStock < item.Quantity) {
          errors++;
          console.error(`Not enough stock for product ID ${item.ProductID}`);
          continue;
        }

        // Update the stock quantity
        const [updateResult] = await connection.query(
          'UPDATE Product SET StockQuantity = StockQuantity - ? WHERE ProductID = ?',
          [item.Quantity, item.ProductID]
        );

        if (updateResult.affectedRows === 0) {
          errors++;
          console.error(`Failed to update stock for product ID ${item.ProductID}`);
        }
      }

      if (errors > 0) {
        await connection.rollback(); // Rollback if there are errors
        return res.status(500).json({ error: 'Failed to update stock for some products' });
      }

      await connection.commit(); // Commit the transaction if all updates are successful
      connection.release(); // Release the connection back to the pool
      res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
      console.error('Error updating stock:', error);
      res.status(500).json({ error: error.message || 'Failed to update stock' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
