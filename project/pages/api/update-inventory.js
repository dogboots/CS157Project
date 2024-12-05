import db from '../../lib/db'; 

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { items } = req.body;

    try {
      // Get a connection from the pool
      const connection = await db.promise().getConnection();
      await connection.beginTransaction();

      let errors = 0;

      // Loop through each item to update inventory
      for (const item of items) {
        console.log(`Processing item with ProductID: ${item.ProductID}, Requested Quantity: ${item.Quantity}`);

        const [inventory] = await connection.query(
          'SELECT Quantity FROM Inventory WHERE ProductID = ?',
          [item.ProductID]
        );

        if (inventory.length === 0) {
          errors++;
          console.error(`Inventory entry not found for ProductID: ${item.ProductID}`);
          continue;
        }

        const currentInventory = inventory[0].Quantity;
        console.log(`Current inventory for ProductID ${item.ProductID}: ${currentInventory}`);

        // Update the inventory quantity
        const [updateResult] = await connection.query(
          'UPDATE Inventory SET Quantity = Quantity - ? WHERE ProductID = ?',
          [item.Quantity, item.ProductID]
        );

        if (updateResult.affectedRows === 0) {
          errors++;
          console.error(`Failed to update inventory for ProductID ${item.ProductID}`);
        } else {
          console.log(`Successfully updated inventory for ProductID ${item.ProductID}`);
        }
      }

      if (errors > 0) {
        await connection.rollback(); // Rollback if there are errors
        return res.status(500).json({ error: 'Failed to update inventory for some products' });
      }

      await connection.commit(); // Commit the transaction if all updates are successful
      connection.release(); // Release the connection back to the pool
      res.status(200).json({ message: 'Inventory updated successfully' });
    } catch (error) {
      console.error('Error updating inventory:', error);
      res.status(500).json({ error: error.message || 'Failed to update inventory' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
