import db from '../../lib/db';

export default async function handler(req, res) {
  const { buyerID } = req.query;

  if (!buyerID) {
    return res.status(400).json({ error: "buyerID is required" });
  }

  try {
    // Query the database for the user's orders and ordered items
    const [orders] = await db.promise().query(
      `
      SELECT 
        o.OrderID, 
        o.TotalPrice, 
        o.PurchaseDate,
        oi.OrderItemID,
        oi.ProductID,
        oi.Quantity,
        oi.UnitPrice,
        p.ProductName
      FROM \`Order\` o
      INNER JOIN OrderedItem oi ON o.OrderID = oi.OrderID
      INNER JOIN Product p ON oi.ProductID = p.ProductID
      WHERE o.BuyerID = ?
      ORDER BY o.PurchaseDate DESC
      `,
      [buyerID]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this buyer." });
    }

    // Organize orders and their items into the desired structure
    const organizedOrders = orders.reduce((acc, order) => {
      const { OrderID, TotalPrice, PurchaseDate, OrderItemID, ProductID, Quantity, UnitPrice, ProductName } = order;

      // Find or create the order
      let existingOrder = acc.find(o => o.OrderID === OrderID);
      if (!existingOrder) {
        existingOrder = {
          OrderID,
          TotalPrice,
          PurchaseDate,
          items: [],
        };
        acc.push(existingOrder);
      }

      // Add the item to the order
      existingOrder.items.push({
        OrderItemID,
        ProductID,
        Quantity,
        UnitPrice,
        ProductName,
      });

      return acc;
    }, []);

    // Return the organized orders
    res.status(200).json({ orders: organizedOrders });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Failed to fetch orders from the database." });
  }
}
