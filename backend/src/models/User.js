const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { USER_ROLES, USER_ROLE_VALUES } = require('../constants/roles.constants');
const { ACCOUNT_STATUS, ACCOUNT_STATUS_VALUES } = require('../constants/accountStatus.constants');
const { AUTH_PROVIDERS, AUTH_PROVIDER_VALUES } = require('../constants/authProviders.constants');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters long'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, 'Please provide a valid email address'],
      index: true,
    },
    password: {
      type: String,
      required: [
        function isPasswordRequired() {
          return this.authProvider === AUTH_PROVIDERS.LOCAL;
        },
        'Password is required for local accounts',
      ],
      minlength: [8, 'Password must be at least 8 characters long'],
      select: false,
    },
    authProvider: {
      type: String,
      enum: {
        values: AUTH_PROVIDER_VALUES,
        message: '{VALUE} is not a supported authentication provider',
      },
      default: AUTH_PROVIDERS.LOCAL,
      required: true,
    },
    providerId: {
      type: String,
      default: null,
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: USER_ROLE_VALUES,
        message: '{VALUE} is not a valid user role',
      },
      default: USER_ROLES.CANDIDATE,
      required: true,
    },
    accountStatus: {
      type: String,
      enum: {
        values: ACCOUNT_STATUS_VALUES,
        message: '{VALUE} is not a valid account status',
      },
      default: ACCOUNT_STATUS.ACTIVE,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: null,
      trim: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure OAuth accounts are uniquely identified per provider
userSchema.index(
  { authProvider: 1, providerId: 1 },
  {
    unique: true,
    partialFilterExpression: { providerId: { $type: 'string' } },
  }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }

  return next();
});

userSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  if (!this.password) {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changedPasswordAfter = function changedPasswordAfter(tokenIssuedAtSeconds) {
  if (!this.passwordChangedAt) {
    return false;
  }
  const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
  return tokenIssuedAtSeconds < changedTimestamp;
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.providerId;
  delete userObject.passwordChangedAt;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
