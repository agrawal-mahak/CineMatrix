const Show = require('../models/Show');
const Theatre = require('../models/Theatre');

// @desc    Get shows filtered by movie, theatre, or city
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, date } = req.query;
    const filter = {};

    if (movieId) filter.movieId = movieId;
    if (theatreId) filter.theatreId = theatreId;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.startTime = { $gte: startOfDay, $lte: endOfDay };
    }

    const shows = await Show.find(filter)
      .populate('movieId', 'title genre duration posterUrl bannerUrl rating')
      .populate('theatreId', 'name city address')
      .select('-seats');

    res.status(200).json({ success: true, count: shows.length, shows });
  } catch (error) {
    next(error);
  }
};

// @desc    Get show by ID (including seat layout & real-time availability)
// @route   GET /api/shows/:id
// @access  Public
exports.getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId', 'title genre duration posterUrl rating')
      .populate('theatreId', 'name city address screens');

    if (!show) {
      return res.status(404).json({ success: false, error: 'Showtime not found' });
    }

    // Clean expired holds on-the-fly before returning
    const now = new Date();
    let updated = false;

    show.seats.forEach((seat) => {
      if (seat.status === 'HELD' && seat.heldUntil && new Date(seat.heldUntil) < now) {
        seat.status = 'AVAILABLE';
        seat.heldBy = null;
        seat.heldUntil = null;
        updated = true;
      }
    });

    if (updated) {
      await show.save();
    }

    res.status(200).json({ success: true, show });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new show schedule (Admin only)
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const { movieId, theatreId, screenNumber, startTime, pricing } = req.body;

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ success: false, error: 'Theatre not found' });
    }

    const screen = theatre.screens.find((s) => s.screenNumber === Number(screenNumber));
    if (!screen) {
      return res.status(400).json({ success: false, error: `Screen ${screenNumber} not found in this theatre` });
    }

    const prices = pricing || { STANDARD: 200, PREMIUM: 350, VIP: 500 };

    // Generate initial seat status map based on screen seats
    const seats = screen.seats.map((seat) => ({
      seatNumber: seat.seatNumber,
      status: 'AVAILABLE',
      heldBy: null,
      heldUntil: null,
      price: prices[seat.seatType] || prices.STANDARD,
    }));

    const show = await Show.create({
      movieId,
      theatreId,
      screenNumber,
      startTime,
      pricing: prices,
      seats,
    });

    res.status(201).json({ success: true, show });
  } catch (error) {
    next(error);
  }
};
