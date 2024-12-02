import db from '../../lib/db';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Query the database for the user
    db.query('SELECT * FROM User WHERE Username = ?', [username], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const user = results[0];

      // Check if the password matches
      if (user.Password === password) {
        return res.status(200).json({ message: 'Login successful', userID: user.UserID });
      } else {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
