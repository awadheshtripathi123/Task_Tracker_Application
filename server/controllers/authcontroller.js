import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    } 
    
    const decoded = jwt.verify(
      refreshToken, 
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findOne({ _id: decoded._id, refreshToken });

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    } 
    
    const newAccessToken = user.generateAccessToken();

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  } 
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;  
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const user = await User.findOne({ refreshToken });

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    user.refreshToken = null;
    await user.save();

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
