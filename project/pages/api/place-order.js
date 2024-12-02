import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { buyerID, totalAmount, items, paymentMethod } = req.body; // Extract buyerID, totalAmount, items, and paymentMethod from the request body
    
    // Insert into the `Order` table
    const orderQuery = 'INSERT INTO `Order` (BuyerID, TotalPrice, PurchaseDate) VALUES (?, ?, NOW())';
    
    db.query(orderQuery, [buyerID, totalAmount], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to insert order' });
      }

      // Get the inserted Order ID
      const orderID = result.insertId;

      // Insert into the `OrderedItem` table
      const orderedItemsQuery = 'INSERT INTO OrderedItem (OrderID, ProductID, Quantity, UnitPrice) VALUES ?';
      const orderedItemsData = items.map(item => [
        orderID, 
        item.ProductID, 
        item.Quantity, 
        item.UnitPrice
      ]);

      db.query(orderedItemsQuery, [orderedItemsData], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to insert ordered items' });
        }

        // Now insert the payment details into the Payment table
        const paymentQuery = 'INSERT INTO Payment (OrderID, PaymentMethod, PaymentStatus, PaymentDate) VALUES (?, ?, "Completed", NOW())';
        
        db.query(paymentQuery, [orderID, paymentMethod], (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to insert payment' });
          }

          // Return success response with the order ID and payment information
          res.status(200).json({ message: 'Order and payment processed successfully!', orderID });
        });
      });
    });
  } else {
    // If not a POST request
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
