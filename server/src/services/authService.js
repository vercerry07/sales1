const User = require('../models/User');
const generateToken = require('../utils/generateToken');

class AuthService {
  /**
   * Register a new user
   */
  async register({ name, email, password, role }) {
    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      const error = new Error('User with this email already exists');
      error.statusCode = 400;
      throw error;
    }

    // Default to 'Sales User' if role invalid or omitted
    const assignedRole = ['Admin', 'Sales User'].includes(role) ? role : 'Sales User';

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
    });

    const token = generateToken(user._id);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  /**
   * Authenticate existing user & get token
   */
  async login({ email, password }) {
    // Find user and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  /**
   * Fetch user details by ID
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

module.exports = new AuthService();
