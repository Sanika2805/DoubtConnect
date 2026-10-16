const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// PUT /api/users/profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, email, course, division } = req.body;
    if (fullName !== undefined && !String(fullName).trim()) {
      return res.status(400).json({ message: 'Name cannot be empty.' });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email.' });
    }

    const user = req.user;
    if (fullName !== undefined) user.fullName = String(fullName).trim();
    if (email !== undefined) user.email = String(email).trim();
    if (course !== undefined) user.course = String(course).trim();
    if (division !== undefined) user.division = String(division).trim();
    await user.save();

    res.json({ user: user.toPublic() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update profile.' });
  }
});

// GET /api/users/stats  - numbers for the dashboard / profile
router.get('/stats', auth, async (req, res) => {
  try {
    const id = req.user._id;
    const [asked, solved, answered] = await Promise.all([
      Question.countDocuments({ author: id }),
      Question.countDocuments({ author: id, 'answers.0': { $exists: true } }),
      Question.aggregate([
        { $unwind: '$answers' },
        { $match: { 'answers.author': id } },
        { $count: 'total' },
      ]),
    ]);
    res.json({ asked, solved, answersGiven: answered[0] ? answered[0].total : 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load stats.' });
  }
});

module.exports = router;
