const Review = require('../models/Review');
const Movie = require('../models/Movie');

// @desc    Get all reviews for a movie with aggregate stats
// @route   GET /api/reviews/movie/:movieId
// @access  Public
exports.getMovieReviews = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const reviews = await Review.find({ movieId }).sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    let avgRating = 0;
    let distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let positivePercentage = 0;

    if (totalReviews > 0) {
      const sum = reviews.reduce((acc, r) => {
        distribution[r.rating] = (distribution[r.rating] || 0) + 1;
        return acc + r.rating;
      }, 0);
      avgRating = Number((sum / totalReviews).toFixed(1));

      // Calculate percentage of 4-star and 5-star reviews
      const positiveCount = (distribution[5] || 0) + (distribution[4] || 0);
      positivePercentage = Math.round((positiveCount / totalReviews) * 100);
    }

    res.status(200).json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews,
          avgRating: totalReviews > 0 ? avgRating : 8.5, // default fallback
          positivePercentage: totalReviews > 0 ? positivePercentage : 88,
          distribution,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update a review for a movie
// @route   POST /api/reviews/movie/:movieId
// @access  Private (User)
exports.addMovieReview = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { rating, headline, comment } = req.body;
    const userId = req.user._id;
    const userName = req.user.name;

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    let review = await Review.findOne({ movieId, userId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.headline = headline;
      review.comment = comment;
      await review.save();
    } else {
      // Create new review
      review = await Review.create({
        movieId,
        userId,
        userName,
        rating,
        headline,
        comment,
      });
    }

    // Recalculate movie average rating
    const allReviews = await Review.find({ movieId });
    const avg = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    // Scale 5-star to 10-point scale for consistency
    movie.rating = Number((avg * 2).toFixed(1));
    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
