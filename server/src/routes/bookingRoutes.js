const express = require('express');
const {
  holdSeats,
  confirmBooking,
  getMyBookings,
  cancelHold,
  validateCoupon,
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/hold', protect, holdSeats);
router.post('/confirm', protect, confirmBooking);
router.get('/my-bookings', protect, getMyBookings);
router.post('/cancel', protect, cancelHold);
router.post('/validate-coupon', validateCoupon);

module.exports = router;
