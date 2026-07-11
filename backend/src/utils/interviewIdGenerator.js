const crypto = require('crypto');

const ID_PREFIX = 'INT';
const RANDOM_BYTE_LENGTH = 6;

/**
 * Builds a compact YYYYMMDD date segment from the current date.
 * @returns {string}
 */
const buildDateSegment = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
};

/**
 * Generates a unique, human-readable interview ID suitable for production use.
 * Format: INT-YYYYMMDD-XXXXXXXXXXXX
 * The random segment is derived from cryptographically secure random bytes,
 * making collisions practically impossible even under concurrent generation.
 * @returns {string} A unique interview identifier.
 */
const generateInterviewId = () => {
  const dateSegment = buildDateSegment();
  const randomSegment = crypto.randomBytes(RANDOM_BYTE_LENGTH).toString('hex').toUpperCase();
  return `${ID_PREFIX}-${dateSegment}-${randomSegment}`;
};

module.exports = {
  generateInterviewId,
};
