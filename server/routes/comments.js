const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// Add comment
router.post('/', authenticateToken, async (req, res) => {
  const { post_id, comment } = req.body;
  if (!post_id || !comment) return res.status(400).json({ error: "Post ID and comment are required." });

  try {
    await db.execute('INSERT INTO comments (post_id, username, comment) VALUES (?, ?, ?)', [post_id, req.user.username, comment]);
    res.status(201).json({ message: "Comment added successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error adding comment." });
  }
});

// Update comment
router.put('/:id', authenticateToken, async (req, res) => {
  const { comment } = req.body;
  if (!comment) return res.status(400).json({ error: "Comment content is required." });

  try {
    const [comments] = await db.execute('SELECT * FROM comments WHERE id = ?', [req.params.id]);
    if (comments.length === 0) return res.status(404).json({ error: "Comment not found." });

    if (comments[0].username !== req.user.username) {
      return res.status(403).json({ error: "You are not authorized to update this comment." });
    }

    await db.execute('UPDATE comments SET comment = ? WHERE id = ?', [comment, req.params.id]);
    res.json({ message: "Comment updated successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error updating comment." });
  }
});

// Delete comment
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [comments] = await db.execute('SELECT * FROM comments WHERE id = ?', [req.params.id]);
    if (comments.length === 0) return res.status(404).json({ error: "Comment not found." });

    if (comments[0].username !== req.user.username) {
      return res.status(403).json({ error: "You are not authorized to delete this comment." });
    }

    await db.execute('DELETE FROM comments WHERE id = ?', [req.params.id]);
    res.json({ message: "Comment deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting comment." });
  }
});

module.exports = router;
