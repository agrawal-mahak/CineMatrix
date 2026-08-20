const express = require('express');
const {
  holdSeats,
  confirmBooking,
  getMyBookings,
  cancelHold,
  validateCoupon,
  getAdminAnalytics,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/hold', protect, holdSeats);
router.post('/confirm', protect, confirmBooking);
router.get('/my-bookings', protect, getMyBookings);
router.post('/cancel', protect, cancelHold);
router.post('/validate-coupon', validateCoupon);

// Admin Box Office Revenue & Analytics
router.get('/admin/analytics', protect, authorize('ADMIN'), getAdminAnalytics);

module.exports = router;
