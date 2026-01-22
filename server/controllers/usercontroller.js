import user from '../models/user.js';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }   
    const newUser = new user({ fullName, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  } 
};

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await user.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};  

