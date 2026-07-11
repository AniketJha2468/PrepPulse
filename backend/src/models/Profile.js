const mongoose = require('mongoose');

const EXPERIENCE_LEVELS = Object.freeze({
  ENTRY: 'entry',
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  PRINCIPAL: 'principal',
});

const EXPERIENCE_LEVEL_VALUES = Object.values(EXPERIENCE_LEVELS);

const URL_REGEX = /^(https?:\/\/)[\w.-]+(\.[\w\.-]+)+[/#?]?.*$/;

const socialLinksSchema = new mongoose.Schema(
  {
    github: {
      type: String,
      trim: true,
      match: [URL_REGEX, 'Please provide a valid GitHub URL'],
      default: null,
    },
    linkedin: {
      type: String,
      trim: true,
      match: [URL_REGEX, 'Please provide a valid LinkedIn URL'],
      default: null,
    },
    portfolio: {
      type: String,
      trim: true,
      match: [URL_REGEX, 'Please provide a valid portfolio URL'],
      default: null,
    },
    twitter: {
      type: String,
      trim: true,
      match: [URL_REGEX, 'Please provide a valid Twitter/X URL'],
      default: null,
    },
  },
  { _id: false }
);

const locationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      trim: true,
      maxlength: [100, 'Country name cannot exceed 100 characters'],
      default: null,
    },
    city: {
      type: String,
      trim: true,
      maxlength: [100, 'City name cannot exceed 100 characters'],
      default: null,
    },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Profile must be linked to a user'],
      unique: true,
    },
    headline: {
      type: String,
      trim: true,
      maxlength: [150, 'Headline cannot exceed 150 characters'],
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: null,
    },
    experienceLevel: {
      type: String,
      enum: {
        values: EXPERIENCE_LEVEL_VALUES,
        message: '{VALUE} is not a valid experience level',
      },
      default: EXPERIENCE_LEVELS.ENTRY,
    },
    yearsOfExperience: {
      type: Number,
      min: [0, 'Years of experience cannot be negative'],
      max: [60, 'Years of experience must be realistic'],
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (skills) => skills.length <= 50,
        message: 'A profile cannot list more than 50 skills',
      },
      set: (skills) => [...new Set(skills.map((skill) => skill.trim().toLowerCase()))],
    },
    targetRoles: {
      type: [String],
      default: [],
      validate: {
        validator: (roles) => roles.length <= 20,
        message: 'A profile cannot list more than 20 target roles',
      },
      set: (roles) => [...new Set(roles.map((role) => role.trim()))],
    },
    resumeUrl: {
      type: String,
      trim: true,
      match: [URL_REGEX, 'Please provide a valid resume URL'],
      default: null,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: null,
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({}),
    },
    location: {
      type: locationSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

profileSchema.index({ skills: 1 });
profileSchema.index({ targetRoles: 1 });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
module.exports.EXPERIENCE_LEVELS = EXPERIENCE_LEVELS;
module.exports.EXPERIENCE_LEVEL_VALUES = EXPERIENCE_LEVEL_VALUES;
