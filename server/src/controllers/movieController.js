const Movie = require('../models/Movie');

// @desc    Get all active movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ isActive: true }).sort({ releaseDate: -1 });
    res.status(200).json({
      success: true,
      count: movies.length,
      movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }
    res.status(200).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new movie (Admin only)
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie (Admin only)
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }
    res.status(200).json({ success: true, movie });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie (Admin only)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!movie) {
      return res.status(404).json({ success: false, error: 'Movie not found' });
    }
    res.status(200).json({ success: true, message: 'Movie deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
