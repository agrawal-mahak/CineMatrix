const express = require('express');
const { getShows, getShow, createShow } = require('../controllers/showController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getShows);
router.get('/:id', getShow);
router.post('/', protect, authorize('ADMIN'), createShow);

module.exports = router;
