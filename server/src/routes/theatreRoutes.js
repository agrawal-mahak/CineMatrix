const express = require('express');
const {
  getTheatres,
  getTheatre,
  createTheatre,
  updateTheatre,
} = require('../controllers/theatreController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getTheatres);
router.get('/:id', getTheatre);
router.post('/', protect, authorize('ADMIN'), createTheatre);
router.put('/:id', protect, authorize('ADMIN'), updateTheatre);

module.exports = router;
