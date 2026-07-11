const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Refresh token must be linked to a user'],
      index: true,
    },
    tokenHash: {
      type: String,
      required: [true, 'Token hash is required'],
      unique: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Refresh token must have an expiration date'],
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    replacedByTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    userAgent: {
      type: String,
      trim: true,
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically purge expired refresh tokens from the collection
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

refreshTokenSchema.methods.revoke = function revoke(replacedByTokenHash = null) {
  this.isRevoked = true;
  this.revokedAt = new Date();
  if (replacedByTokenHash) {
    this.replacedByTokenHash = replacedByTokenHash;
  }
  return this;
};

refreshTokenSchema.methods.isActive = function isActive() {
  return !this.isRevoked && this.expiresAt.getTime() > Date.now();
};

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

module.exports = RefreshToken;
