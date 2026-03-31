const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Register
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password are required." });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Username already exists." });
    }
    res.status(500).json({ error: "Server error during registration." });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.status(401).json({ error: "Invalid username or password." });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid username or password." });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
  }
});

module.exports = router;
