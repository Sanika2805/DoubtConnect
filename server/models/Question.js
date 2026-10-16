const mongoose = require('mongoose');
const SUBJECTS = require('../config/subjects');

const answerSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    subject: { type: String, required: true, enum: SUBJECTS },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    answers: [answerSchema],
  },
  { timestamps: true }
);

questionSchema.index({ createdAt: -1 });
questionSchema.index({ author: 1 });

module.exports = mongoose.model('Question', questionSchema);
