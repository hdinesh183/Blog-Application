const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const [posts] = await db.execute(`
      SELECT posts.*, users.username as author_name 
      FROM posts 
      JOIN users ON posts.author_id = users.id 
      ORDER BY posts.created_at DESC
    `);
    res.json(posts);
  } catch (err) {
    console.error('❌ Fetch Posts Error:', err);
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: "Database table 'posts' is missing. Please run your db.sql script in Aiven." });
    }
    res.status(500).json({ error: `Server error: ${err.message}` });
  }
});

// Get single post with comments
router.get('/:id', async (req, res) => {
  try {
    const [posts] = await db.execute(`
      SELECT posts.*, users.username as author_name 
      FROM posts 
      JOIN users ON posts.author_id = users.id 
      WHERE posts.id = ?
    `, [req.params.id]);

    if (posts.length === 0) return res.status(404).json({ error: "Post not found." });

    const [comments] = await db.execute('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at DESC', [req.params.id]);

    res.json({ ...posts[0], comments });
  } catch (err) {
    res.status(500).json({ error: "Server error fetching post details." });
  }
});

// Create post
router.post('/', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: "Title and content are required." });

  try {
    const [result] = await db.execute('INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)', [title, content, req.user.id]);
    res.status(201).json({ id: result.insertId, message: "Post created successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error creating post." });
  }
});

// Update post
router.put('/:id', authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  
  try {
    const [posts] = await db.execute('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (posts.length === 0) return res.status(404).json({ error: "Post not found." });
    
    if (posts[0].author_id !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to update this post." });
    }

    await db.execute('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, req.params.id]);
    res.json({ message: "Post updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error updating post." });
  }
});

// Delete post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [posts] = await db.execute('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (posts.length === 0) return res.status(404).json({ error: "Post not found." });
    
    const isAdmin = req.user && req.user.username && req.user.username.trim().toLowerCase() === 'asd';

    if (posts[0].author_id !== req.user.id && !isAdmin) {
      const debugInfo = `User: ${req.user.username}, ID: ${req.user.id}, isAdmin: ${isAdmin}`;
      return res.status(403).json({ error: `You are not authorized to delete this post. (${debugInfo})` });
    }

    await db.execute('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: "Post deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting post." });
  }
});

module.exports = router;
