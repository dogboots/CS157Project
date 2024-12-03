import db from '../../lib/db';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password, email, streetName, city, state, zipCode } = req.body;

    // First, insert the address
    const insertAddressQuery = `
      INSERT INTO Address (StreetName, City, State, ZipCode)
      VALUES (?, ?, ?, ?)
    `;

    db.query(insertAddressQuery, [streetName, city, state, zipCode], (err, addressResult) => {
      if (err) {
        return res.status(500).json({ error: 'Database error while inserting address' });
      }

      const addressId = addressResult.insertId;

      // Now, insert the user with the address ID
      const insertUserQuery = `
        INSERT INTO User (Username, Password, Email, AddressID)
        VALUES (?, ?, ?, ?)
      `;

      db.query(insertUserQuery, [username, password, email, addressId], (err, userResult) => {
        if (err) {
          return res.status(500).json({ error: 'Database error while inserting user' });
        }

        res.status(200).json({ message: 'User successfully signed up' });
      });
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
