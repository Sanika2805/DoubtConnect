const express = require('express');
const mongoose = require('mongoose');
const Question = require('../models/Question');
const SUBJECTS = require('../config/subjects');
const auth = require('../middleware/auth');

const router = express.Router();

const AUTHOR_FIELDS = 'fullName username';

function person(u) {
  if (!u || !u._id) return { id: null, fullName: 'Deleted user', username: '' };
  return { id: u._id.toString(), fullName: u.fullName, username: u.username };
}

// Shape sent to the frontend.
function serialize(q) {
  return {
    id: q._id.toString(),
    title: q.title,
    subject: q.subject,
    description: q.description,
    author: person(q.author),
    answerCount: q.answers.length,
    solved: q.answers.length > 0,
    createdAt: q.createdAt,
    answers: q.answers.map((a) => ({
      id: a._id.toString(),
      content: a.content,
      author: person(a.author),
      createdAt: a.createdAt,
    })),
  };
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function validId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function loadFull(id) {
  return Question.findById(id)
    .populate('author', AUTHOR_FIELDS)
    .populate('answers.author', AUTHOR_FIELDS);
}

// GET /api/questions?search=&subject=&author=&limit=
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.subject && req.query.subject !== 'All') {
      filter.subject = req.query.subject;
    }
    if (req.query.search && req.query.search.trim()) {
      const rx = new RegExp(escapeRegex(req.query.search.trim()), 'i');
      filter.$or = [{ title: rx }, { description: rx }, { subject: rx }];
    }
    if (req.query.author && validId(req.query.author)) {
      filter.author = req.query.author;
    }

    let query = Question.find(filter).sort({ createdAt: -1 }).populate('author', AUTHOR_FIELDS);
    const limit = parseInt(req.query.limit, 10);
    if (limit > 0) query = query.limit(Math.min(limit, 100));

    const questions = await query;
    res.json({ questions: questions.map(serialize) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load questions.' });
  }
});

// GET /api/questions/:id
router.get('/:id', async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ message: 'Question not found.' });
    const q = await loadFull(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found.' });
    res.json({ question: serialize(q) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not load the question.' });
  }
});

// POST /api/questions   (logged in)
router.post('/', auth, async (req, res) => {
  try {
    const title = (req.body.title || '').trim();
    const subject = req.body.subject;
    const description = (req.body.description || '').trim();

    if (!title || !subject || !description) {
      return res.status(400).json({ message: 'Please fill all the fields.' });
    }
    if (!SUBJECTS.includes(subject)) {
      return res.status(400).json({ message: 'Please choose a valid subject.' });
    }

    const q = await Question.create({ title, subject, description, author: req.user._id });
    res.status(201).json({ question: serialize(await loadFull(q._id)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not post your doubt.' });
  }
});

// POST /api/questions/:id/answers   (logged in)
router.post('/:id/answers', auth, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ message: 'Question not found.' });
    const content = (req.body.content || '').trim();
    if (!content) return res.status(400).json({ message: 'Answer cannot be empty.' });

    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found.' });

    q.answers.push({ content, author: req.user._id });
    await q.save();
    res.status(201).json({ question: serialize(await loadFull(q._id)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not post your answer.' });
  }
});

// DELETE /api/questions/:id   (only the person who asked)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ message: 'Question not found.' });
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found.' });
    if (q.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own doubts.' });
    }
    await q.deleteOne();
    res.json({ message: 'Doubt deleted.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete the doubt.' });
  }
});

// DELETE /api/questions/:id/answers/:answerId   (only the person who answered)
router.delete('/:id/answers/:answerId', auth, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ message: 'Question not found.' });
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found.' });

    const answer = q.answers.id(req.params.answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found.' });
    if (answer.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own answers.' });
    }
    answer.deleteOne();
    await q.save();
    res.json({ question: serialize(await loadFull(q._id)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete the answer.' });
  }
});

module.exports = router;
