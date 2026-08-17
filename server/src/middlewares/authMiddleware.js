const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Authentication check
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route. Please login first.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'cinematrix_super_secret_jwt_key_2026_change_in_prod'
    );

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'User account no longer exists.',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please login again.',
    });
  }
};

// Grant access to specific roles - Authorization check
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user ? req.user.role : 'GUEST'}' is not authorized to perform this action. Requires: [${roles.join(', ')}]`,
      });
    }
    next();
  };
};
