const mongoose = require('mongoose');

const { THEMES, THEME_VALUES } = require('../constants/theme.constants');
const { LANGUAGES, LANGUAGE_VALUES } = require('../constants/language.constants');
const { DIFFICULTY_LEVELS, DIFFICULTY_LEVEL_VALUES } = require('../constants/difficulty.constants');
const { INTERVIEW_TYPE_VALUES } = require('../constants/interviewType.constants');
const { PRIVACY_LEVELS, PRIVACY_LEVEL_VALUES } = require('../constants/privacyLevel.constants');

const interviewPreferencesSchema = new mongoose.Schema(
  {
    defaultDuration: {
      type: Number,
      min: [5, 'Default interview duration must be at least 5 minutes'],
      max: [180, 'Default interview duration cannot exceed 180 minutes'],
      default: 30,
    },
    preferredDifficulty: {
      type: String,
      enum: {
        values: DIFFICULTY_LEVEL_VALUES,
        message: '{VALUE} is not a valid difficulty level',
      },
      default: DIFFICULTY_LEVELS.MEDIUM,
    },
    preferredTypes: {
      type: [String],
      enum: {
        values: INTERVIEW_TYPE_VALUES,
        message: '{VALUE} is not a valid interview type',
      },
      default: [],
    },
    voiceInterviewEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const privacySettingsSchema = new mongoose.Schema(
  {
    profileVisibility: {
      type: String,
      enum: {
        values: PRIVACY_LEVEL_VALUES,
        message: '{VALUE} is not a valid privacy level',
      },
      default: PRIVACY_LEVELS.PRIVATE,
    },
    showActivityStatus: {
      type: Boolean,
      default: true,
    },
    allowDataAnalytics: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const settingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Settings must be linked to a user'],
      unique: true,
    },
    theme: {
      type: String,
      enum: {
        values: THEME_VALUES,
        message: '{VALUE} is not a valid theme',
      },
      default: THEMES.SYSTEM,
    },
    language: {
      type: String,
      enum: {
        values: LANGUAGE_VALUES,
        message: '{VALUE} is not a supported language',
      },
      default: LANGUAGES.ENGLISH,
    },
    emailNotificationsEnabled: {
      type: Boolean,
      default: true,
    },
    browserNotificationsEnabled: {
      type: Boolean,
      default: true,
    },
    interviewPreferences: {
      type: interviewPreferencesSchema,
      default: () => ({}),
    },
    privacySettings: {
      type: privacySettingsSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
