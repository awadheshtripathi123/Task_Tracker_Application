import express from 'express';
import { registerUser, getCurrentUser } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/user', auth, getCurrentUser);

export default router;