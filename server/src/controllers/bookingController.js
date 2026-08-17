const Show = require('../models/Show');
const Booking = require('../models/Booking');

// Helper generator for unique booking IDs
const generateBookingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'CNX-';
  for (let i = 0; i < 6; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

// @desc    Hold seats for 10 minutes
// @route   POST /api/bookings/hold
// @access  Private
exports.holdSeats = async (req, res, next) => {
  try {
    const { showId, seatNumbers } = req.body;

    if (!showId || !seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid showId and an array of seatNumbers',
      });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, error: 'Showtime not found' });
    }

    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

    // Verify seat availability
    let totalAmount = 0;
    const unavailableSeats = [];

    seatNumbers.forEach((seatNum) => {
      const showSeat = show.seats.find((s) => s.seatNumber === seatNum);
      if (!showSeat) {
        unavailableSeats.push(`${seatNum} (Invalid Seat)`);
        return;
      }

      // Check if seat is booked or currently held by another user (and not expired)
      const isExpiredHold = showSeat.status === 'HELD' && showSeat.heldUntil && new Date(showSeat.heldUntil) < now;
      const isAvailable = showSeat.status === 'AVAILABLE' || isExpiredHold || (showSeat.status === 'HELD' && showSeat.heldBy?.toString() === req.user.id);

      if (!isAvailable) {
        unavailableSeats.push(seatNum);
      } else {
        totalAmount += showSeat.price;
      }
    });

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        success: false,
        error: `Seats [${unavailableSeats.join(', ')}] are not available for booking`,
      });
    }

    // Apply 10-minute hold on selected seats
    show.seats.forEach((s) => {
      if (seatNumbers.includes(s.seatNumber)) {
        s.status = 'HELD';
        s.heldBy = req.user.id;
        s.heldUntil = tenMinutesLater;
      }
    });

    await show.save();

    // Create Booking record
    const createdBooking = await Booking.create({
      bookingId: generateBookingId(),
      userId: req.user.id,
      showId,
      seats: seatNumbers,
      totalAmount,
      status: 'HELD',
      expiresAt: tenMinutesLater,
    });

    // Populate showId, movieId, and theatreId
    const booking = await Booking.findById(createdBooking._id).populate({
      path: 'showId',
      populate: [
        { path: 'movieId', select: 'title posterUrl bannerUrl duration rating genre language' },
        { path: 'theatreId', select: 'name city address screens' },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Seats held successfully for 10 minutes',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm booking (Finalize purchase)
// @route   POST /api/bookings/confirm
// @access  Private
exports.confirmBooking = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ bookingId, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.status === 'CONFIRMED') {
      return res.status(400).json({ success: false, error: 'Booking is already confirmed' });
    }

    const now = new Date();
    if (new Date(booking.expiresAt) < now) {
      booking.status = 'EXPIRED';
      await booking.save();
      return res.status(400).json({ success: false, error: 'Hold timeout expired. Please select seats again.' });
    }

    const show = await Show.findById(booking.showId);
    if (!show) {
      return res.status(404).json({ success: false, error: 'Showtime not found' });
    }

    // Mark seats as BOOKED in Show model
    show.seats.forEach((s) => {
      if (booking.seats.includes(s.seatNumber)) {
        s.status = 'BOOKED';
        s.heldBy = null;
        s.heldUntil = null;
      }
    });

    await show.save();

    // Update booking status
    booking.status = 'CONFIRMED';
    await booking.save();

    // Populate full show, movie, and theatre details
    const populatedBooking = await Booking.findById(booking._id).populate({
      path: 'showId',
      populate: [
        { path: 'movieId', select: 'title posterUrl bannerUrl duration rating genre language' },
        { path: 'theatreId', select: 'name city address screens' },
      ],
    });

    res.status(200).json({
      success: true,
      message: 'Booking confirmed successfully!',
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's booking history
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title posterUrl bannerUrl duration genre language' },
          { path: 'theatreId', select: 'name city address' },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an active hold
// @route   POST /api/bookings/cancel
// @access  Private
exports.cancelHold = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findOne({ bookingId, userId: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.status !== 'HELD') {
      return res.status(400).json({ success: false, error: `Cannot cancel booking with status '${booking.status}'` });
    }

    const show = await Show.findById(booking.showId);
    if (show) {
      show.seats.forEach((s) => {
        if (booking.seats.includes(s.seatNumber) && s.status === 'HELD') {
          s.status = 'AVAILABLE';
          s.heldBy = null;
          s.heldUntil = null;
        }
      });
      await show.save();
    }

    booking.status = 'CANCELLED';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Hold cancelled and seats released successfully',
    });
  } catch (error) {
    next(error);
  }
};
