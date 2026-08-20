const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    headline: {
      type: String,
      required: [true, 'Please add a review title/headline'],
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: [true, 'Please add a review comment'],
      trim: true,
      maxlength: 1000,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for the same movie
ReviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', ReviewSchema);
