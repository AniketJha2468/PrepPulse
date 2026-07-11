const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const env = require('../config/env');

/**
 * Signs a short-lived JWT access token for an authenticated user.
 * @param {Object} payload - Data to embed in the token (e.g. { sub, role }).
 * @returns {string} A signed JWT.
 */
const generateAccessToken = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

/**
 * Verifies and decodes a JWT access token.
 * @param {string} token - The JWT to verify.
 * @returns {Object} The decoded token payload.
 * @throws {Error} If the token is invalid or expired.
 */
const verifyAccessToken = (token) => jwt.verify(token, env.JWT_SECRET);

/**
 * Generates a cryptographically secure, URL-safe opaque token.
 * Used for refresh tokens and password reset tokens, which are never
 * stored in plaintext - only their SHA-256 hash is persisted.
 * @param {number} [byteLength=32] - Number of random bytes to generate.
 * @returns {string} A hex-encoded random token.
 */
const generateSecureToken = (byteLength = 32) => crypto.randomBytes(byteLength).toString('hex');

/**
 * Produces a SHA-256 hash of a raw token for safe database storage/lookup.
 * @param {string} rawToken - The plaintext token to hash.
 * @returns {string} The hex-encoded hash.
 */
const hashToken = (rawToken) => crypto.createHash('sha256').update(rawToken).digest('hex');

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  generateSecureToken,
  hashToken,
};
