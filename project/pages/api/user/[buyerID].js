import db from '../../../lib/db';  

export default function handler(req, res) {
    const { buyerID } = req.query;
  
    if (req.method === "GET") {
      db.query(
        `SELECT Username, Email, Role 
         FROM User 
         WHERE UserID = ?`,
        [buyerID],
        (err, results) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
  
          if (results.length === 0) {
            res.status(404).json({ error: "User not found" });
            return;
          }
  
          res.status(200).json(results[0]);
        }
      );
    }
  }
  