const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '.')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Homepage route
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (err) {
    console.error('Error serving index.html:', err);
    res.status(500).send('Error loading homepage');
  }
});

// Privacy policy route
app.get('/privacy-policy', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'privacy-policy.html'));
  } catch (err) {
    console.error('Error serving privacy-policy.html:', err);
    res.status(500).send('Error loading privacy policy');
  }
});

// Catch-all route
app.get('*', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, 'index.html'));
  } catch (err) {
    console.error('Error serving fallback:', err);
    res.status(500).send('Error loading page');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
