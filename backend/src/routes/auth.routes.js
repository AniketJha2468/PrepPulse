const express = require('express');
const passport = require('../config/passport');

const authController = require('../controllers/auth.controller');
const validateRequest = require('../middleware/validateRequest');
const { authenticate } = require('../middleware/authenticate');
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', registerValidator, validateRequest, authController.register);
router.post('/login', loginValidator, validateRequest, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);
router.post(
  '/forgot-password',
  forgotPasswordValidator,
  validateRequest,
  authController.forgotPassword
);
router.post(
  '/reset-password/:token',
  resetPasswordValidator,
  validateRequest,
  authController.resetPassword
);
router.get('/me', authenticate, authController.getCurrentUser);

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback', authController.authenticateWithOAuth('google'));

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', authController.authenticateWithOAuth('github'));

module.exports = router;
