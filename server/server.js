const path = require('path');
const fs = require('fs');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env and set it.');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/questions', require('./routes/questions'));

// Unknown API route
app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found.' }));

// If the React app has been built (npm run build in /client), serve it too.
const buildPath = path.join(__dirname, '..', 'client', 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));
}

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
