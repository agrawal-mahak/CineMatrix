const express = require('express');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovie);
router.post('/', protect, authorize('ADMIN'), createMovie);
router.put('/:id', protect, authorize('ADMIN'), updateMovie);
router.delete('/:id', protect, authorize('ADMIN'), deleteMovie);

module.exports = router;
