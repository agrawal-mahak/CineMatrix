const Theatre = require('../models/Theatre');

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
exports.getTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const query = city ? { city: new RegExp(city, 'i') } : {};
    const theatres = await Theatre.find(query);
    res.status(200).json({ success: true, count: theatres.length, theatres });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single theatre
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({ success: false, error: 'Theatre not found' });
    }
    res.status(200).json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new theatre (Admin only)
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);
    res.status(201).json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre (Admin only)
// @route   PUT /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!theatre) {
      return res.status(404).json({ success: false, error: 'Theatre not found' });
    }
    res.status(200).json({ success: true, theatre });
  } catch (error) {
    next(error);
  }
};
