import db from '../../lib/db';  // Import your db connection

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { buyerID, street, city, state, zipCode } = req.body;

    try {
      // Get a connection from the pool
      const connection = await db.promise().getConnection();
      await connection.beginTransaction();

      // Update the address
      const [updateResult] = await connection.query(
        'UPDATE Address SET StreetName = ?, City = ?, State = ?, ZipCode = ? WHERE AddressID = (SELECT AddressID FROM User WHERE UserID = ?)',
        [street, city, state, zipCode, buyerID]
      );

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(500).json({ error: 'Failed to update address' });
      }

      // Commit the transaction if update is successful
      await connection.commit();
      connection.release();

      // Fetch updated address for the response
      const [updatedAddress] = await connection.query(
        'SELECT StreetName AS street, City AS city, State AS state, ZipCode AS zipCode FROM Address WHERE AddressID = (SELECT AddressID FROM User WHERE UserID = ?)',
        [buyerID]
      );

      res.status(200).json({
        message: 'Address updated successfully',
        updatedAddress: updatedAddress[0], // Return the updated address
      });
    } catch (error) {
      console.error('Error updating address:', error);
      res.status(500).json({ error: error.message || 'Failed to update address' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
