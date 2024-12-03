import db from "../../../lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    const { stockQuantity } = req.body;

    try {
      const result = await db.query(
        "UPDATE Product SET StockQuantity = ? WHERE ProductID = ?",
        [stockQuantity, id]
      );

      res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update stock quantity" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
