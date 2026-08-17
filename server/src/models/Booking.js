const mongoose = require('mongoose');

const SnackItemSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  price: { type: Number },
  quantity: { type: Number },
});

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    seats: [
      {
        type: String,
        required: true,
      },
    ],
    snacks: [SnackItemSchema],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['HELD', 'CONFIRMED', 'CANCELLED', 'EXPIRED'],
      default: 'HELD',
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', BookingSchema);
