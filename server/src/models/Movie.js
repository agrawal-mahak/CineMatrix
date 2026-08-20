const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a movie title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    duration: {
      type: Number,
      required: [true, 'Please add duration in minutes'],
    },
    genre: {
      type: [String],
      required: true,
    },
    language: {
      type: [String],
      required: true,
    },
    posterUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80',
    },
    bannerUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80',
    },
    trailerUrl: {
      type: String,
      default: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    },
    format: {
      type: [String],
      default: ['2D', '3D', 'IMAX'],
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Movie', MovieSchema);
