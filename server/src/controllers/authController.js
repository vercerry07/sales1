const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Please provide name, email and password');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters');
    }

    const userData = await authService.register({ name, email, password, role });
    return sendSuccess(res, 201, 'User registered successfully', userData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    const userData = await authService.login({ email, password });
    return sendSuccess(res, 200, 'Logged in successfully', userData);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const userData = await authService.getUserById(req.user._id);
    return sendSuccess(res, 200, 'User profile fetched successfully', userData);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
