const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const fullName = (req.body.fullName || '').trim();
    const username = (req.body.username || '').trim().toLowerCase();
    const password = req.body.password || '';

    if (!fullName || !username || !password) {
      return res.status(400).json({ message: 'Please fill all the fields.' });
    }
    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
    if (await User.findOne({ username })) {
      return res.status(409).json({ message: 'This username is already taken.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, username, password: hash });

    res.status(201).json({ token: signToken(user), user: user.toPublic() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create account. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const username = (req.body.username || '').trim().toLowerCase();
    const password = req.body.password || '';
    if (!username || !password) {
      return res.status(400).json({ message: 'Please enter username and password.' });
    }

    const user = await User.findOne({ username });
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ message: 'Invalid username or password.' });

    res.json({ token: signToken(user), user: user.toPublic() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me  - who is logged in (used to restore session on refresh)
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user.toPublic() });
});

module.exports = router;
