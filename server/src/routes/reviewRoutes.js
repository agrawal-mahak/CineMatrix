const express = require('express');
const { getMovieReviews, addMovieReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/movie/:movieId', getMovieReviews);
router.post('/movie/:movieId', protect, addMovieReview);

module.exports = router;
