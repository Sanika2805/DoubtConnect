const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    password: { type: String, required: true }, // bcrypt hash, never plain text
    email: { type: String, trim: true, lowercase: true, default: '' },
    course: { type: String, trim: true, default: '' },
    division: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

// Safe version of the user to send to the browser (no password).
userSchema.methods.toPublic = function () {
  return {
    id: this._id.toString(),
    fullName: this.fullName,
    username: this.username,
    email: this.email,
    course: this.course,
    division: this.division,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
