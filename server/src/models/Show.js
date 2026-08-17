const mongoose = require('mongoose');

const ShowSeatStatusSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true }, // e.g. "A1"
  status: {
    type: String,
    enum: ['AVAILABLE', 'HELD', 'BOOKED'],
    default: 'AVAILABLE',
  },
  heldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  heldUntil: {
    type: Date,
    default: null,
  },
  price: {
    type: Number,
    required: true,
  },
});

const ShowSchema = new mongoose.Schema(
  {
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatreId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    screenNumber: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    pricing: {
      STANDARD: { type: Number, default: 200 },
      PREMIUM: { type: Number, default: 350 },
      VIP: { type: Number, default: 500 },
    },
    seats: [ShowSeatStatusSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Show', ShowSchema);
