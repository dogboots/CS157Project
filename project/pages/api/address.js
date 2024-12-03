import db from '../../lib/db'; // Import your db connection

export default async function handler(req, res) {
  const { buyerID } = req.query; // Extract buyerID from the query parameters

  if (!buyerID) {
    return res.status(400).json({ error: "buyerID is required" });
  }

  try {
    // Query the database for the user's address
    const [result] = await db.promise().query(
      "SELECT StreetName AS street, City AS city, State AS state, ZipCode AS zipCode FROM Address WHERE AddressID = (SELECT AddressID FROM User WHERE UserID = ?)",
      [buyerID]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Address not found for this buyerID" });
    }

    // Send the fetched address
    res.status(200).json({ address: result[0] });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Failed to fetch address from the database" });
  }
}
