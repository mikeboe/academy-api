import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { authLimiter, loginLimiter, forgotPasswordLimiter } from '../middleware/rateLimiter';
import {
  register,
  login,
  refresh,
  logout,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword
} from '../controllers/auth';

const router = Router();

// Public routes
router.post('/register', authLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refresh);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, me);

export default router;