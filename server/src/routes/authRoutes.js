const express = require('express');
const {
  register,
  login,
  getMe,
  updateDetails,
  getUsers,
} = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.get('/users', protect, authorize('ADMIN'), getUsers);

module.exports = router;
