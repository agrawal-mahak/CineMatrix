const mongoose = require('mongoose');

const SeatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true }, // e.g. "A1"
  row: { type: String, required: true },        // e.g. "A"
  column: { type: Number, required: true },     // e.g. 1
  seatType: {
    type: String,
    enum: ['STANDARD', 'PREMIUM', 'VIP'],
    default: 'STANDARD',
  },
});

const ScreenSchema = new mongoose.Schema({
  screenNumber: { type: Number, required: true },
  name: { type: String, default: 'Screen 1' },
  totalSeats: { type: Number, required: true },
  seats: [SeatSchema],
});

const TheatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add theatre name'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please add city'],
      index: true,
    },
    address: {
      type: String,
      required: [true, 'Please add address'],
    },
    screens: [ScreenSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Theatre', TheatreSchema);
