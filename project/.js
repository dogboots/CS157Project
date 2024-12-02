const express = require('express');
const path = require('path');

const app = express();
const port = 3000; 

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Example API route
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// For any other request, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});