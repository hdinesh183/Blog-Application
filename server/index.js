const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://blog-application-lilac-iota.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const isVercel = origin.includes('vercel.app');
    const isLocal = origin.includes('localhost');
    
    if (allowedOrigins.indexOf(origin) !== -1 || isVercel || isLocal) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked a request from: ${origin}. Add this to your allowedOrigins!`);
      callback(null, true); // Still allowing all for debugging
    }
  },
  credentials: true
}));
app.use(express.json());

// Health check for cloud providers
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Routes
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
